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

//identity matrix for no color transformation
const identity = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];

//matrices for different types of color vision deficiency
const matrices: Record<Exclude<CvdMode, "none">, number[]> = {
  protanopia: [
    0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0,
    0, 1, 0,
  ],
  deuteranopia: [
    0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0,
  ],
  tritanopia: [
    0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0,
    1, 0,
  ],
  monochromacy: [
    0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114,
    0, 0, 0, 0, 0, 1, 0,
  ],
};

//mixMatrix linearly interpolates between identity and target matrix based on intensity (0 to 1)
function mixMatrix(target: number[], intensity: number): number[] {
  return identity.map(
    (val, i) => val * (1 - intensity) + target[i] * intensity
  );
}

//ensureFilter creates or returns the existing SVG filter and feColorMatrix element
function ensureFilter(): SVGFEColorMatrixElement {
  if (matrixEl) return matrixEl;

  svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgEl.setAttribute("id", ID_SVG);
  svgEl.setAttribute("width", "0");
  svgEl.setAttribute("height", "0");
  svgEl.style.position = "fixed";
  svgEl.style.width = "0";
  svgEl.style.height = "0";
  svgEl.style.pointerEvents = "none";
  svgEl.style.zIndex = "-1";

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
  const t = Math.max(0, Math.min(1, intensity)); //clamp intensity to [0, 1]

  if (mode === "none" || t === 0) {
    document.documentElement.style.filter = "";
    return;
  }

  const target = matrices[mode] ?? identity;
  const mixed = mixMatrix(target, t);
  const matrixEl = ensureFilter();
  matrixEl.setAttribute("values", mixed.join(" "));
  document.documentElement.style.filter = `url(#${ID_FILTER})`;
}
