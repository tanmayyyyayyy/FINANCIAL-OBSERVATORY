/**
 * Financial Observatory — Chrome Extension Popup
 * Manifest V3 · Plain ES Modules · Locally Bundled Firebase JS SDK
 *
 * Firestore path: users/{uid}/transactions  (same as main app)
 * Transaction schema: { amount, category, description, paymentMethod, date, type, createdAt }
 */

import {
  initializeApp,
  getApps,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "./firebase.js";

import { firebaseConfig, APP_URL } from "./firebase-config.js";

// ── Firebase init ─────────────────────────────────────────────────────────────
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── Categories (same as QuickAdd.tsx BASE_CATEGORIES) ─────────────────────────
const CATEGORIES = [
  { id: "Food & Dining",   label: "Food",          icon: "🍔" },
  { id: "Transport",       label: "Travel",         icon: "🚕" },
  { id: "Shopping",        label: "Shopping",       icon: "🛍" },
  { id: "Utilities",       label: "Bills",          icon: "🏠" },
  { id: "Entertainment",   label: "Fun",            icon: "🎮" },
  { id: "Health",          label: "Health",         icon: "💊" },
  { id: "Housing",         label: "Housing",        icon: "🏢" },
  { id: "Other",           label: "Other",          icon: "📦" },
];

const PAYMENT_METHODS = ["UPI", "Credit Card", "Debit Card", "Cash", "Bank Transfer"];
const MAX_AMOUNT = 10_000_000;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const screens = {
  loading: $("screen-loading"),
  auth:    $("screen-auth"),
  form:    $("screen-form"),
};

let selectedCategory = "Food & Dining";
let submitting = false;

// ── Screen switcher ───────────────────────────────────────────────────────────
function showScreen(name) {
  Object.entries(screens).forEach(([k, el]) => {
    el.classList.toggle("hidden", k !== name);
  });
}

// ── Auth state ────────────────────────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (user) {
    $("user-email-display").textContent = user.email ?? "";
    showScreen("form");
    resetForm();
    $("amount-input").focus();
  } else {
    showScreen("auth");
    $("auth-email").focus();
  }
});

// ── Sign-in form ──────────────────────────────────────────────────────────────
$("auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email    = $("auth-email").value.trim();
  const password = $("auth-password").value;
  const errEl    = $("auth-error");
  const btn      = $("auth-submit");

  errEl.classList.add("hidden");
  btn.disabled = true;
  btn.textContent = "Signing in…";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will switch screens
  } catch (err) {
    errEl.textContent = friendlyAuthError(err.code);
    errEl.classList.remove("hidden");
    btn.disabled = false;
    btn.textContent = "Sign In";
  }
});

// ── Sign out ──────────────────────────────────────────────────────────────────
$("sign-out-btn").addEventListener("click", async () => {
  await signOut(auth);
});

// ── Build category grid ───────────────────────────────────────────────────────
function buildCategoryGrid() {
  const grid = $("category-grid");
  grid.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `cat-chip${cat.id === selectedCategory ? " selected" : ""}`;
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", cat.id === selectedCategory ? "true" : "false");
    btn.dataset.catId = cat.id;
    btn.innerHTML = `<span class="cat-icon">${cat.icon}</span><span>${cat.label}</span>`;
    btn.addEventListener("click", () => {
      selectedCategory = cat.id;
      grid.querySelectorAll(".cat-chip").forEach((c) => {
        const active = c.dataset.catId === selectedCategory;
        c.classList.toggle("selected", active);
        c.setAttribute("aria-checked", String(active));
      });
      updateSubmitState();
    });
    grid.appendChild(btn);
  });
}

// ── Date default ─────────────────────────────────────────────────────────────
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── Submit state ──────────────────────────────────────────────────────────────
function updateSubmitState() {
  const raw     = $("amount-input").value.replace(/,/g, "");
  const amount  = parseFloat(raw);
  const valid   = !isNaN(amount) && isFinite(amount) && amount > 0 && amount <= MAX_AMOUNT;
  $("submit-btn").disabled = !valid || submitting;
}

// ── Amount input ──────────────────────────────────────────────────────────────
$("amount-input").addEventListener("input", (e) => {
  const raw = e.target.value.replace(/,/g, "");
  if (raw === "" || /^\d+(\.\d{0,2})?$/.test(raw)) {
    updateSubmitState();
    $("validation-error").classList.add("hidden");
    hideSucess();
  } else {
    e.target.value = raw.replace(/[^0-9.]/g, "");
  }
});

// ── Reset form ────────────────────────────────────────────────────────────────
function resetForm() {
  $("amount-input").value  = "";
  $("desc-input").value    = "";
  $("date-input").value    = todayISO();
  $("payment-input").value = "UPI";
  selectedCategory = "Food & Dining";
  $("validation-error").classList.add("hidden");
  buildCategoryGrid();
  updateSubmitState();
}

function hideSucess() {
  $("success-banner").classList.add("hidden");
}

// ── Expense form submit ───────────────────────────────────────────────────────
$("expense-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (submitting) return;

  const user = auth.currentUser;
  if (!user) { showScreen("auth"); return; }

  const raw    = $("amount-input").value.replace(/,/g, "");
  const amount = parseFloat(raw);
  const errEl  = $("validation-error");

  if (isNaN(amount) || !isFinite(amount) || amount <= 0) {
    errEl.textContent = "Enter a valid amount greater than ₹0.";
    errEl.classList.remove("hidden");
    return;
  }
  if (amount > MAX_AMOUNT) {
    errEl.textContent = "Amount must be ₹1,00,00,000 or less.";
    errEl.classList.remove("hidden");
    return;
  }

  const dateVal    = $("date-input").value || todayISO();
  const desc       = $("desc-input").value.trim() || selectedCategory;
  const payment    = $("payment-input").value;

  submitting = true;
  $("submit-btn").disabled = true;
  $("submit-label").textContent = "Adding…";
  errEl.classList.add("hidden");

  try {
    const ref = doc(collection(db, "users", user.uid, "transactions"));
    await setDoc(ref, {
      type:          "expense",
      amount,
      category:      selectedCategory,
      description:   desc,
      paymentMethod: payment,
      date:          dateVal,
      createdAt:     new Date().toISOString(),
    });

    // Success
    const catLabel = CATEGORIES.find(c => c.id === selectedCategory)?.label ?? selectedCategory;
    const banner   = $("success-banner");
    banner.textContent = `✓ ₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })} · ${catLabel} added`;
    banner.classList.remove("hidden");

    // Reset for next expense
    $("amount-input").value = "";
    $("desc-input").value   = "";
    selectedCategory = "Food & Dining";
    buildCategoryGrid();
    updateSubmitState();
    setTimeout(() => banner.classList.add("hidden"), 5000);
    $("amount-input").focus();
  } catch (err) {
    errEl.textContent = "Couldn't save. Check your connection and try again.";
    errEl.classList.remove("hidden");
  } finally {
    submitting = false;
    $("submit-btn").disabled = false;
    $("submit-label").textContent = "+ Add Expense";
    updateSubmitState();
  }
});

// ── Open app links ────────────────────────────────────────────────────────────
[$("open-app-auth"), $("open-app-form")].forEach((el) => {
  el.href = APP_URL;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});

// ── Auth error messages ───────────────────────────────────────────────────────
function friendlyAuthError(code) {
  const map = {
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/user-not-found":         "No account found for that email.",
    "auth/wrong-password":         "Incorrect password. Please try again.",
    "auth/invalid-credential":     "Incorrect email or password.",
    "auth/too-many-requests":      "Too many attempts. Please wait a moment.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] ?? "Sign-in failed. Please try again.";
}

// ── Initial setup ─────────────────────────────────────────────────────────────
buildCategoryGrid();
$("date-input").value    = todayISO();
$("payment-input").value = "UPI";
