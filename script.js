// script.js
"use strict";

/* =====================================================
   1. REGEX PATTERNS (each one explained)
   ===================================================== */

// Name: letters (any language) separated by single spaces, apostrophes or hyphens
const NAME_REGEX = /^\p{L}+(?:[ '’-]\p{L}+)*$/u;

// Email: local-part @ domain . tld (2+ letters). Reasonable, not full RFC.
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

// Phone: optional leading +, then digits with spaces, dashes or brackets allowed
const PHONE_REGEX = /^\+?[0-9\s\-()]+$/;

// Username: 4-20 chars; letters, numbers and underscores only (no spaces)
const USERNAME_REGEX = /^[A-Za-z0-9_]{4,20}$/;

// Password rules, one regex per rule so the message can be specific
const PASSWORD_RULES = {
  uppercase: /[A-Z]/,            // at least one uppercase letter
  lowercase: /[a-z]/,            // at least one lowercase letter
  number:    /[0-9]/,            // at least one digit
  special:   /[^A-Za-z0-9\s]/    // at least one special character
};

/* =====================================================
   2. DOM REFERENCES
   ===================================================== */

const form              = document.getElementById("registration-form");
const registrationCard  = document.getElementById("registration-section");
const successSection    = document.getElementById("success-section");
const summaryList       = document.getElementById("summary-list");
const formStatus        = document.getElementById("form-status");
const submitButton      = document.getElementById("submit-btn");
const submitLabel       = submitButton.querySelector(".btn__label");
const resetButton       = document.getElementById("reset-btn");
const registerAnotherBtn = document.getElementById("register-another-btn");
const strengthBar       = document.getElementById("strength-bar");

const inputs = {
  fullName:        document.getElementById("fullName"),
  email:           document.getElementById("email"),
  phone:           document.getElementById("phone"),
  username:        document.getElementById("username"),
  password:        document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
  dob:             document.getElementById("dob"),
  gender:          document.getElementById("gender"),
  terms:           document.getElementById("terms")
};

/* =====================================================
   3. VALIDATION FUNCTIONS
   Each returns an error message string, or "" when valid.
   ===================================================== */

function validateName() {
  const value = inputs.fullName.value.trim();
  if (value === "") return "Please enter your full name.";
  if (value.length < 2) return "Full name must contain at least 2 letters.";
  if (!NAME_REGEX.test(value)) {
    return "Full name can only contain letters, spaces, apostrophes and hyphens.";
  }
  return "";
}

function validateEmail() {
  const value = inputs.email.value.trim();
  if (value === "") return "Please enter your email address.";
  if (!EMAIL_REGEX.test(value)) {
    return "Please enter a valid email address (e.g. name@example.com).";
  }
  return "";
}

function validatePhone() {
  const value = inputs.phone.value.trim();
  if (value === "") return "Please enter your phone number.";
  if (!PHONE_REGEX.test(value)) {
    return "Phone number can only contain digits, spaces, dashes, brackets and a leading +.";
  }
  const digitCount = value.replace(/\D/g, "").length;
  if (digitCount < 10 || digitCount > 15) {
    return "Phone number must contain 10–15 digits (e.g. +92 300 1234567).";
  }
  return "";
}

function validateUsername() {
  const value = inputs.username.value; // not trimmed: spaces are not allowed
  if (value === "") return "Please choose a username.";
  if (/\s/.test(value)) return "Username cannot contain spaces.";
  if (value.length < 4 || value.length > 20) return "Username must contain 4–20 characters.";
  if (!USERNAME_REGEX.test(value)) {
    return "Username can only contain letters, numbers and underscores.";
  }
  return "";
}

function validatePassword() {
  const value = inputs.password.value;
  if (value === "") return "Please create a password.";
  if (value.length < 8) return "Password must be at least 8 characters long.";
  const { uppercase, lowercase, number, special } = PASSWORD_RULES;
  if (!uppercase.test(value) || !lowercase.test(value) || !number.test(value) || !special.test(value)) {
    return "Password must contain an uppercase letter, lowercase letter, number, and special character.";
  }
  return "";
}

function validateConfirmPassword() {
  const value = inputs.confirmPassword.value;
  if (value === "") return "Please confirm your password.";
  if (value !== inputs.password.value) return "Passwords do not match.";
  return "";
}

function validateDateOfBirth() {
  const value = inputs.dob.value;
  if (value === "") return "Please select your date of birth.";

  // Parse manually (YYYY-MM-DD) to avoid timezone shifts
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate = date.getFullYear() === year &&
                     date.getMonth() === month - 1 &&
                     date.getDate() === day;
  if (!isRealDate) return "Please enter a valid date.";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) return "Date of birth cannot be in the future.";
  if (year < 1900) return "Please enter a valid year (1900 or later).";
  return "";
}

function validateGender() {
  if (inputs.gender.value === "") return "Please select your gender.";
  return "";
}

function validateTerms() {
  if (!inputs.terms.checked) return "Please accept the Terms & Conditions.";
  return "";
}

// Central map: field name -> validator
const validators = {
  fullName:        validateName,
  email:           validateEmail,
  phone:           validatePhone,
  username:        validateUsername,
  password:        validatePassword,
  confirmPassword: validateConfirmPassword,
  dob:             validateDateOfBirth,
  gender:          validateGender,
  terms:           validateTerms
};

/* =====================================================
   4. UI FEEDBACK HELPERS
   ===================================================== */

function showError(fieldName, message) {
  const input = inputs[fieldName];
  const errorElement = document.getElementById(`${fieldName}-error`);
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");
  input.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
  errorElement.classList.add("is-visible");
}

function clearError(fieldName) {
  const input = inputs[fieldName];
  const errorElement = document.getElementById(`${fieldName}-error`);
  input.classList.remove("is-invalid");
  if (input.type !== "checkbox") input.classList.add("is-valid");
  input.setAttribute("aria-invalid", "false");
  errorElement.textContent = "";
  errorElement.classList.remove("is-visible");
}

// Validate a single field and update the UI. Returns true when valid.
function validateField(fieldName) {
  const message = validators[fieldName]();
  if (message) {
    showError(fieldName, message);
    return false;
  }
  clearError(fieldName);
  return true;
}

// Central validation: checks every field and reports overall validity.
function validateForm() {
  let isFormValid = true;
  let firstInvalidField = null;
  let invalidCount = 0;

  Object.keys(validators).forEach((fieldName) => {
    const isValid = validateField(fieldName);
    if (!isValid) {
      isFormValid = false;
      invalidCount += 1;
      if (!firstInvalidField) firstInvalidField = fieldName;
    }
  });

  return { isFormValid, firstInvalidField, invalidCount };
}

function showFormStatus(message) {
  formStatus.textContent = message;
  formStatus.className = "form-status form-status--error";
  formStatus.hidden = false;
}

function hideFormStatus() {
  formStatus.textContent = "";
  formStatus.hidden = true;
}

function resetFieldStates() {
  Object.keys(inputs).forEach((fieldName) => {
    const input = inputs[fieldName];
    input.classList.remove("is-invalid", "is-valid");
    input.setAttribute("aria-invalid", "false");
    const errorElement = document.getElementById(`${fieldName}-error`);
    errorElement.textContent = "";
    errorElement.classList.remove("is-visible");
  });
  touchedFields.clear();
  hideFormStatus();
  updateCounters();
  updateStrengthMeter();
}

/* =====================================================
   5. UX ENHANCEMENTS
   ===================================================== */

// Character counters
function updateCounters() {
  document.getElementById("username-count").textContent = `${inputs.username.value.length}/20`;
  document.getElementById("password-count").textContent = `${inputs.password.value.length} chars`;
}

// Simple strength meter (0-5 based on length + rule matches)
function updateStrengthMeter() {
  const value = inputs.password.value;
  let score = 0;
  if (value.length >= 8) score += 1;
  Object.values(PASSWORD_RULES).forEach((rule) => { if (rule.test(value)) score += 1; });

  const colors = ["#b42318", "#b42318", "#dc6803", "#ca8504", "#4d8c1f", "#067647"];
  strengthBar.style.width = value ? `${(score / 5) * 100}%` : "0";
  strengthBar.style.background = colors[score];
}

// Password visibility toggle
document.querySelectorAll(".toggle-visibility").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    const isHidden = target.type === "password";
    target.type = isHidden ? "text" : "password";
    button.textContent = isHidden ? "Hide" : "Show";
    button.setAttribute("aria-pressed", String(isHidden));
    const fieldLabel = button.dataset.target === "password" ? "password" : "confirm password";
    button.setAttribute("aria-label", `${isHidden ? "Hide" : "Show"} ${fieldLabel}`);
  });
});

// Prevent future dates in the date picker (local date, no timezone shift)
function setMaxDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  inputs.dob.max = `${yyyy}-${mm}-${dd}`;
}

/* =====================================================
   6. REAL-TIME VALIDATION EVENTS
   A field is validated on blur; after that (or if it already
   shows an error) it is revalidated on every change.
   ===================================================== */

const touchedFields = new Set();

Object.keys(inputs).forEach((fieldName) => {
  const input = inputs[fieldName];
  const liveEvent = (input.type === "checkbox" || input.tagName === "SELECT") ? "change" : "input";

  input.addEventListener("blur", () => {
    // Skip untouched empty fields so tabbing through doesn't scream errors
    if (input.type !== "checkbox" && input.value === "" && !touchedFields.has(fieldName)) return;
    touchedFields.add(fieldName);
    validateField(fieldName);
  });

  input.addEventListener(liveEvent, () => {
    if (touchedFields.has(fieldName) || input.classList.contains("is-invalid")) {
      touchedFields.add(fieldName);
      validateField(fieldName);
    }
    // Keep confirm password in sync when password changes
    if (fieldName === "password" && touchedFields.has("confirmPassword")) {
      validateField("confirmPassword");
    }
  });
});

inputs.username.addEventListener("input", updateCounters);
inputs.password.addEventListener("input", () => { updateCounters(); updateStrengthMeter(); });

/* =====================================================
   7. SUBMISSION HANDLING
   ===================================================== */

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop page refresh immediately

  const { isFormValid, firstInvalidField, invalidCount } = validateForm();

  if (!isFormValid) {
    showFormStatus(`Please fix ${invalidCount} ${invalidCount === 1 ? "error" : "errors"} below before continuing.`);
    inputs[firstInvalidField].focus();
    return; // invalid data is never "submitted"
  }

  hideFormStatus();
  simulateProcessing(() => {
    renderSummary();
    registrationCard.hidden = true;
    successSection.hidden = false;
    successSection.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Loading-style feedback only; no real network request happens
function simulateProcessing(onComplete) {
  submitButton.disabled = true;
  submitButton.classList.add("is-loading");
  submitButton.setAttribute("aria-busy", "true");
  submitLabel.textContent = "Processing...";

  setTimeout(() => {
    submitButton.disabled = false;
    submitButton.classList.remove("is-loading");
    submitButton.removeAttribute("aria-busy");
    submitLabel.textContent = "Create Account";
    onComplete();
  }, 900);
}

/* =====================================================
   8. SUCCESS SUMMARY (password and sensitive data excluded)
   ===================================================== */

const GENDER_LABELS = {
  "female": "Female",
  "male": "Male",
  "other": "Other",
  "prefer-not-to-say": "Prefer not to say"
};

function maskPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return `${"•".repeat(Math.max(digits.length - 3, 0))}${digits.slice(-3)}`;
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
}

function renderSummary() {
  const rows = [
    ["Full Name",     inputs.fullName.value.trim()],
    ["Email",         inputs.email.value.trim()],
    ["Phone",         maskPhone(inputs.phone.value.trim())],
    ["Username",      inputs.username.value],
    ["Date of Birth", formatDate(inputs.dob.value)],
    ["Gender",        GENDER_LABELS[inputs.gender.value]],
    ["Terms",         "Accepted"]
  ];

  summaryList.textContent = ""; // clear previous summary
  rows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "summary__row";
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;   // textContent prevents HTML injection
    row.append(dt, dd);
    summaryList.appendChild(row);
  });
}

/* =====================================================
   9. RESET & REGISTER ANOTHER
   ===================================================== */

// The native reset clears values; we clear validation UI afterwards
form.addEventListener("reset", () => {
  // Wait for the browser to reset values, then clean the UI state
  setTimeout(() => {
    resetFieldStates();
    // Restore hidden-password state on both toggles
    document.querySelectorAll(".toggle-visibility").forEach((button) => {
      const target = document.getElementById(button.dataset.target);
      target.type = "password";
      button.textContent = "Show";
      button.setAttribute("aria-pressed", "false");
      const fieldLabel = button.dataset.target === "password" ? "password" : "confirm password";
      button.setAttribute("aria-label", `Show ${fieldLabel}`);
    });
    inputs.fullName.focus();
  }, 0);
});

registerAnotherBtn.addEventListener("click", () => {
  form.reset();
  successSection.hidden = true;
  registrationCard.hidden = false;
  inputs.fullName.focus();
});

/* =====================================================
   10. INITIALISATION
   ===================================================== */

setMaxDate();
updateCounters();
document.getElementById("current-year").textContent = new Date().getFullYear();