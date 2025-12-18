import { setBlurAmount } from "./overlays/blur";

export function setupMessageListener(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case "ACCESSLENS_SET_BLUR": {
        const blurPx =
          typeof message.payload?.blurPx === "number"
            ? message.payload.blurPx
            : 0;
        setBlurAmount(blurPx);
        sendResponse({ success: true });
        break;
      }

      // Future messages:
      // case "ACCESSLENS_SET_CONTRAST": { ... }
      // case "ACCESSLENS_SET_TEXT_SCALE": { ... }

      default:
        // Unknown message type, no-op
        break;
    }
  });
}
