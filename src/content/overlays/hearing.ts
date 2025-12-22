const videoBanners = new Map<HTMLVideoElement, HTMLDivElement>();

//hasValidCaptions checks if a video element has valid captions or subtitles
function hasValidCaptions(video: HTMLVideoElement): boolean {
  const tracks = video.querySelectorAll(
    'track[kind="captions"], track[kind="subtitles"]'
  );
  return tracks.length > 0;
}

//createCaptionBanner creates a caption reminder banner element
export function createCaptionBanner(): HTMLDivElement {
  const banner = document.createElement("div");
  banner.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 152, 0, 0.95);
    color: #000;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    padding: 8px 12px;
    border-bottom: 2px solid rgba(230, 120, 0, 1);
    z-index: 2147483647;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  `;
  banner.innerHTML = "⚠ Video detected; captions recommended.";
  banner.setAttribute("aria-hidden", "true");
  return banner;
}

//addBannerToVideo adds a caption reminder banner to the given video element
function addBannerToVideo(video: HTMLVideoElement): void {
  if (videoBanners.has(video)) return;

  const videoParent = video.parentElement;
  if (!videoParent) return;
  const computedStyle = getComputedStyle(videoParent);
  if (computedStyle.position === "static") {
    videoParent.style.position = "relative";
  }
  const banner = createCaptionBanner();
  videoBanners.set(video, banner);

  if (videoParent) {
    videoParent.insertBefore(banner, video);
  } else {
    video.parentNode?.insertBefore(banner, video);
  }
}

//removeBannerFromVideo removes the caption reminder banner from the given video element
function removeBannerFromVideo(video: HTMLVideoElement): void {
  const banner = videoBanners.get(video);
  if (banner && banner.parentNode) {
    banner.parentNode.removeChild(banner);
    videoBanners.delete(video);
  }
}

//updateVideoBanners updates the caption reminder banners based on the enabled state
function updateVideoBanners(enabled: boolean): void {
  if (!enabled) {
    // Remove all banners
    videoBanners.forEach((banner, video) => {
      removeBannerFromVideo(video);
    });
    return;
  }

  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    if (!hasValidCaptions(video)) {
      addBannerToVideo(video);
    }
  });
}

let observer: MutationObserver | null = null;

//startObservingVideos starts the mutation observer for videos
function startObservingVideos(): void {
  if (observer) return;

  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLVideoElement && !hasValidCaptions(node)) {
          addBannerToVideo(node);
        } else if (node instanceof HTMLElement) {
          const videos = node.querySelectorAll("video");
          videos.forEach((video) => {
            if (!hasValidCaptions(video as HTMLVideoElement)) {
              addBannerToVideo(video as HTMLVideoElement);
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

//stopObservingVideos stops the mutation observer for videos
function stopObservingVideos(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

//setCaptionReminder enables or disables the caption reminder banners
export function setCaptionReminder(enabled: boolean): void {
  updateVideoBanners(enabled);

  if (enabled) {
    startObservingVideos();
  } else {
    stopObservingVideos();
  }
}

//setPageMute mutes or unmutes all audio and video elements on the page
export function setPageMute(muted: boolean): void {
  const mediaElements = document.querySelectorAll("audio, video");
  mediaElements.forEach((el) => {
    (el as HTMLMediaElement).muted = muted;
  });
}
