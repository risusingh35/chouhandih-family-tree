"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  FormData,
  ChildNode,
  FormErrors,
  AddChildModalProps,
} from "../types";
// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_PHOTO = "/images/default.jpeg";

const INITIAL_FORM: FormData = {
  name: "",
  gender: "M",
  photo: DEFAULT_PHOTO,
  dob: "",
  death: "",
  isMarried: false,
  spouse: [],
  isAlive: true,
};

const TODAY = new Date().toISOString().split("T")[0];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.dob) errors.dob = "Date of birth is required.";
  if (!form.isAlive && !form.death)
    errors.death = "Date of death is required when deceased.";
  if (!form.isAlive && form.death && form.dob && form.death < form.dob)
    errors.death = "Date of death cannot be before date of birth.";
  return errors;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

const Field = ({ label, required, error, children, htmlFor }: FieldProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: error ? "#c0392b" : "#7a6a55",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
      {required && (
        <span style={{ color: "#c0392b", marginLeft: 3 }} aria-hidden>
          *
        </span>
      )}
    </label>
    {children}
    {error && (
      <span
        role="alert"
        style={{
          fontSize: 11,
          color: "#c0392b",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <circle cx="6" cy="6" r="5.5" stroke="#c0392b" />
          <path d="M6 3.5V6.5" stroke="#c0392b" strokeLinecap="round" />
          <circle cx="6" cy="8.5" r="0.75" fill="#c0392b" />
        </svg>
        {error}
      </span>
    )}
  </div>
);

const inputStyle: React.CSSProperties = {
  padding: "10px 13px",
  borderRadius: 9,
  border: "1.5px solid #ddd4c5",
  backgroundColor: "#fffdf9",
  fontSize: 14,
  color: "#2c2416",
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  transition: "border-color 0.18s, box-shadow 0.18s",
  width: "100%",
  boxSizing: "border-box" as const,
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: "#e8a49a",
  backgroundColor: "#fff8f7",
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AddChildModal = ({
  isOpen,
  onClose,
  parentId,
  onSave,
}: AddChildModalProps) => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [photoError, setPhotoError] = useState(false);
  const [spouseInput, setSpouseInput] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  // Focus trap & escape key
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => nameInputRef.current?.focus(), 60);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setErrors({});
      setTouched(new Set());
      setPhotoError(false);
      setSpouseInput("");
    }
  }, [isOpen]);

  // Clear death date when marked alive
  useEffect(() => {
    if (form.isAlive) setForm((prev) => ({ ...prev, death: "" }));
  }, [form.isAlive]);

  // Live validation on touched fields
  useEffect(() => {
    if (touched.size > 0) setErrors(validate(form));
  }, [form, touched]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    },
    [],
  );

  const markTouched = useCallback((name: string) => {
    setTouched((prev) => new Set(prev).add(name));
  }, []);

  const handleSpouseChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setSpouseInput(raw);
      setForm((prev) => ({
        ...prev,
        spouse: raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }));
    },
    [],
  );

  const handleSave = () => {
    const allTouched = new Set(["name", "dob", "death"]);
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newChild: ChildNode = {
      id: uuidv4(),
      ...form,
      parents: parentId ? [parentId] : null,
      children: [],
      isApproved: false,
      childrenData: [],
      spouseData: [],
    };
    onSave(newChild);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@400;500;700&display=swap');

        @keyframes acm-backdrop-in {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to   { opacity: 1; backdrop-filter: blur(6px); }
        }
        @keyframes acm-panel-in {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        .acm-input:focus {
          border-color: #a8845a !important;
          box-shadow: 0 0 0 3px rgba(168, 132, 90, 0.15) !important;
        }
        .acm-select:focus {
          border-color: #a8845a !important;
          box-shadow: 0 0 0 3px rgba(168, 132, 90, 0.15) !important;
          outline: none;
        }
        .acm-btn-cancel:hover  { background: #f5ede0 !important; border-color: #c4a882 !important; }
        .acm-btn-save:hover    { background: #7a5c35 !important; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(122,92,53,0.35) !important; }
        .acm-btn-save:active   { transform: translateY(0); }
        .acm-close:hover       { background: #f0e8dc !important; color: #4a3620 !important; }
        .acm-toggle-pill input { display: none; }
        .acm-toggle-pill input:checked + .acm-pill { background: #6b4c2a; color: #fff; border-color: #6b4c2a; }
      `}</style>

      {/* Backdrop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(20, 13, 5, 0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 3000,
          animation: "acm-backdrop-in 0.22s ease forwards",
          padding: "16px",
        }}
      >
        {/* Panel */}
        <div
          style={{
            background: "linear-gradient(160deg, #fffdf8 0%, #fdf6ec 100%)",
            borderRadius: 20,
            width: "100%",
            maxWidth: 500,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow:
              "0 24px 60px rgba(20,13,5,0.22), 0 2px 8px rgba(20,13,5,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            border: "1px solid rgba(200,175,140,0.4)",
            animation:
              "acm-panel-in 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards",
            position: "relative",
          }}
        >
          {/* Decorative top bar */}
          <div
            aria-hidden
            style={{
              height: 5,
              borderRadius: "20px 20px 0 0",
              background: "linear-gradient(90deg, #c9a96e, #a8845a, #7a5c35)",
            }}
          />

          <div style={{ padding: "28px 28px 32px" }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 28,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#a8845a",
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 4,
                  }}
                >
                  Family Tree
                </p>
                <h2
                  id={`${formId}-title`}
                  style={{
                    margin: 0,
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#2c1f0e",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    lineHeight: 1.2,
                  }}
                >
                  Add New Child
                </h2>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="acm-close"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#9a8570",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s, color 0.15s",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Photo Preview Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
                padding: "14px 16px",
                background: "rgba(200,175,140,0.1)",
                borderRadius: 12,
                border: "1px solid rgba(200,175,140,0.25)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  border: "2.5px solid #c9a96e",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#f0e4d0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!photoError && form.photo ? (
                  <img
                    src={form.photo}
                    alt="Preview"
                    onError={() => setPhotoError(true)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <circle cx="12" cy="8" r="4" fill="#c9a96e" opacity="0.7" />
                    <path
                      d="M4 20c0-4 3.58-7 8-7s8 3 8 7"
                      stroke="#c9a96e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label
                  htmlFor={`${formId}-photo`}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#7a6a55",
                    fontFamily: "'DM Sans', sans-serif",
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  Photo URL
                </label>
                <input
                  id={`${formId}-photo`}
                  name="photo"
                  value={form.photo}
                  onChange={(e) => {
                    setPhotoError(false);
                    handleChange(e);
                  }}
                  type="url"
                  placeholder="https://…"
                  className="acm-input"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Form Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Name */}
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
                  type="text"
                  placeholder="e.g. Arjun Patel"
                  autoComplete="name"
                  className="acm-input"
                  style={
                    touched.has("name") && errors.name
                      ? inputErrorStyle
                      : inputStyle
                  }
                  aria-required="true"
                  aria-invalid={!!errors.name}
                />
              </Field>

              {/* Gender */}
              <Field label="Gender" htmlFor={`${formId}-gender`}>
                <div style={{ display: "flex", gap: 10 }}>
                  {(["M", "F"] as const).map((g) => (
                    <label
                      key={g}
                      className="acm-toggle-pill"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={handleChange}
                      />
                      <span
                        className="acm-pill"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 16px",
                          borderRadius: 8,
                          border: "1.5px solid #ddd4c5",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#6b4c2a",
                          background: "#fff",
                          fontFamily: "'DM Sans', sans-serif",
                          transition: "all 0.15s",
                          userSelect: "none",
                        }}
                      >
                        <span aria-hidden>{g === "M" ? "♂" : "♀"}</span>
                        {g === "M" ? "Male" : "Female"}
                      </span>
                    </label>
                  ))}
                </div>
              </Field>

              {/* DOB + Status row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
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
                    style={
                      touched.has("dob") && errors.dob
                        ? inputErrorStyle
                        : inputStyle
                    }
                    aria-required="true"
                    aria-invalid={!!errors.dob}
                  />
                </Field>

                {/* Alive toggle */}
                <Field label="Status" htmlFor={`${formId}-alive`}>
                  <button
                    id={`${formId}-alive`}
                    type="button"
                    role="switch"
                    aria-checked={form.isAlive}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isAlive: !prev.isAlive }))
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 13px",
                      borderRadius: 9,
                      border: "1.5px solid #ddd4c5",
                      background: form.isAlive ? "#f0faf0" : "#fdf5f5",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      color: form.isAlive ? "#2d6a4f" : "#8b3a3a",
                      transition: "all 0.18s",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 20,
                        borderRadius: 10,
                        background: form.isAlive ? "#40c074" : "#d9534f",
                        position: "relative",
                        transition: "background 0.18s",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 3,
                          left: form.isAlive ? 18 : 3,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.18s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    </span>
                    {form.isAlive ? "Alive" : "Deceased"}
                  </button>
                </Field>
              </div>

              {/* Date of death */}
              {!form.isAlive && (
                <Field
                  label="Date of Death"
                  required
                  error={touched.has("death") ? errors.death : undefined}
                  htmlFor={`${formId}-death`}
                >
                  <input
                    id={`${formId}-death`}
                    name="death"
                    value={form.death}
                    onChange={handleChange}
                    onBlur={() => markTouched("death")}
                    type="date"
                    min={form.dob || undefined}
                    max={TODAY}
                    className="acm-input"
                    style={
                      touched.has("death") && errors.death
                        ? inputErrorStyle
                        : inputStyle
                    }
                    aria-required="true"
                    aria-invalid={!!errors.death}
                  />
                </Field>
              )}

              {/* Married toggle */}
              <Field label="Marital Status">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isMarried}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      isMarried: !prev.isMarried,
                      spouse: prev.isMarried ? [] : prev.spouse,
                    }))
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 15px",
                    borderRadius: 9,
                    border: `1.5px solid ${form.isMarried ? "#c9a96e" : "#ddd4c5"}`,
                    background: form.isMarried
                      ? "rgba(201,169,110,0.12)"
                      : "transparent",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: form.isMarried ? "#7a5c35" : "#9a8570",
                    transition: "all 0.18s",
                    alignSelf: "flex-start",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M7.5 13C7.5 13 2 9.5 2 5.5C2 3.567 3.567 2 5.5 2C6.5 2 7.5 2.5 7.5 2.5C7.5 2.5 8.5 2 9.5 2C11.433 2 13 3.567 13 5.5C13 9.5 7.5 13 7.5 13Z"
                      fill={form.isMarried ? "#c9a96e" : "none"}
                      stroke={form.isMarried ? "#c9a96e" : "#9a8570"}
                      strokeWidth="1.3"
                    />
                  </svg>
                  {form.isMarried ? "Married" : "Mark as Married"}
                </button>
              </Field>

              {/* Spouse IDs */}
              {form.isMarried && (
                <Field label="Spouse IDs" htmlFor={`${formId}-spouse`}>
                  <input
                    id={`${formId}-spouse`}
                    value={spouseInput}
                    onChange={handleSpouseChange}
                    type="text"
                    placeholder="Comma-separated IDs, e.g. abc-123, def-456"
                    className="acm-input"
                    style={inputStyle}
                  />
                  {form.spouse.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: 6,
                      }}
                    >
                      {form.spouse.map((id) => (
                        <span
                          key={id}
                          style={{
                            padding: "3px 9px",
                            borderRadius: 20,
                            background: "rgba(201,169,110,0.18)",
                            border: "1px solid rgba(201,169,110,0.4)",
                            fontSize: 11,
                            color: "#7a5c35",
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  )}
                </Field>
              )}
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(200,175,140,0.4), transparent)",
                margin: "28px 0 22px",
              }}
            />

            {/* Footer */}
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}
            >
              <button
                type="button"
                onClick={onClose}
                className="acm-btn-cancel"
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "1.5px solid #d4c4ae",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#7a6a55",
                  transition: "all 0.15s",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={hasErrors && touched.size > 0}
                className="acm-btn-save"
                style={{
                  padding: "10px 22px",
                  borderRadius: 10,
                  border: "none",
                  background:
                    hasErrors && touched.size > 0
                      ? "#c4a882"
                      : "linear-gradient(135deg, #a8845a, #7a5c35)",
                  color: "#fff",
                  cursor:
                    hasErrors && touched.size > 0 ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  boxShadow: "0 2px 10px rgba(122,92,53,0.25)",
                  transition: "all 0.18s",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
                aria-disabled={hasErrors && touched.size > 0}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2.5 7.5L6 11L12.5 4"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Save Child
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddChildModal;
