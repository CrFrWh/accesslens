import { ensureBlindnessCurtain, setBlindnessMode } from "./overlays/blindness";
import { setBlurAmount } from "./overlays/blur";
import { applyCognitiveStyles } from "./overlays/cognitive";
import { setCvdMode, type CvdMode } from "./overlays/cvd";
import { setCaptionReminder, setPageMute } from "./overlays/hearing";

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

      case "ACCESSLENS_SET_CVD": {
        const mode: CvdMode =
          typeof message.payload?.mode === "string"
            ? message.payload.mode
            : "none";
        const intensity =
          typeof message.payload?.intensity === "number"
            ? message.payload.intensity
            : 100;
        setCvdMode(mode, intensity);
        sendResponse({ success: true });
        break;
      }

      case "ACCESSLENS_SET_COGNITIVE": {
        const letterSpacingPx =
          typeof message.payload?.letterSpacingPx === "number"
            ? message.payload.letterSpacingPx
            : 0;
        const lineHeight =
          typeof message.payload?.lineHeight === "number"
            ? message.payload.lineHeight
            : 1.5;
        const jitter = !!message.payload?.jitterEnabled;
        const density = !!message.payload?.densityEnabled;
        applyCognitiveStyles({
          letterSpacingPx,
          lineHeight,
          jitter,
          density,
        });
        sendResponse({ success: true });
        break;
      }

      case "ACCESSLENS_SET_PAGE_MUTE": {
        const mute = !message.payload?.isMuted;
        setPageMute(mute);
        sendResponse({ success: true });
        break;
      }

      case "ACCESSLENS_SET_CAPTIONS_REMINDER": {
        const showReminder = !!message.payload?.showCaptionsReminder;
        setCaptionReminder(showReminder);
        sendResponse({ success: true });
        break;
      }

      default:
        break;
    }
  });
}
