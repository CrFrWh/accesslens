import { ensureBlindnessCurtain, setBlindnessMode } from "./overlays/blindness";
import { setBlurAmount } from "./overlays/blur";

export function setupMessageListener(): void {
  ensureBlindnessCurtain();

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

      case "ACCESSLENS_SET_BLINDNESS": {
        console.log("Received blindness mode message:", message);
        const enabled = !!message.payload?.enabled;
        const showHintBanner = !!message.payload?.showHintBanner;
        const hintText =
          typeof message.payload?.hintText === "string"
            ? message.payload.hintText
            : undefined;
        setBlindnessMode(enabled, { showHintBanner, hintText });
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
