let blurOverlay: HTMLDivElement | null = null;

/**
 * Create or return the blur overlay element
 * @param blurPx - The amount of blur in pixels
 * @return The blur overlay element
 */

export function ensureBlurOverlay(): HTMLDivElement {
  if (blurOverlay) return blurOverlay;

  console.log("Creating blur overlay");

  blurOverlay = document.createElement("div");
  blurOverlay.id = "accesslens-blur-overlay";
  blurOverlay.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2147483646;
    backdrop-filter: blur(0px);
    visibility: hidden;
  `;

  document.body.appendChild(blurOverlay);
  return blurOverlay;
}

/**
 * Set the blur amount in px
 * When px is 0, remove the overlay
 */

export function setBlurAmount(blurPx: number): void {
  const overlay = ensureBlurOverlay();

  overlay.style.backdropFilter = blurPx > 0 ? `blur(${blurPx}px)` : "none";
  overlay.style.visibility = blurPx > 0 ? "visible" : "hidden";
}
