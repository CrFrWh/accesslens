import { useEffect, useState } from "react";
import LowVisionControls from "./LowVisionControls";
import BlindnessControls from "./BlindnessControls";

export default function AccessibilityControls() {
  const [blurPx, setBlurPx] = useState(0);
  const [blindnessEnabled, setBlindnessEnabled] = useState(false);
  const [blindnessHint, setBlindnessHint] = useState(true);

  // Load initial settings from storage
  useEffect(() => {
    if (!chrome?.storage?.onChanged) return;

    chrome.storage.sync
      .get(["blurPx", "blindnessEnabled", "blindnessHint"])
      .then((result) => {
        if (typeof result.blurPx === "number") setBlurPx(result.blurPx);
        if (typeof result.blindnessEnabled === "boolean")
          setBlindnessEnabled(result.blindnessEnabled);
        if (typeof result.blindnessHint === "boolean")
          setBlindnessHint(result.blindnessHint);
      });
  }, []);

  // Listen for storage changes
  // (to sync state if changed from elsewhere)
  useEffect(() => {
    if (!chrome?.storage?.onChanged) return;
    const onChanged: Parameters<
      typeof chrome.storage.onChanged.addListener
    >[0] = (changes, areaName) => {
      if (areaName !== "sync") return;
      if (changes.blindnessEnabled) {
        setBlindnessEnabled(!!changes.blindnessEnabled.newValue);
      }
      if (changes.blurPx) {
        const v = changes.blurPx.newValue;
        setBlurPx(typeof v === "number" ? v : 0);
      }
    };
    chrome.storage.onChanged.addListener(onChanged);
    return () => {
      chrome.storage.onChanged.removeListener(onChanged);
    };
  }, []);

  // Helper to send messages to the active tab
  const sendToActiveTab = (message: any) => {
    if (!chrome?.tabs) return;
    // Get the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (typeof tabId !== "number") return;
      // Send message to the active tab
      chrome.tabs.sendMessage(tabId, message, () => {
        if (chrome.runtime.lastError) {
          console.warn(
            "Failed to send message:",
            chrome.runtime.lastError.message
          );
        }
      });
    });
  };

  useEffect(() => {
    sendToActiveTab({ type: "ACCESSLENS_SET_BLUR", payload: { blurPx } });
  }, [blurPx]);

  useEffect(() => {
    sendToActiveTab({
      type: "ACCESSLENS_SET_BLINDNESS",
      payload: {
        enabled: blindnessEnabled,
        showHintBanner: blindnessHint,
        hintText: "You are in blindness simulation mode.",
      },
    });
  }, [blindnessEnabled, blindnessHint]);

  return (
    <div>
      <h1>Accessibility Controls</h1>
      <LowVisionControls blurValue={blurPx} onBlurChange={setBlurPx} />

      <BlindnessControls
        enabled={blindnessEnabled}
        showHint={blindnessHint}
        onEnabledChange={setBlindnessEnabled}
        onShowHintChange={setBlindnessHint}
      />
    </div>
  );
}
