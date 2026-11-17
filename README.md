# Formly: User Registration & Form Validation System

A professional, frontend-only registration form built with **HTML5, CSS3 and Vanilla JavaScript**. It validates every field with custom JavaScript and Regular Expressions, gives real-time feedback, and shows a confirmation summary when all checks pass.

> **Project 4 – Frontend Development Internship (DecodeLabs)**

> ⚠️ **Demo only:** this project has no backend or database. No data is sent, stored or saved, and no real account is created.

---

## Features

- Clean, modern, responsive UI (desktop, tablet, mobile)
- Custom JavaScript validation for all 9 fields (`novalidate` on the form)
- Regex-based checks for name, email, phone, username and password
- Real-time validation (on blur, then on every change) with instant error removal
- Password visibility toggle, character counters and password strength meter
- Loading-style button feedback (simulated, no real request)
- Reset button that clears values, errors and validation states
- Success screen with confirmation summary (password excluded, phone masked)
- "Register Another Account" option
- Accessibility: semantic HTML, `aria-invalid`, `aria-describedby`, `aria-live`, visible focus, text-based errors (not colour alone), reduced-motion support

---

## Project Structure

```
decodelabs-project4/
├── index.html   # Semantic structure, form fields, ARIA attributes
├── style.css    # Design tokens, layout, states, responsive rules
├── script.js    # Validation engine, events, UX features
└── README.md
```

---

## How to Run Locally

### Option 1: Open directly
Double-click `index.html`, or run:

```powershell
start index.html
```

### Option 2: Local server (recommended)

```powershell
# Python
python -m http.server 5500

# or Node.js
npx serve .
```

Then open `http://localhost:5500`.

### Option 3: VS Code
Install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**.

---

## Validation Rules

| Field | Rules |
|---|---|
| Full Name | Required, trimmed, min 2 letters, letters/spaces/apostrophes/hyphens only |
| Email | Required, valid format via Regex (syntax only, inbox existence is not verified) |
| Phone | Required, digits/spaces/dashes/brackets with optional leading `+`, 10–15 digits |
| Username | Required, 4–20 characters, letters/numbers/underscores, no spaces |
| Password | Required, min 8 characters, uppercase + lowercase + number + special character |
| Confirm Password | Required, must exactly match password |
| Date of Birth | Required, must be a real date, not in the future |
| Gender | Required, a valid option must be selected |
| Terms & Conditions | Checkbox must be accepted |

---

## Architecture (Input → Process → Output)

**Input:** semantic HTML form elements collect user data (`index.html`).

**Process** (`script.js`):
1. `submit` listener calls `event.preventDefault()` immediately.
2. Each field has its own function: `validateName()`, `validateEmail()`, `validatePhone()`, `validateUsername()`, `validatePassword()`, `validateConfirmPassword()`, `validateDateOfBirth()`, `validateGender()`, `validateTerms()`.
3. Each validator returns an error message (or `""` when valid).
4. A central `validators` map and `validateForm()` check every field and report overall validity.
5. UI helpers `showError()` / `clearError()` update classes, ARIA attributes and error text.

**Output:** inline error messages under invalid fields, or the success confirmation with a summary when everything passes.

### Key design decisions
- **One validator per field** keeps the code readable and easy to explain.
- **Validators return messages**, so validation logic is separated from DOM updates.
- **`textContent` (not `innerHTML`)** is used for the summary to prevent HTML injection.
- **Date parsing is done manually** (`YYYY-MM-DD`) to avoid timezone bugs.

---

## Regex Patterns Used

```javascript
// Name: letters separated by single spaces, apostrophes or hyphens
/^\p{L}+(?:[ '’-]\p{L}+)*$/u

// Email: local-part @ domain . tld (2+ letters)
/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/

// Phone: optional +, then digits, spaces, dashes or brackets
/^\+?[0-9\s\-()]+$/

// Username: 4–20 letters, numbers or underscores
/^[A-Za-z0-9_]{4,20}$/

// Password rules (one regex per rule)
/[A-Z]/  /[a-z]/  /[0-9]/  /[^A-Za-z0-9\s]/
```

---

## Testing Checklist

| # | Scenario | Expected Result | Status |
|---|---|---|---|
| 1 | Submit an empty form | All fields show errors, summary banner appears, focus moves to first invalid field | ✅ |
| 2 | Invalid email (`abc@`) | "Please enter a valid email address…" | ✅ |
| 3 | Invalid username (`ab`, `a b`, `user!`) | Length / spaces / character error shown | ✅ |
| 4 | Weak password (`abc123`) | Length or complexity error shown | ✅ |
| 5 | Mismatched passwords | "Passwords do not match." | ✅ |
| 6 | Leave required fields empty | Field-specific "Please enter…" messages | ✅ |
| 7 | Future date of birth | "Date of birth cannot be in the future." | ✅ |
| 8 | Terms unchecked | "Please accept the Terms & Conditions." | ✅ |
| 9 | Fully valid form | Loading state, then success screen with summary | ✅ |
| 10 | Reset after typing | All values, errors and states cleared | ✅ |
| 11 | Toggle password visibility | Show/Hide works on both fields, ARIA updated | ✅ |
| 12 | Correct an invalid field | Error disappears immediately | ✅ |

### Sample valid data

```
Full Name:        Ayesha Khan
Email:            ayesha.khan@example.com
Phone:            +92 300 1234567
Username:         ayesha_khan
Password:         Secure@123
Confirm Password: Secure@123
Date of Birth:    2002-05-14
Gender:           Female
Terms:            Checked
```

---

## Requirements Coverage

- [x] Three separate files (HTML, CSS, JS), no inline CSS/JS
- [x] No frameworks or external libraries
- [x] Header, heading, description, form, Submit, Reset, success section, footer
- [x] `event.preventDefault()` on submit, no page refresh
- [x] Separate validation function per field plus a central validator
- [x] Regex for email, username, password and more
- [x] Errors shown below fields, removed when corrected
- [x] Success summary excludes password, no fake backend claims
- [x] ARIA attributes, labels, focus styles, `aria-live` regions
- [x] Responsive layout, reduced-motion support

---

## Possible Future Improvements

- Country-specific phone formats and a country code selector
- Minimum age check based on date of birth
- Real backend integration (API + server-side validation)
- Unit tests for validators (e.g. with Jest)

---

## License

Created for educational purposes as part of the DecodeLabs Frontend Development Internship.