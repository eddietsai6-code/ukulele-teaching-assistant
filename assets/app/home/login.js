const STORAGE_KEY = "ukebook-login-user";

function readStoredUser(windowRef) {
  try {
    const raw = windowRef.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user && typeof user.name === "string" && user.name.trim() ? user : null;
  } catch (error) {
    return null;
  }
}

function writeStoredUser(windowRef, user) {
  try {
    windowRef.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    // Browsers can block localStorage in private or embedded contexts.
  }
}

function clearStoredUser(windowRef) {
  try {
    windowRef.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Ignore unavailable localStorage; the visible state still updates.
  }
}

export function initTailarkLogin(documentRef = document, windowRef = window) {
  const trigger = documentRef.querySelector("[data-login-trigger]");
  const dialog = documentRef.getElementById("tailarkLoginDialog");
  const panel = dialog ? dialog.querySelector(".tailark-login-panel") : null;
  const form = documentRef.getElementById("tailarkLoginForm");
  const accountInput = documentRef.getElementById("tailarkLoginName");
  const passwordInput = documentRef.getElementById("tailarkLoginPassword");
  const feedback = documentRef.getElementById("tailarkLoginFeedback");
  const closeControls = dialog ? Array.from(dialog.querySelectorAll("[data-login-close]")) : [];

  if (!trigger || !dialog || !panel || !form || !accountInput || !passwordInput) return;

  let signedInUser = readStoredUser(windowRef);
  let previousFocus = null;

  function setFeedback(message) {
    if (feedback) feedback.textContent = message;
  }

  function renderSignedInState(user) {
    signedInUser = user;
    trigger.classList.toggle("is-signed-in", Boolean(user));
    trigger.textContent = user ? user.name : "Login";
    trigger.setAttribute("aria-expanded", dialog.hidden ? "false" : "true");
    trigger.setAttribute("aria-label", user ? `${user.name} signed in. Click to sign out.` : "Open login dialog");
    trigger.title = user ? "Click to sign out" : "";
  }

  function focusPanel() {
    if (typeof windowRef.requestAnimationFrame === "function") {
      windowRef.requestAnimationFrame(() => accountInput.focus());
      return;
    }
    accountInput.focus();
  }

  function openDialog() {
    previousFocus = documentRef.activeElement;
    dialog.hidden = false;
    dialog.classList.add("is-open");
    documentRef.body.classList.add("has-login-dialog");
    trigger.setAttribute("aria-expanded", "true");
    setFeedback("");
    focusPanel();
  }

  function closeDialog(restoreFocus = true) {
    dialog.classList.remove("is-open");
    dialog.hidden = true;
    documentRef.body.classList.remove("has-login-dialog");
    trigger.setAttribute("aria-expanded", "false");
    passwordInput.value = "";
    if (restoreFocus && previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  trigger.addEventListener("click", () => {
    if (signedInUser) {
      clearStoredUser(windowRef);
      renderSignedInState(null);
      setFeedback("");
      return;
    }
    openDialog();
  });

  closeControls.forEach((control) => {
    control.addEventListener("click", () => closeDialog());
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const account = accountInput.value.trim();
    const password = passwordInput.value.trim();
    if (!account || !password) {
      setFeedback("Please enter account and password.");
      return;
    }

    const user = {
      name: account,
      signedInAt: new Date().toISOString()
    };
    writeStoredUser(windowRef, user);
    form.reset();
    renderSignedInState(user);
    closeDialog();
  });

  documentRef.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dialog.hidden) {
      closeDialog();
    }
  });

  renderSignedInState(signedInUser);
}
