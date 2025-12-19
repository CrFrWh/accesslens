import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./views/App";
import { appStyles } from "./views/styles";
import { ensureBlurOverlay } from "./overlays/blur";
import { setupMessageListener } from "./messageHandler";
import { setBlindnessMode } from "./overlays/blindness";

const container = document.createElement("div");
container.id = "accesslens-root";
document.body.appendChild(container);
console.log("Content script loaded");
// Create shadow root for style isolation
const shadowRoot = container.attachShadow({ mode: "open" });
const shadowContainer = document.createElement("div");
shadowContainer.className = "accesslens-root";
shadowRoot.appendChild(shadowContainer);

// Inject CSS into shadow DOM
const style = document.createElement("style");
style.textContent = appStyles;
shadowRoot.appendChild(style);

// Bootstrap overlays
ensureBlurOverlay();

// Setup message handling
setupMessageListener();

// Global click listener to disable blindness mode on link clicks
document.addEventListener("click", (e) => {
  const active = e.target;
  if (!(active instanceof Element)) return;

  const anchor =
    active.tagName.toLowerCase() === "a" ||
    active.getAttribute("role") === "link";
  !!active.closest("a[href]");
  if (!anchor) return;

  const me = e as MouseEvent;
  if (me.button !== 0 || me.ctrlKey || me.shiftKey || me.altKey || me.metaKey)
    return;

  setBlindnessMode(false);
  chrome.storage.sync.set({ blindnessEnabled: false }).catch(() => {});
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const active = document.activeElement;
  if (!(active instanceof Element)) return;

  // Only proceed if the active element is a link
  const anchor =
    active.tagName.toLowerCase() === "a" ||
    active.getAttribute("role") === "link";
  !!active.closest("a[href]");
  if (!anchor) return;

  setBlindnessMode(false);
  chrome.storage.sync.set({ blindnessEnabled: false }).catch(() => {});
});

createRoot(shadowContainer).render(
  <StrictMode>
    <App />
  </StrictMode>
);
