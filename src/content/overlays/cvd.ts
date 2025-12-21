/* 
    CVD Overlay Module works by injecting an SVG filter into the page
    and applying it to the document body. The filter uses an SVG 
    feColorMatrix to transform colors based on the selected type 
    of color vision deficiency.
    The module exposes functions to set the CVD mode and intensity.
    feColorMatrix works by applying a 5x4 matrix to RGBA color values.
    The matrices used here are based on established models for simulating
    different types of color blindness.
*/

export type CvdMode =
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

// More accurate CVD simulation matrices (Brettel/Viénot)
const matrices: Record<Exclude<CvdMode, "none">, number[]> = {
  protanopia: [
    0.152286, 1.052583, -0.204868, 0, 0, 0.114503, 0.786281, 0.099216, 0, 0,
    -0.003882, -0.048116, 1.051998, 0, 0, 0, 0, 0, 1, 0,
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968, 0, 0, 0.280085, 0.672501, 0.047413, 0, 0,
    -0.01182, 0.04294, 0.968881, 0, 0, 0, 0, 0, 1, 0,
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779, 0, 0, -0.078411, 0.930809, 0.147602, 0, 0,
    0.004733, 0.691367, 0.3039, 0, 0, 0, 0, 0, 1, 0,
  ],
  monochromacy: [
    0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114,
    0, 0, 0, 0, 0, 1, 0,
  ],
};

function mixMatrix(target: number[], t: number): number[] {
  return identity.map((idVal, i) => idVal + (target[i] - idVal) * t);
}

function ensureFilter(): SVGFEColorMatrixElement {
  if (matrixEl) return matrixEl;

  svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("id", ID_SVG);
  svgEl.setAttribute("width", "0");
  svgEl.setAttribute("height", "0");
  svgEl.style.cssText =
    "position: fixed; width: 0; height: 0; pointer-events: none; z-index: -1;";

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

/** Apply a CVD simulation with adjustable intensityPct (0–100). */
export function setCvdMode(mode: CvdMode, intensityPct: number): void {
  const t = Math.max(0, Math.min(100, intensityPct)) / 100;

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

  // Force the browser to pick up the change
  document.documentElement.style.filter = "";
  m.setAttribute("values", mixed.join(" "));
  requestAnimationFrame(() => {
    document.documentElement.style.filter = `url("#${ID_FILTER}")`;
  });
}
