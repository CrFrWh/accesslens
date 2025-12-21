type CognitiveOptions = {
  letterSpacingPx: number;
  lineHeight: number;
  jitter: boolean;
  density: boolean;
};

let styleEl: HTMLStyleElement | null = null;

function ensureStyle() {
  if (styleEl) return styleEl;

  styleEl = document.createElement("style");
  styleEl.id = "accesslens-cognitive-style";
  document.head.appendChild(styleEl);
  return styleEl;
}

export function applyCognitiveStyles(options: CognitiveOptions) {
  ensureStyle();
  const root = document.documentElement;
  root.style.setProperty(
    "--accesslens-letter-spacing",
    `${options.letterSpacingPx}px`
  );
  root.style.setProperty("--accesslens-line-height", `${options.lineHeight}`);
  root.style.setProperty("data-accesslens-jitter", String(options.jitter));
  root.style.setProperty("data-accesslens-density", String(options.density));

  styleEl!.textContent = `
    :root {
      --accesslens-letter-spacing: ${options.letterSpacingPx}px;
      --accesslens-line-height: ${options.lineHeight};
    }
    * {
      letter-spacing: var(--accesslens-letter-spacing) !important;
      line-height: var(--accesslens-line-height) !important;
    }
    [data-accesslens-jitter="true"] * {
      animation: accesslens-jitter 0.4s infinite alternate ease-in-out;
    }
    @keyframes accesslens-jitter {
      from { transform: translateX(-0.5px); }
      to   { transform: translateX(0.5px); }
    }
    [data-accesslens-density="true"] a,
    [data-accesslens-density="true"] button,
    [data-accesslens-density="true"] [role="button"],
    [data-accesslens-density="true"] p,
    [data-accesslens-density="true"] li {
      background: rgba(255, 255, 0, 0.08);
      outline: 1px solid rgba(255, 204, 0, 0.35);
    }
  `;
}
