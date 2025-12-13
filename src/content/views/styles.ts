export const appStyles = `
/* Shadow root base to isolate controls */
.accesslens-root {
  all: initial;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  color: #000 !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none !important;
  z-index: 2147483647 !important;
}

.accesslens-root * {
  box-sizing: border-box !important;
  pointer-events: auto !important;
}

.popup-container {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 1.25rem;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  user-select: none;
  line-height: 1em;
}

.popup-content {
  background-color: white;
  color: #1f2937;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: max-content;
  height: min-content;
  padding: 0.5rem 1rem;
  margin: auto 0.5rem 0 0;
  transition: opacity 300ms;
}

.toggle-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  cursor: pointer;
  border: none;
  background-color: #288cd7;
  padding: 0;
}

.toggle-button:hover {
  background-color: #1e6aa3;
}

.button-icon {
  width: 1.5rem;
  height: 1.5rem;
  padding: 4px;
}

.opacity-100 {
  opacity: 1;
}

.opacity-0 {
  opacity: 0;
}
`;
