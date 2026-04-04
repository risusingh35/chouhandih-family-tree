"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import PersonNode from "./PersonNode";
import {
  buildTree,
  addChildToPersons,
  type Person,
  type PersonNode as PersonNodeType,
} from "../utils/buildTree";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FamilyTreeViewProps {
  /** Initial flat persons array from your JSON file */
  initialPersons: Person[];
  /** localStorage key (default: "family-tree-data") */
  storageKey?: string;
}

// ─── Palette (shared with AddChildModal / PersonNode) ─────────────────────────

const C = {
  cream:    "#fffdf8",
  parchment:"#fdf6ec",
  sand:     "#ddd4c5",
  gold:     "#c9a96e",
  oak:      "#a8845a",
  umber:    "#7a5c35",
  bark:     "#2c1f0e",
  muted:    "#9a8570",
  warm100:  "rgba(201,169,110,0.12)",
  warm200:  "rgba(201,169,110,0.35)",
  error:    "#c0392b",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage(key: string, fallback: Person[]): Person[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Person[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, persons: Person[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(persons));
  } catch {
    console.warn("Failed to save family tree to localStorage");
  }
}

function downloadJSON(persons: Person[], filename = "family-tree.json"): void {
  const blob = new Blob(
    [JSON.stringify({ persons }, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = ({ msg, onDone }: { msg: string; onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

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
        letterSpacing: "0.02em",
      }}
    >
      <span aria-hidden style={{ color: C.gold }}>✓</span>
      {msg}
    </div>
  );
};

// ─── Toolbar ─────────────────────────────────────────────────────────────────

const ToolbarButton = ({
  icon,
  label,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "danger";
}) => {
  const bg: Record<string, string> = {
    default: "transparent",
    primary: `linear-gradient(135deg, ${C.oak}, ${C.umber})`,
    danger:  "transparent",
  };
  const color: Record<string, string> = {
    default: C.bark,
    primary: C.cream,
    danger:  C.error,
  };
  const border: Record<string, string> = {
    default: C.sand,
    primary: "transparent",
    danger:  "#e8a49a",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="ft-toolbar-btn"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 14px",
        borderRadius: 10,
        border: `1.5px solid ${border[variant]}`,
        background: bg[variant],
        color: color[variant],
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase" as const,
        transition: "all 0.16s",
        whiteSpace: "nowrap" as const,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        if (variant === "primary") el.style.opacity = "0.85";
        else el.style.background = C.warm100;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        if (variant === "primary") el.style.opacity = "1";
        else el.style.background = bg[variant];
      }}
    >
      <span aria-hidden>{icon}</span>
      {label}
    </button>
  );
};

// ─── FamilyTreeView ───────────────────────────────────────────────────────────

const FamilyTreeView = ({
  initialPersons,
  storageKey = "family-tree-data",
}: FamilyTreeViewProps) => {
  const [persons, setPersons]       = useState<Person[]>(() =>
    loadFromStorage(storageKey, initialPersons)
  );
  const [toast, setToast]           = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  const tree: PersonNodeType | null = buildTree(persons);

  // Persist every time persons changes
  useEffect(() => {
    saveToStorage(storageKey, persons);
  }, [persons, storageKey]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAddPerson = useCallback(
    (parentId: string, child: Person) => {
      setPersons((prev) => addChildToPersons(prev, parentId, child));
      setToast(`${child.name} added to the family tree`);
    },
    []
  );

  const handleExport = useCallback(() => {
    downloadJSON(persons);
    setToast("JSON exported successfully");
  }, [persons]);

  const handleReset = useCallback(() => {
    if (!window.confirm("Reset to original data? All unsaved changes will be lost."))
      return;
    setPersons(initialPersons);
    saveToStorage(storageKey, initialPersons);
    setToast("Tree reset to original data");
  }, [initialPersons, storageKey]);

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          const arr: Person[] = parsed?.persons ?? parsed;
          if (!Array.isArray(arr) || arr.length === 0)
            throw new Error("Invalid format");
          setPersons(arr);
          setToast(`Imported ${arr.length} person${arr.length !== 1 ? "s" : ""}`);
          setImportError(null);
        } catch {
          setImportError("Invalid JSON. Expected { persons: [...] }");
        }
      };
      reader.readAsText(file);
      // reset so same file can be re-imported
      e.target.value = "";
    },
    []
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@400;500;700&display=swap');

        @keyframes ft-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
        @keyframes ft-tree-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: `radial-gradient(ellipse at 60% 0%, #f5e9d4 0%, ${C.cream} 55%, #faf6f0 100%)`,
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grain texture overlay */}
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0.6,
          }}
        />

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 28px",
            background: "rgba(253,246,236,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: `1px solid ${C.sand}`,
            boxShadow: "0 1px 0 rgba(201,169,110,0.15)",
            gap: 16,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 22,
                fontWeight: 600,
                color: C.bark,
                letterSpacing: "-0.01em",
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

          {/* Stats pill */}
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
              flexShrink: 0,
            }}
          >
            <span aria-hidden style={{ color: C.gold }}>◈</span>
            {persons.length} member{persons.length !== 1 ? "s" : ""}
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          style={{ display: "none" }}
          aria-hidden="true"
        />

        {/* Import error banner */}
        {importError && (
          <div
            role="alert"
            style={{
              margin: "12px 28px 0",
              padding: "10px 16px",
              borderRadius: 10,
              background: "#fff5f5",
              border: `1px solid #f0c0bb`,
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
                lineHeight: 1,
              }}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Tree Canvas ───────────────────────────────────────────────────── */}
        <main
          style={{
            position: "relative",
            zIndex: 1,
            padding: "48px 32px 80px",
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
              {/* Generation label */}
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
            // Empty state
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
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 18,
                  color: C.muted,
                }}
              >
                No family data found
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: C.sand,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Import a JSON file or check your initial data
              </p>
              <button
                type="button"
                onClick={handleImportClick}
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
                Import JSON
              </button>
            </div>
          )}
        </main>

        {/* ── JSON Preview Drawer (bottom) ──────────────────────────────────── */}
        <JSONDrawer persons={persons} />
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
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
        width: open ? 440 : "auto",
        transition: "width 0.2s",
      }}
    >
      {/* Toggle tab */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
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
          marginLeft: "auto",
        }}
        aria-expanded={open}
        aria-label={open ? "Close JSON preview" : "Open JSON preview"}
      >
        {open ? "✕ Close" : "{ } Live JSON"}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            background: C.bark,
            border: `1px solid rgba(201,169,110,0.3)`,
            borderBottom: "none",
            borderRadius: "10px 0 0 0",
            height: 360,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header bar */}
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
              family-tree.json — {persons.length} persons
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(json);
              }}
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

          {/* Code area */}
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
              tabSize: 2,
            }}
          >
            {json}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FamilyTreeView;