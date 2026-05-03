"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  FormData,
  ChildNode,
  FormErrors,
  AddChildModalProps,
  Family,
} from "../types";
import "../../globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_PHOTO = "/images/default.jpeg";
const TODAY = new Date().toISOString().split("T")[0];

const INITIAL_FORM: FormData = {
  name: "",
  gender: "M",
  photo: DEFAULT_PHOTO,
  dob: "",
  dod: "",
  dom: "",
  isMarried: false,
  spouse: [],
  isAlive: true,
  vanshId: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

const validate = (form: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.dob) errors.dob = "Date of birth is required.";
  if (!form.isAlive) {
    if (!form.dod) errors.dod = "Date of dod is required when deceased.";
    else if (form.dob && form.dod < form.dob)
      errors.dod = "Date of dod cannot be before date of birth.";
  }
  return errors;
};

// ─────────────────────────────────────────────────────────────────────────────
// ── Sub-component: Field
// ─────────────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

const Field = ({ label, required, error, htmlFor, children }: FieldProps) => (
  <div className="acm-field">
    <label
      htmlFor={htmlFor}
      className={`acm-label ${error ? "acm-label-error" : ""}`}
    >
      {label}
      {required && <span className="acm-required">*</span>}
    </label>
    {children}
    {error && (
      <span role="alert" className="acm-error">
        {error}
      </span>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ── Sub-component: VitalStatusRadio
//    Replaces the toggle — two pill-style radio buttons: Alive / Deceased
// ─────────────────────────────────────────────────────────────────────────────

interface VitalStatusRadioProps {
  value: boolean; // true = alive
  onChange: (val: boolean) => void;
}

const VitalStatusRadio = ({ value, onChange }: VitalStatusRadioProps) => {
  const options = [
    {
      label: "Alive",
      val: true,
      activeColor: "#22c55e",
      activeBg: "#f0fdf4",
      activeBorder: "#86efac",
    },
    {
      label: "Deceased",
      val: false,
      activeColor: "#ef4444",
      activeBg: "#fef2f2",
      activeBorder: "#fca5a5",
    },
  ] as const;

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {options.map((opt) => {
        const active = value === opt.val;
        return (
          <label
            key={opt.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 20,
              border: `1.5px solid ${active ? opt.activeBorder : "#e2e8f0"}`,
              background: active ? opt.activeBg : "#f8fafc",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? opt.activeColor : "#94a3b8",
              transition: "all 0.18s",
              userSelect: "none",
            }}
          >
            <input
              type="radio"
              name="isAlive"
              checked={active}
              onChange={() => onChange(opt.val)}
              style={{ display: "none" }}
            />
            {/* dot indicator */}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: active ? opt.activeColor : "#cbd5e1",
                flexShrink: 0,
                transition: "background 0.18s",
              }}
            />
            {opt.label}
          </label>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ── Sub-component: MarriedToggle
// ─────────────────────────────────────────────────────────────────────────────

interface MarriedToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

const MarriedToggle = ({ checked, onChange }: MarriedToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
    }}
  >
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: 44,
        height: 24,
        borderRadius: 999,
        background: checked ? "#6366f1" : "#94a3b8",
        transition: "background 0.25s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
          transition: "left 0.22s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: checked ? "#6366f1" : "#94a3b8",
        fontFamily: "'DM Sans', sans-serif",
        transition: "color 0.2s",
        userSelect: "none",
      }}
    >
      {checked ? "Married" : "Unmarried"}
    </span>
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// ── Sub-component: SectionCard
//    Collapsible card — header row + optional expanded body
// ─────────────────────────────────────────────────────────────────────────────

interface SectionCardProps {
  label: string;
  control: React.ReactNode; // toggle / radio sits in the header
  active: boolean;
  children?: React.ReactNode;
}

const SectionCard = ({
  label,
  control,
  active,
  children,
}: SectionCardProps) => (
  <div
    style={{
      borderRadius: 12,
      border: `1.5px solid ${active ? "#cbd5e1" : "#e2e8f0"}`,
      background: active ? "#f8fafc" : "#fff",
      overflow: "visible", // ← must NOT be hidden; lets the dropdown escape
      transition: "border-color 0.2s, background 0.2s",
    }}
  >
    {/* header */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#64748b",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </span>
      {control}
    </div>

    {/* body */}
    {active && children && (
      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          position: "relative", // stacking context for children
        }}
      >
        {children}
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ── Sub-component: PhotoPreview
// ─────────────────────────────────────────────────────────────────────────────

interface PhotoPreviewProps {
  url: string;
  onChange: (url: string) => void;
}

const PhotoPreview = ({ url, onChange }: PhotoPreviewProps) => {
  const [imgError, setImgError] = useState(false);

  // reset error when url changes
  useEffect(() => setImgError(false), [url]);

  return (
    <div className="acm-photo-row">
      <div className="acm-avatar">
        {!imgError && url ? (
          <img src={url} alt="Preview" onError={() => setImgError(true)} />
        ) : (
          <span>👤</span>
        )}
      </div>
      <Field label="Photo URL">
        <input
          name="photo"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          className="acm-input"
          placeholder="https://…"
        />
      </Field>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ── Sub-component: GenderPicker
// ─────────────────────────────────────────────────────────────────────────────

interface GenderPickerProps {
  value: "M" | "F";
  onChange: (g: "M" | "F") => void;
}

const GenderPicker = ({ value, onChange }: GenderPickerProps) => (
  <Field label="Gender">
    <div className="acm-row">
      {(["M", "F"] as const).map((g) => (
        <label key={g} className="acm-toggle-pill">
          <input
            type="radio"
            name="gender"
            value={g}
            checked={value === g}
            onChange={() => onChange(g)}
          />
          <span className="acm-pill">{g === "M" ? "♂ Male" : "♀ Female"}</span>
        </label>
      ))}
    </div>
  </Field>
);

// ─────────────────────────────────────────────────────────────────────────────
// ── Sub-component: SpouseDropdown
//    FIX: dropdown list uses position:fixed so it is never clipped by any
//         parent with overflow:hidden or a stacking-context boundary.
// ─────────────────────────────────────────────────────────────────────────────

interface SpouseDropdownProps {
  query: string;
  onQueryChange: (q: string) => void;
  results: Family[];
  selected: Family | null;
  onSelect: (p: Family) => void;
  onClear: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

const SpouseDropdown = ({
  query,
  onQueryChange,
  results,
  selected,
  onSelect,
  onClear,
  isOpen,
  onOpen,
  onClose,
  anchorRef,
}: SpouseDropdownProps) => {
  // Measure anchor position so the fixed list aligns under the input
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      setRect(anchorRef.current.getBoundingClientRect());
    }
  }, [isOpen, anchorRef]);

  return (
    <div ref={anchorRef} style={{ position: "relative" }}>
      <input
        className="acm-input"
        placeholder="Search spouse by name…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onOpen}
      />

      {/* ── Fixed-position dropdown list — never hidden by parent overflow ── */}
      {isOpen && rect && (
        <div
          className="acm-dropdown-list"
          style={{
            position: "fixed",
            top: rect.bottom,
            left: 10,
            width: rect.width,
            zIndex: 9999, // always on top
            maxHeight: 220,
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {results.length === 0 ? (
            <div className="acm-dropdown-empty">No results found</div>
          ) : (
            results.map((p) => (
              <div
                key={p.id}
                className={`acm-dropdown-item ${
                  selected?.id === p.id ? "selected" : ""
                }`}
                onMouseDown={(e) => {
                  // onMouseDown (not onClick) prevents the blur from firing first
                  e.preventDefault();
                  onSelect(p);
                  onClose();
                }}
              >
                <img
                  src={p.photo || DEFAULT_PHOTO}
                  className="acm-avatar-sm"
                  alt={p.name}
                />
                <div className="acm-flex-col">
                  <span>{p.name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* selected chip */}
      {selected && (
        <div className="acm-selected">
          <span>
            Selected: <strong>{selected.name}</strong>
          </span>
          <button type="button" aria-label="Clear spouse" onClick={onClear}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ── Main: AddChildModal
// ─────────────────────────────────────────────────────────────────────────────

const AddChildModal = ({
  isOpen,
  onClose,
  parentId,
  onSave,
  vanshId,
  persons = [],
}: AddChildModalProps & { persons: Family[] }) => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const [spouseQuery, setSpouseQuery] = useState("");
  const [selectedSpouse, setSelectedSpouse] = useState<Family | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const dropdownAnchorRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  const showSpouseSection = form.isMarried;

  // ── Reset on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => nameInputRef.current?.focus(), 60);
    setForm(INITIAL_FORM);
    setErrors({});
    setTouched(new Set());
    setSelectedSpouse(null);
    setSpouseQuery("");
    setDropdownOpen(false);
    return () => clearTimeout(t);
  }, [isOpen]);

  // ── Clear dod date when toggled back to alive ────────────────────────────
  useEffect(() => {
    if (form.isAlive) setForm((p) => (p.dod ? { ...p, dod: "" } : p));
  }, [form.isAlive]);

  // ── Clear spouse data when section hides ──────────────────────────────────
  useEffect(() => {
    if (!showSpouseSection) {
      setSelectedSpouse(null);
      setSpouseQuery("");
      setDropdownOpen(false);
      setForm((p) => ({ ...p, spouse: [], dom: "" }));
    }
  }, [showSpouseSection]);

  // ── Live validation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (touched.size) setErrors(validate(form));
  }, [form, touched]);

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownAnchorRef.current?.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    },
    [],
  );

  const markTouched = useCallback(
    (name: string) => setTouched((p) => new Set(p).add(name)),
    [],
  );

  const filteredSpouses = useMemo(
    () =>
      persons
        .filter((p) => p.name !== "Chouhandih")
        .filter((p) => p.gender !== form.gender)
        .filter((p) => (p?.spouse?.length || 0) < 1)
        .filter((p) =>
          p.name.toLowerCase().includes(spouseQuery.toLowerCase()),
        ),
    [spouseQuery, persons],
  );

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    setTouched(new Set(["name", "dob", "dod"]));
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const newChild: ChildNode = {
      id: uuidv4(),
      ...form,
      parents: parentId ? [parentId] : [],
      children: [],
      spouse: selectedSpouse ? [selectedSpouse.id] : [],
      isApproved: false,
      childrenData: [],
      spouseData: [],
      vanshId,
    };
    onSave(newChild);
    onClose();
  };

  if (!isOpen) return null;

  const hasErrors = Object.keys(errors).length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="acm-backdrop">
      <div className="acm-panel">
        {/* Header */}
        <div className="acm-header">
          <h2>Add New Member</h2>
          <button onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="acm-body">
          {/* Photo */}
          <PhotoPreview
            url={form.photo}
            onChange={(url) => setForm((p) => ({ ...p, photo: url }))}
          />

          {/* Full name */}
          <Field
            label="Full Name"
            required
            error={touched.has("name") ? errors.name : undefined}
            htmlFor={`${formId}-name`}
          >
            <input
              id={`${formId}-name`}
              ref={nameInputRef}
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={() => markTouched("name")}
              className="acm-input"
              placeholder="Enter full name"
            />
          </Field>

          {/* ── Vital Status — radio buttons ── */}
          <SectionCard
            label="Vital Status"
            control={
              <VitalStatusRadio
                value={form.isAlive}
                onChange={(val) => setForm((p) => ({ ...p, isAlive: val }))}
              />
            }
            active={!form.isAlive}
          >
            <Field
              label="Date of Death"
              required
              error={touched.has("dod") ? errors.dod : undefined}
              htmlFor={`${formId}-dod`}
            >
              <input
                id={`${formId}-dod`}
                name="dod"
                value={form.dod}
                onChange={handleChange}
                onBlur={() => markTouched("dod")}
                type="date"
                min={form.dob || undefined}
                max={TODAY}
                className="acm-input"
              />
            </Field>
          </SectionCard>

          {/* Date of birth */}
          <Field
            label="Date of Birth"
            required
            error={touched.has("dob") ? errors.dob : undefined}
            htmlFor={`${formId}-dob`}
          >
            <input
              id={`${formId}-dob`}
              name="dob"
              value={form.dob}
              onChange={handleChange}
              onBlur={() => markTouched("dob")}
              type="date"
              max={TODAY}
              className="acm-input"
            />
          </Field>

          {/* Gender */}
          <GenderPicker
            value={form.gender}
            onChange={(g) => setForm((p) => ({ ...p, gender: g }))}
          />

          {/* ── Marital Status ── */}
          <SectionCard
            label="Marital Status"
            control={
              <MarriedToggle
                checked={form.isMarried}
                onChange={(val) =>
                  setForm((p) => ({
                    ...p,
                    isMarried: val,
                    spouse: val ? p.spouse : [],
                  }))
                }
              />
            }
            active={form.isMarried}
          >
            {showSpouseSection && (
              <>
                <Field label="Marriage Date" htmlFor={`${formId}-dom`}>
                  <input
                    id={`${formId}-dom`}
                    name="dom"
                    value={form.dom ?? ""}
                    onChange={handleChange}
                    type="date"
                    min={form.dob || undefined}
                    max={TODAY}
                    className="acm-input"
                  />
                </Field>

                <Field label="Spouse">
                  <SpouseDropdown
                    query={spouseQuery}
                    onQueryChange={setSpouseQuery}
                    results={filteredSpouses}
                    selected={selectedSpouse}
                    onSelect={(p) => {
                      setSelectedSpouse(p);
                      setSpouseQuery(p.name);
                      setForm((prev) => ({ ...prev, spouse: [p.id] }));
                    }}
                    onClear={() => {
                      setSelectedSpouse(null);
                      setSpouseQuery("");
                      setForm((p) => ({ ...p, spouse: [] }));
                    }}
                    isOpen={dropdownOpen}
                    onOpen={() => setDropdownOpen(true)}
                    onClose={() => setDropdownOpen(false)}
                    anchorRef={dropdownAnchorRef}
                  />
                </Field>
              </>
            )}
          </SectionCard>
        </div>

        {/* Footer */}
        <div className="acm-footer">
          <button className="acm-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="acm-btn-save"
            onClick={handleSave}
            disabled={hasErrors && touched.size > 0}
          >
            Save Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChildModal;
