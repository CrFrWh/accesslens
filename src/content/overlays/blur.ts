const HTML = document.documentElement;

function rememberOriginalFilter() {
  if (!HTML.dataset.accesslensOriginalFilter) {
    HTML.dataset.accesslensOriginalFilter = HTML.style.filter || "";
  }
}

function restoreOriginalFilter() {
  if ("accesslensOriginalFilter" in HTML.dataset) {
    HTML.style.filter = HTML.dataset.accesslensOriginalFilter || "";
    delete HTML.dataset.accesslensOriginalFilter;
  } else {
    HTML.style.filter = "";
  }
}

export function setBlurOverlay(enabled: boolean, intensityPx = 2) {
  if (enabled && intensityPx > 0) {
    rememberOriginalFilter();
    HTML.style.filter = `blur(${intensityPx}px)`;
  } else {
    restoreOriginalFilter();
  }
}
