import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./views/App";
import { appStyles } from "./views/styles";
import { ensureBlurOverlay } from "./overlays/blur";
import { setupMessageListener } from "./messageHandler";

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

createRoot(shadowContainer).render(
  <StrictMode>
    <App />
  </StrictMode>
);
