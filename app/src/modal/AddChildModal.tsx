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

// ─────────────────── constants ───────────────────

const DEFAULT_PHOTO = "/images/default.jpeg";

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

const TODAY = new Date().toISOString().split("T")[0];

// ─────────────────── validation ───────────────────

const validate = (form: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.dob) errors.dob = "Date of birth is required.";

  if (!form.isAlive) {
    if (!form.dod) {
      errors.dod = "Date of Death is required when deceased.";
    } else if (form.dob && form.dod < form.dob) {
      errors.dod = "Date of Death cannot be before date of birth.";
    }
  }

  return errors;
};

// ─────────────────── Field ───────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

const Field = ({ label, required, error, children, htmlFor }: FieldProps) => (
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

// ─────────────────── StatusToggle ───────────────────

interface StatusToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  labelOn: string;
  labelOff: string;
  colorOn?: string; // active bg
  colorOff?: string; // inactive bg
}

const StatusToggle = ({
  checked,
  onChange,
  labelOn,
  labelOff,
  colorOn = "#22c55e",
  colorOff = "#94a3b8",
}: StatusToggleProps) => (
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
    {/* track */}
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: 44,
        height: 24,
        borderRadius: 999,
        background: checked ? colorOn : colorOff,
        transition: "background 0.25s",
        flexShrink: 0,
      }}
    >
      {/* thumb */}
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

    {/* label */}
    <span
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: checked ? colorOn : "#94a3b8",
        fontFamily: "'DM Sans', sans-serif",
        transition: "color 0.2s",
        userSelect: "none",
      }}
    >
      {checked ? labelOn : labelOff}
    </span>
  </button>
);

// ─────────────────── SectionCard ───────────────────
// A card that holds a toggle in its header + optional expanded content below

interface SectionCardProps {
  label: string;
  toggle: React.ReactNode;
  active: boolean; // whether the expandable area is open
  children?: React.ReactNode;
}

const SectionCard = ({ label, toggle, active, children }: SectionCardProps) => (
  <div
    style={{
      borderRadius: 12,
      border: `1.5px solid ${active ? "#cbd5e1" : "#e2e8f0"}`,
      background: active ? "#f8fafc" : "#fff",
      overflow: "hidden",
      transition: "border-color 0.2s, background 0.2s",
    }}
  >
    {/* header row */}
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
      {toggle}
    </div>

    {/* expanded content */}
    {active && children && (
      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {children}
      </div>
    )}
  </div>
);

// ─────────────────── AddChildModal ───────────────────

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
  const [photoError, setPhotoError] = useState(false);

  // spouse search
  const [spouseQuery, setSpouseQuery] = useState("");
  const [selectedSpouse, setSelectedSpouse] = useState<Family | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  // ── derived flags ──
  // Spouse UI is only relevant when person is male AND married
  const showSpouseSection = form.isMarried && form.gender === "M";

  // ─── effects ───

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => nameInputRef.current?.focus(), 60);

    setForm(INITIAL_FORM);
    setErrors({});
    setTouched(new Set());
    setPhotoError(false);
    setSelectedSpouse(null);
    setSpouseQuery("");
    setDropdownOpen(false);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // clear dod date when toggled back to alive
  useEffect(() => {
    if (form.isAlive) {
      setForm((prev) => (prev.dod ? { ...prev, dod: "" } : prev));
    }
  }, [form.isAlive]);

  // clear spouse + dom when spouse section becomes hidden
  useEffect(() => {
    if (!showSpouseSection) {
      setSelectedSpouse(null);
      setSpouseQuery("");
      setDropdownOpen(false);
      setForm((prev) => ({ ...prev, spouse: [], dom: "" }));
    }
  }, [showSpouseSection]);

  // live validation after first touch
  useEffect(() => {
    if (touched.size) setErrors(validate(form));
  }, [form, touched]);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── handlers ───

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    [],
  );

  const markTouched = useCallback(
    (name: string) => setTouched((prev) => new Set(prev).add(name)),
    [],
  );

  // ─── memo ───

  const filteredSpouses = useMemo(() => {
    // only show females (opposite of male person)
    return persons
      .filter((p) => p.gender === "F")
      .filter((p) => p.name.toLowerCase().includes(spouseQuery.toLowerCase()));
  }, [spouseQuery, persons]);

  // ─── save ───

  const handleSave = () => {
    // mark all key fields touched so errors surface
    setTouched(new Set(["name", "dob", "dod"]));

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const spouseIds = selectedSpouse ? [selectedSpouse.id] : [];

    const newChild: ChildNode = {
      id: uuidv4(),
      ...form,
      parents: parentId ? [parentId] : [],
      children: [],
      spouse: spouseIds.length ? (spouseIds as []) : [],
      isApproved: false,
      childrenData: [],
      spouseData: [],
      vanshId,
    };

    onSave(newChild);
    onClose();
  };

  // ─── render ───

  if (!isOpen) return null;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="acm-backdrop">
      <div className="acm-panel">
        {/* HEADER */}
        <div className="acm-header">
          <h2>Add New Member</h2>
          <button onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="acm-body">
          {/* PHOTO */}
          <div className="acm-photo-row">
            <div className="acm-avatar">
              {!photoError && form.photo ? (
                <img
                  src={form.photo}
                  alt="Preview"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <span>👤</span>
              )}
            </div>

            <Field label="Photo URL">
              <input
                name="photo"
                value={form.photo}
                onChange={(e) => {
                  setPhotoError(false);
                  handleChange(e);
                }}
                className="acm-input"
                placeholder="https://…"
              />
            </Field>
          </div>

          {/* NAME */}
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
          {/* DOB */}
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

          {/* GENDER */}
          <Field label="Gender">
            <div className="acm-row">
              {(["M", "F"] as const).map((g) => (
                <label key={g} className="acm-toggle-pill">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={handleChange}
                  />
                  <span className="acm-pill">
                    {g === "M" ? "♂ Male" : "♀ Female"}
                  </span>
                </label>
              ))}
            </div>
          </Field>
          {/* ── VITAL STATUS GROUP ── */}
          <SectionCard
            toggle={
              <StatusToggle
                checked={form.isAlive}
                onChange={(val) =>
                  setForm((prev) => ({ ...prev, isAlive: val }))
                }
                labelOn="Alive"
                labelOff="Deceased"
                colorOn="#22c55e"
                colorOff="#ef4444"
              />
            }
            label="Vital Status"
            active={!form.isAlive}
          >
            {/* Date of Death — visible only when deceased */}
            {!form.isAlive && (
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
            )}
          </SectionCard>

          {/* ── MARITAL STATUS GROUP ── */}
          <SectionCard
            toggle={
              <StatusToggle
                checked={form.isMarried}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    isMarried: val,
                    spouse: val ? prev.spouse : [],
                  }))
                }
                labelOn="Married"
                labelOff="Unmarried"
                colorOn="#6366f1"
                colorOff="#94a3b8"
              />
            }
            label="Marital Status"
            active={form.isMarried}
          >
            {/* Marriage date + spouse — only when married male */}
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
                  <div className="acm-dropdown" ref={dropdownRef}>
                    <input
                      className="acm-input"
                      placeholder="Search spouse by name…"
                      value={spouseQuery}
                      onChange={(e) => setSpouseQuery(e.target.value)}
                      onFocus={() => setDropdownOpen(true)}
                    />

                    {dropdownOpen && (
                      <div className="acm-dropdown-list">
                        {filteredSpouses.length === 0 ? (
                          <div className="acm-dropdown-empty">
                            No results found
                          </div>
                        ) : (
                          filteredSpouses.map((p) => (
                            <div
                              key={p.id}
                              className={`acm-dropdown-item ${
                                selectedSpouse?.id === p.id ? "selected" : ""
                              }`}
                              onClick={() => {
                                setSelectedSpouse(p);
                                setSpouseQuery(p.name);
                                setDropdownOpen(false);
                                setForm((prev) => ({
                                  ...prev,
                                  spouse: [p.id],
                                }));
                              }}
                            >
                              <img
                                src={p.photo || DEFAULT_PHOTO}
                                className="acm-avatar-sm"
                                alt={p.name}
                              />
                              <div className="acm-flex-col">
                                <span>{p.name}</span>
                                <span className="acm-muted">Female</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {selectedSpouse && (
                      <div className="acm-selected">
                        <span>
                          Selected: <strong>{selectedSpouse.name}</strong>
                        </span>
                        <button
                          type="button"
                          aria-label="Clear spouse"
                          onClick={() => {
                            setSelectedSpouse(null);
                            setSpouseQuery("");
                            setForm((prev) => ({ ...prev, spouse: [] }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </Field>
              </>
            )}
          </SectionCard>
        </div>

        {/* FOOTER */}
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
