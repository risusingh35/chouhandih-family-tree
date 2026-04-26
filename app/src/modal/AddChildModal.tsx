"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  FormData,
  ChildNode,
  FormErrors,
  AddChildModalProps,
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

const AddChildModal = ({
  isOpen,
  onClose,
  parentId,
  onSave,
  vanshId,
}: AddChildModalProps) => {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [photoError, setPhotoError] = useState(false);
  const [spouseInput, setSpouseInput] = useState("");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const formId = useId();

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

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setErrors({});
      setTouched(new Set());
      setPhotoError(false);
      setSpouseInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (form.isAlive) setForm((prev) => ({ ...prev, death: "" }));
  }, [form.isAlive]);

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
      vanshId,
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
    <div
      className="acm-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
      onClick={handleBackdropClick}
    >
      <div className="acm-panel">
        <div className="acm-header">
          <div>
            <p className="acm-subtitle">Family Tree</p>
            <h2 id={`${formId}-title`} className="acm-title">
              Add New Child
            </h2>
          </div>

          <button onClick={onClose} className="acm-close">
            ✕
          </button>
        </div>

        <div className="acm-body">
          {/* Photo */}
          <div className="acm-photo-row">
            <div className="acm-avatar">
              {!photoError && form.photo ? (
                <img
                  src={form.photo}
                  alt="Preview"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <span className="acm-avatar-fallback">👤</span>
              )}
            </div>

            <div className="acm-flex-1">
              <label className="acm-label">Photo URL</label>
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
          </div>
          {/* Name */}
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
              className={`acm-input ${
                touched.has("name") && errors.name ? "acm-input-error" : ""
              }`}
            />
          </Field>
          {/* Gender */}
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
              onBlur={() => markTouched("dob")}
              type="date"
              max={TODAY}
              className={`acm-input ${
                touched.has("dob") && errors.dob ? "acm-input-error" : ""
              }`}
            />
          </Field>
          {/* Alive toggle  */}
          <Field label="Status" htmlFor={`${formId}-alive`}>
            <button
              id={`${formId}-alive`}
              type="button"
              role="switch"
              aria-checked={form.isAlive}
              onClick={() =>
                setForm((prev) => ({ ...prev, isAlive: !prev.isAlive }))
              }
              className={`acm-status-btn ${form.isAlive ? "alive" : "dead"}`}
            >
              <span className="acm-status-track">
                <span className="acm-status-thumb" />
              </span>
              {form.isAlive ? "Alive" : "Deceased"}
            </button>
          </Field>
          {/*  Date of death */}
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
                className={`acm-input ${
                  touched.has("death") && errors.death ? "acm-input-error" : ""
                }`}
              />
            </Field>
          )}
          {/* /* Married toggle */}
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
              <svg width="15" height="15" viewBox="0 0 15 15">
                <path d="M7.5 13C7.5 13 2 9.5 2 5.5C2 3.567 3.567 2 5.5 2C6.5 2 7.5 2.5 7.5 2.5C7.5 2.5 8.5 2 9.5 2C11.433 2 13 3.567 13 5.5C13 9.5 7.5 13 7.5 13Z" />
              </svg>
              {form.isMarried ? "Married" : "Mark as Married"}
            </button>
          </Field>
        </div>

        <div className="acm-footer">
          <button onClick={onClose} className="acm-btn-cancel">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={hasErrors && touched.size > 0}
            className="acm-btn-save"
          >
            Save Child
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChildModal;
