let curtainEl: HTMLDivElement | null = null;
let bannerEl: HTMLDivElement | null = null;
let srLiveRegion: HTMLDivElement | null = null;

//ensureSRLiveRegion creates or returns the existing screen reader live region
function ensureSRLiveRegion(): HTMLDivElement {
  if (srLiveRegion) return srLiveRegion;
  srLiveRegion = document.createElement("div");
  srLiveRegion.setAttribute("aria-live", "polite");
  srLiveRegion.setAttribute("role", "status");
  srLiveRegion.style.cssText = `
    position: fixed !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    border: 0 !important;
    white-space: nowrap !important;
    `;
  document.body.appendChild(srLiveRegion);
  return srLiveRegion;
}

//ensureBlindnessCurtain creates or returns the existing blindness curtain element
export function ensureBlindnessCurtain(): HTMLDivElement {
  if (curtainEl) return curtainEl;
  curtainEl = document.createElement("div");
  curtainEl.id = "accesslens-blindness-curtain";
  curtainEl.setAttribute("aria-hidden", "true");
  curtainEl.tabIndex = -1;

  curtainEl.style.cssText = `
        position: fixed;
        inset: 0;
        background-color: black;
        z-index: 2147483646;
        pointer-events: none;
        display:none;
    `;

  document.body.appendChild(curtainEl);
  return curtainEl;
}

//ensureBanner creates or returns the existing blindness banner element
function ensureBanner(): HTMLDivElement {
  if (bannerEl) return bannerEl;
  bannerEl = document.createElement("div");
  bannerEl.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: #111;
    color: #fff;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    padding: 12px 16px;
    border-bottom: 2px solid #444;
  `;
  bannerEl.innerText =
    "This mode simulates blindness. Enable your screen reader (Windows Narrator: Win+Ctrl+Enter • macOS VoiceOver: Cmd+F5 • ChromeOS: Ctrl+Alt+Z).";
  return bannerEl;
}

export function setBlindnessMode(
  enabled: boolean,
  opts?: { showHintBanner?: boolean; hintText?: string }
): void {
  const curtain = ensureBlindnessCurtain();
  ensureSRLiveRegion();

  // Disable blindness mode
  if (!enabled) {
    //Hide curtain if not enabled
    curtain.style.display = "none";
    if (bannerEl?.parentNode) bannerEl.parentNode.removeChild(bannerEl);
    return;
  }

  curtain.style.display = "block";

  //Visible hint banner
  if (opts?.showHintBanner) {
    const banner = ensureBanner();
    if (opts.hintText) banner.innerText = opts.hintText;
    if (!banner.parentNode) curtain.appendChild(banner);
  } else if (bannerEl?.parentNode) {
    bannerEl.parentNode.removeChild(bannerEl);
  }

  //Announce guidance to SR users
  const live = ensureSRLiveRegion();
  live.textContent =
    opts?.hintText ??
    "Blindness simulation mode activated. Use your screen reader for the best experience.";
}
