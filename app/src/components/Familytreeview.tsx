"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PersonNode from "./PersonNode";
import { buildTree, addChildToPersons } from "../utils/buildTree";
import AddChildModal from "../modal/AddChildModal";
import type { ParentId, Person, PersonNode as PersonNodeType } from "../types";
import { saveFamily } from "../utils/saveFamily";
// ─── Types ────────────────────────────────────────────────────────────────────

interface FamilyTreeViewProps {
  initialPersons: Person[];
  groupSelection: {};
}

type SaveStatus = "idle" | "saving" | "saved" | "error";
type ToastVariant = "success" | "error" | "loading";
interface ToastState {
  msg: string;
  variant: ToastVariant;
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  cream: "#fffdf8",
  parchment: "#fdf6ec",
  sand: "#ddd4c5",
  gold: "#c9a96e",
  oak: "#a8845a",
  umber: "#7a5c35",
  bark: "#2c1f0e",
  muted: "#9a8570",
  warm100: "rgba(201,169,110,0.12)",
  error: "#c0392b",
  success: "#2d6a4f",
};

// ─── API helpers ──────────────────────────────────────────────────────────────

async function saveToServer(persons: Person[]): Promise<boolean> {
  try {
    const res = await fetch("/api/family", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persons }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// function saveToLocalStorage(key: string, persons: Person[]): void {
//   try {
//     localStorage.setItem(key, JSON.stringify(persons));
//   } catch {
//     /* ignore */
//   }
// }

// function loadFromLocalStorage(key: string, fallback: Person[]): Person[] {
//   try {
//     const raw = localStorage.getItem(key);
//     if (!raw) return fallback;
//     const parsed = JSON.parse(raw) as Person[];
//     return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
//   } catch {
//     return fallback;
//   }
// }

function downloadJSON(persons: Person[]): void {
  const blob = new Blob([JSON.stringify({ persons }, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "family.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

// ─── Toast ────────────────────────────────────────────────────────────────────

const TOAST_ICON: Record<ToastVariant, string> = {
  success: "✓",
  error: "✕",
  loading: "⟳",
};
const TOAST_COLOR: Record<ToastVariant, string> = {
  success: C.gold,
  error: "#e07060",
  loading: C.muted,
};

const Toast = ({
  toast,
  onDone,
}: {
  toast: ToastState;
  onDone: () => void;
}) => {
  useEffect(() => {
    if (toast.variant === "loading") return;
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [toast, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 28,
        left: "50%",
        transform: "translateX(-50%)",
        background: C.bark,
        color: C.cream,
        padding: "11px 20px",
        borderRadius: 12,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 6px 20px rgba(44,31,14,0.25)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 8,
        animation: "ft-toast-in 0.22s ease forwards",
        border: `1px solid ${C.oak}`,
        minWidth: 220,
      }}
    >
      <span
        aria-hidden
        style={{
          color: TOAST_COLOR[toast.variant],
          display: "inline-block",
          animation:
            toast.variant === "loading" ? "ft-spin 1s linear infinite" : "none",
        }}
      >
        {TOAST_ICON[toast.variant]}
      </span>
      {toast.msg}
    </div>
  );
};

// ─── Save Status ──────────────────────────────────────────────────────────────

const SaveStatusDot = ({ status }: { status: SaveStatus }) => {
  const cfg = {
    idle: { dot: C.sand, text: "No changes" },
    saving: { dot: C.gold, text: "Saving…" },
    saved: { dot: C.success, text: "Saved to disk" },
    error: { dot: C.error, text: "Save failed" },
  }[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        color: C.muted,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
      }}
    >
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: cfg.dot,
          display: "inline-block",
          animation: status === "saving" ? "ft-pulse 1s ease infinite" : "none",
        }}
      />
      {cfg.text}
    </div>
  );
};

// ─── Toolbar Button ───────────────────────────────────────────────────────────

const ToolbarButton = ({
  icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
}) => {
  const s = {
    default: { bg: "transparent", color: C.bark, border: C.sand },
    primary: {
      bg: `linear-gradient(135deg, ${C.oak}, ${C.umber})`,
      color: C.cream,
      border: "transparent",
    },
    danger: { bg: "transparent", color: C.error, border: "#e8a49a" },
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 14px",
        borderRadius: 10,
        border: `1.5px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.16s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          ((e.currentTarget.style.opacity =
            variant === "primary" ? "0.85" : "1"),
            (e.currentTarget.style.background =
              variant !== "primary" ? C.warm100 : s.bg));
      }}
      onMouseLeave={(e) => {
        if (!disabled)
          ((e.currentTarget.style.opacity = "1"),
            (e.currentTarget.style.background = s.bg));
      }}
    >
      <span aria-hidden>{icon}</span>
      {label}
    </button>
  );
};

// ─── JSON Drawer ──────────────────────────────────────────────────────────────

const JSONDrawer = ({ persons }: { persons: Person[] }) => {
  const [open, setOpen] = useState(false);
  const json = JSON.stringify({ persons }, null, 2);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 24,
        zIndex: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          padding: "8px 16px",
          borderRadius: "10px 10px 0 0",
          border: `1.5px solid ${C.sand}`,
          borderBottom: "none",
          background: open
            ? C.bark
            : `linear-gradient(160deg, ${C.cream}, ${C.parchment})`,
          color: open ? C.cream : C.umber,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          transition: "all 0.18s",
        }}
      >
        {open ? "✕ Close" : "{ } Live JSON"}
      </button>

      {open && (
        <div
          style={{
            background: C.bark,
            border: `1px solid rgba(201,169,110,0.3)`,
            borderBottom: "none",
            borderRadius: "10px 0 0 0",
            width: 440,
            height: 360,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid rgba(201,169,110,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: C.gold,
              }}
            >
              family.json — {persons.length} persons
            </span>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(json)}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: `1px solid rgba(201,169,110,0.3)`,
                background: "transparent",
                color: C.gold,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Copy
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: "14px 16px",
              overflow: "auto",
              flex: 1,
              fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              fontSize: 11,
              lineHeight: 1.6,
              color: "#e8d9c0",
            }}
          >
            {json}
          </pre>
        </div>
      )}
    </div>
  );
};

// ─── FamilyTreeView ───────────────────────────────────────────────────────────

const FamilyTreeView = ({
  initialPersons,
  groupSelection,
}: FamilyTreeViewProps) => {
  const [persons, setPersons] = useState<Person[]>(initialPersons);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddChildOpen, setAddChildOpen] = useState(false);
  // const [persons, setPersons] = useState<Person[]>(() =>
  //   // loadFromLocalStorage('storageKey', initialPersons),
  // setPersons(initialPersons)
  // );

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  const tree: PersonNodeType | null = buildTree(initialPersons);

  // ── Persist on every change ────────────────────────────────────────────────
  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     return;
  //   }

  //   // Immediate localStorage write (fast fallback)
  //   saveToLocalStorage('storageKey', persons);

  //   // Async write to public/data/family.json via API route
  //   setSaveStatus("saving");
  // saveToServer(persons).then((ok) => {
  //   if (ok) {
  //     setSaveStatus("saved");
  //     setTimeout(() => setSaveStatus("idle"), 3000);
  //   } else {
  //     setSaveStatus("error");
  //     setToast({
  //       msg: "Could not write to family.json — is the dev server running?",
  //       variant: "error",
  //     });
  //   }
  // });
  // }, [persons]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAddPerson = useCallback(
    (parentId: ParentId, child: Person) => {
      setPersons((prev) => addChildToPersons(prev, parentId, child));
      setToast({
        msg: `${child.name} added to the family tree`,
        variant: "success",
      });
      saveFamily(addChildToPersons(persons, null, child)).then((ok) => {
        if (!ok) {
          setToast({
            msg: "Failed to save changes to family.json",
            variant: "error",
          });
        }
      });
    },
    [],
  );

  const handleExport = useCallback(() => {
    downloadJSON(persons);
    setToast({ msg: "JSON exported", variant: "success" });
  }, [persons]);

  const handleReset = useCallback(() => {
    if (!window.confirm("Reset to original data? All changes will be lost."))
      return;
    setPersons(initialPersons);
    setToast({ msg: "Tree reset to original data", variant: "success" });
  }, [initialPersons]);

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };
  const addFamilyDataClick = () => {
    setModalOpen(true);
    setAddChildOpen(true);
  };

  const handleAddChildSave = useCallback((child: Person) => {
    console.log("child-----------------", child);

    setModalOpen(false);
    setAddChildOpen(false);
    saveFamily(addChildToPersons(persons, null, child)).then((ok) => {
      if (!ok) {
        setToast({
          msg: "Failed to save changes to family.json",
          variant: "error",
        });
      }
    });
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          const arr: Person[] = parsed?.persons ?? parsed;
          if (!Array.isArray(arr) || !arr.length) throw new Error();
          setPersons(arr);
          setToast({
            msg: `Imported ${arr.length} persons`,
            variant: "success",
          });
          setImportError(null);
        } catch {
          setImportError("Invalid JSON. Expected { persons: [...] }");
        }
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [],
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@400;500;700&display=swap');
        @keyframes ft-toast-in { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes ft-tree-in  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ft-pulse    { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes ft-spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing:border-box; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: `radial-gradient(ellipse at 60% 0%, #f5e9d4 0%, ${C.cream} 55%, #faf6f0 100%)`,
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
        }}
      >
        {/* Grain */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.6,
          }}
        />

        {/* Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 500,
            display: "flex",
            alignItems: "center",
            padding: "14px 28px",
            background: "rgba(253,246,236,0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: `1px solid ${C.sand}`,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22,
                fontWeight: 600,
                color: C.bark,
              }}
            >
              Family Tree
            </h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: C.gold,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Heritage
            </span>
          </div>

          <div
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              background: C.warm100,
              border: `1px solid ${C.sand}`,
              fontSize: 12,
              color: C.muted,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span aria-hidden style={{ color: C.gold }}>
              ◈
            </span>
            {persons.length} member{persons.length !== 1 ? "s" : ""}
          </div>

          {/* ← Save status lives in the header so it's always visible */}
          <SaveStatusDot status={saveStatus} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginLeft: "auto",
            }}
          >
            <ToolbarButton
              icon="⬆"
              label="Import"
              onClick={handleImportClick}
            />
            <ToolbarButton
              icon="⬇"
              label="Export JSON"
              onClick={handleExport}
            />
            <ToolbarButton
              icon="↺"
              label="Reset"
              onClick={handleReset}
              variant="danger"
            />
          </div>
        </header>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          style={{ display: "none" }}
          aria-hidden
        />

        {importError && (
          <div
            role="alert"
            style={{
              margin: "12px 28px 0",
              padding: "10px 16px",
              borderRadius: 10,
              background: "#fff5f5",
              border: "1px solid #f0c0bb",
              color: C.error,
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span aria-hidden>⚠</span>
            {importError}
            <button
              type="button"
              onClick={() => setImportError(null)}
              style={{
                marginLeft: "auto",
                border: "none",
                background: "none",
                color: C.error,
                cursor: "pointer",
                fontSize: 16,
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <main
          style={{
            position: "relative",
            zIndex: 1,
            padding: "48px 32px 100px",
            overflowX: "auto",
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {tree ? (
            <div
              style={{
                animation: "ft-tree-in 0.4s ease forwards",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                aria-hidden
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.gold,
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ height: 1, width: 32, background: C.sand }} />
                Root Generation
                <div style={{ height: 1, width: 32, background: C.sand }} />
              </div>
              <PersonNode
                person={tree}
                onAddPerson={handleAddPerson}
                depth={0}
                hasStem={false}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                marginTop: 80,
                color: C.muted,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: `2px dashed ${C.sand}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                }}
              >
                🌳
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 18,
                  color: C.muted,
                }}
              >
                No family data found
              </p>
              <p style={{ margin: 0, fontSize: 13, color: C.sand }}>
                Import a JSON file or check your initial data
              </p>
              <button
                type="button"
                onClick={addFamilyDataClick}
                style={{
                  marginTop: 8,
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: `1.5px solid ${C.gold}`,
                  background: C.warm100,
                  color: C.umber,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Add Family Data
              </button>
            </div>
          )}
        </main>

        <JSONDrawer persons={persons} />
      </div>

      {toast && <Toast toast={toast} onDone={() => setToast(null)} />}
      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setAddChildOpen(false)}
        parentId={null}
        onSave={handleAddChildSave}
      />
    </>
  );
};

export default FamilyTreeView;
