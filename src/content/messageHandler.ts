import { ensureBlindnessCurtain, setBlindnessMode } from "./overlays/blindness";
import { setBlurAmount } from "./overlays/blur";

type CvdMode =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "monochromacy";

let svgEl: SVGSVGElement | null = null;
let matrixEl: SVGFEColorMatrixElement | null = null;

const ID_FILTER = "accesslens-cvd-filter";
const ID_SVG = "accesslens-cvd-svg";

const identity = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];

// More accurate CVD simulation matrices (Brettel et al., Viénot et al.)
const matrices: Record<Exclude<CvdMode, "none">, number[]> = {
  // Protanopia (red-blind): no L-cone
  protanopia: [
    0.152286, 1.052583, -0.204868, 0, 0, 0.114503, 0.786281, 0.099216, 0, 0,
    -0.003882, -0.048116, 1.051998, 0, 0, 0, 0, 0, 1, 0,
  ],
  // Deuteranopia (green-blind): no M-cone
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0, 0, 0.280085, 0.672501, 0.047413, 0, 0,
    -0.01182, 0.04294, 0.968881, 0, 0, 0, 0, 0, 1, 0,
  ],
  // Tritanopia (blue-blind): no S-cone
  tritanopia: [
    1.255528, -0.076749, -0.178779, 0, 0, -0.078411, 0.930809, 0.147602, 0, 0,
    0.004733, 0.691367, 0.3039, 0, 0, 0, 0, 0, 1, 0,
  ],
  // Monochromacy (grayscale): luminance-weighted average
  monochromacy: [
    0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114,
    0, 0, 0, 0, 0, 1, 0,
  ],
};

function mixMatrix(target: number[], t: number): number[] {
  // Linear interpolation: identity * (1 - t) + target * t
  return identity.map((idVal, i) => idVal + (target[i] - idVal) * t);
}

function ensureFilter(): SVGFEColorMatrixElement {
  if (matrixEl) return matrixEl;

  svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("id", ID_SVG);
  svgEl.setAttribute("width", "0");
  svgEl.setAttribute("height", "0");
  svgEl.style.cssText = `
    position: fixed;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: -1;
  `;

  const filter = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "filter"
  );
  filter.setAttribute("id", ID_FILTER);

  matrixEl = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "feColorMatrix"
  );
  matrixEl.setAttribute("type", "matrix");
  matrixEl.setAttribute("values", identity.join(" "));

  filter.appendChild(matrixEl);
  svgEl.appendChild(filter);
  document.body.appendChild(svgEl);

  return matrixEl;
}

/**
 * Apply a CVD simulation with adjustable intensity (0–100).
 * Mode "none" or intensity 0 clears the filter.
 */
export function setCvdMode(mode: CvdMode, intensity: number): void {
  const t = Math.max(0, Math.min(100, intensity)) / 100;

  if (mode === "none" || t === 0) {
    document.documentElement.style.filter = "";
    return;
  }

  const target = matrices[mode];
  if (!target) {
    document.documentElement.style.filter = "";
    return;
  }

  const mixed = mixMatrix(target, t);
  const m = ensureFilter();

  // Force the browser to notice the attribute change by toggling the filter
  document.documentElement.style.filter = "";
  m.setAttribute("values", mixed.join(" "));

  // Use requestAnimationFrame to ensure the DOM update completes
  requestAnimationFrame(() => {
    document.documentElement.style.filter = `url("#${ID_FILTER}")`;
  });
}

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
        const mode =
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
      // Future messages:
      // case "ACCESSLENS_SET_CONTRAST": { ... }
      // case "ACCESSLENS_SET_TEXT_SCALE": { ... }

      default:
        // Unknown message type, no-op
        break;
    }
  });
}
