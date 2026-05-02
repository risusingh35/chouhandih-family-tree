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
  vanshId: "",
};

const TODAY = new Date().toISOString().split("T")[0];

// ───────────────── VALIDATION ─────────────────
const validate = (form: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.dob) errors.dob = "Date of birth is required.";

  if (!form.isAlive) {
    if (!form.death) {
      errors.death = "Date of death is required when deceased.";
    } else if (form.dob && form.death < form.dob) {
      errors.death = "Date of death cannot be before date of birth.";
    }
  }

  return errors;
};

// ───────────────── FIELD ─────────────────
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

// ───────────────── COMPONENT ─────────────────
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

  // spouse
  const [spouseMode, setSpouseMode] = useState<"none" | "existing">("none");
  const [spouseQuery, setSpouseQuery] = useState("");
  const [selectedSpouse, setSelectedSpouse] = useState<Family | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  // ───────────────── EFFECTS ─────────────────
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => nameInputRef.current?.focus(), 60);

    setForm(INITIAL_FORM);
    setErrors({});
    setTouched(new Set());
    setPhotoError(false);
    setSpouseMode("none");
    setSelectedSpouse(null);
    setSpouseQuery("");

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (form.isAlive) {
      setForm((prev) => (prev.death ? { ...prev, death: "" } : prev));
    }
  }, [form.isAlive]);

  useEffect(() => {
    if (touched.size) setErrors(validate(form));
  }, [form, touched]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ───────────────── HANDLERS ─────────────────
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

  const markTouched = useCallback((name: string) => {
    setTouched((prev) => new Set(prev).add(name));
  }, []);

  // ───────────────── MEMO ─────────────────
const filteredSpouse = useMemo(() => {
  const targetGender = form.gender === "M" ? "F" : "M";

  return persons
    .filter((p) => p.gender === targetGender) // 🔥 gender filter
    .filter((p) =>
      p.name.toLowerCase().includes(spouseQuery.toLowerCase())
    );
}, [spouseQuery, persons, form.gender]);

  // ───────────────── SAVE ─────────────────
  const handleSave = () => {
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

  if (!isOpen) return null;

  const hasErrors = Object.keys(errors).length > 0;

  // ───────────────── UI ─────────────────
  return (
    <div className="acm-backdrop">
      <div className="acm-panel">
        <div className="acm-header">
          <h2>Add New Child</h2>
          <button onClick={onClose}>✕</button>
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

            <input
              name="photo"
              value={form.photo}
              onChange={(e) => {
                setPhotoError(false);
                handleChange(e);
              }}
              className="acm-input"
            />
          </div>

          {/* NAME */}
          <Field
            label="Full Name"
            required
            error={touched.has("name") ? errors.name : undefined}
          >
            <input
              ref={nameInputRef}
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={() => markTouched("name")}
              className="acm-input"
            />
          </Field>

          {/* DOB */}
          <Field
            label="Date of Birth"
            required
            error={touched.has("dob") ? errors.dob : undefined}
          >
            <input
              name="dob"
              value={form.dob}
              onChange={handleChange}
              type="date"
              max={TODAY}
              className="acm-input"
            />
          </Field>

          {/* GENDER */}
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

          {/* MARRIED */}
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
              className={`acm-married-btn ${form.isMarried ? "active" : ""}`}
            >
              {form.isMarried ? "Married" : "Mark as Married"}
            </button>
          </Field>

          {/* SPOUSE */}
          {form.isMarried && (
            <div className="acm-field">
              <label className="acm-label">Spouse</label>

              {spouseMode === "none" && (
                <button onClick={() => setSpouseMode("existing")}>
                  Select Existing
                </button>
              )}

              {spouseMode === "existing" && (
                <div className="acm-dropdown" ref={dropdownRef}>
                  <input
                    className="acm-input"
                    placeholder="Search spouse..."
                    value={spouseQuery}
                    onChange={(e) => setSpouseQuery(e.target.value)}
                    onFocus={() => setDropdownOpen(true)}
                  />

                  {dropdownOpen && (
                    <div className="acm-dropdown-list">
                      {filteredSpouse.length === 0 && (
                        <div className="acm-dropdown-empty">
                          No results found
                        </div>
                      )}

                      {filteredSpouse.map((p) => (
                        <div
                          key={p.id}
                          className={`acm-dropdown-item ${
                            selectedSpouse?.id === p.id ? "selected" : ""
                          }`}
                          onClick={() => {
                            setSelectedSpouse(p);
                            setSpouseQuery(p.name);
                            setDropdownOpen(false);
                          }}
                        >
                          <img src={p.photo} className="acm-avatar-sm" />
                          <div className="acm-flex-col">
                            <span>{p.name}</span>
                            <span>{p.gender === "M" ? "Male" : "Female"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedSpouse && (
                    <div className="acm-selected">
                      Selected: <strong>{selectedSpouse.name}</strong>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSpouse(null);
                          setSpouseQuery("");
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="acm-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} disabled={hasErrors}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChildModal;
