import { useEffect, useState } from "react";
import LowVisionControls from "./LowVisionControls";
import BlindnessControls from "./BlindnessControls";
import CVDControls from "./CVDControls";
import CognitiveControls from "./CognitiveControls";
import styles from "./AccessibilityControls.module.css";

type CvdMode =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "monochromacy";

export default function AccessibilityControls() {
  const [blurPx, setBlurPx] = useState(0);
  const [blindnessEnabled, setBlindnessEnabled] = useState(false);
  const [blindnessHint, setBlindnessHint] = useState(true);
  const [cvdMode, setCvdMode] = useState<CvdMode>("none");
  const [cvdIntensity, setCvdIntensity] = useState(100);
  const [letterSpacingPx, setLetterSpacingPx] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [jitterEnabled, setJitterEnabled] = useState(false);
  const [densityEnabled, setDensityEnabled] = useState(false);

  // Load initial settings from storage
  useEffect(() => {
    if (!chrome?.storage?.onChanged) return;

    chrome.storage.sync
      .get([
        "blurPx",
        "blindnessEnabled",
        "blindnessHint",
        "cvdMode",
        "cvdIntensity",
        "letterSpacingPx",
        "lineHeight",
        "jitterEnabled",
        "densityEnabled",
      ])
      .then((result) => {
        if (typeof result.blurPx === "number") setBlurPx(result.blurPx);
        if (typeof result.blindnessEnabled === "boolean")
          setBlindnessEnabled(result.blindnessEnabled);
        if (typeof result.blindnessHint === "boolean")
          setBlindnessHint(result.blindnessHint);
        if (typeof result.cvdMode === "string")
          setCvdMode(result.cvdMode as CvdMode);
        if (typeof result.cvdIntensity === "number")
          setCvdIntensity(result.cvdIntensity);
        if (typeof result.letterSpacingPx === "number")
          setLetterSpacingPx(result.letterSpacingPx);
        if (typeof result.lineHeight === "number")
          setLineHeight(result.lineHeight);
        if (typeof result.jitterEnabled === "boolean")
          setJitterEnabled(result.jitterEnabled);
        if (typeof result.densityEnabled === "boolean")
          setDensityEnabled(result.densityEnabled);
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
      if (changes.cvdMode) {
        const v = changes.cvdMode.newValue;
        if (typeof v === "string") setCvdMode(v as CvdMode);
      }
      if (changes.cvdIntensity) {
        const v = changes.cvdIntensity.newValue;
        if (typeof v === "number") setCvdIntensity(v);
      }
      if (changes.letterSpacingPx) {
        const v = changes.letterSpacingPx.newValue;
        if (typeof v === "number") setLetterSpacingPx(v);
      }
      if (changes.lineHeight) {
        const v = changes.lineHeight.newValue;
        if (typeof v === "number") setLineHeight(v);
      }
      if (changes.jitterEnabled) {
        setJitterEnabled(!!changes.jitterEnabled.newValue);
      }
      if (changes.densityEnabled) {
        setDensityEnabled(!!changes.densityEnabled.newValue);
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
    if (chrome?.storage?.sync)
      chrome.storage.sync
        .set({ blindnessEnabled, blindnessHint })
        .catch?.(() => {});
    sendToActiveTab({
      type: "ACCESSLENS_SET_BLINDNESS",
      payload: {
        enabled: blindnessEnabled,
        showHintBanner: blindnessHint,
        hintText: "You are in blindness simulation mode.",
      },
    });
  }, [blindnessEnabled, blindnessHint]);

  // CVD
  useEffect(() => {
    if (chrome?.storage?.sync)
      chrome.storage.sync
        .set({
          cvdMode,
          cvdIntensity,
        })
        .catch?.(() => {});
    sendToActiveTab({
      type: "ACCESSLENS_SET_CVD",
      payload: { mode: cvdMode, intensity: cvdIntensity },
    });
  }, [cvdMode, cvdIntensity]);

  // Cognitive
  useEffect(() => {
    if (chrome?.storage?.sync)
      chrome.storage.sync
        .set({
          letterSpacingPx,
          lineHeight,
          jitterEnabled,
          densityEnabled,
        })
        .catch?.(() => {});
    sendToActiveTab({
      type: "ACCESSLENS_SET_COGNITIVE",
      payload: {
        letterSpacingPx,
        lineHeight,
        jitterEnabled,
        densityEnabled,
      },
    });
  }, [letterSpacingPx, lineHeight, jitterEnabled, densityEnabled]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Accessibility Controls</h1>
      <LowVisionControls blurValue={blurPx} onBlurChange={setBlurPx} />

      <CVDControls
        mode={cvdMode}
        intensity={cvdIntensity}
        onModeChange={setCvdMode}
        onIntensityChange={setCvdIntensity}
      />

      <BlindnessControls
        enabled={blindnessEnabled}
        showHint={blindnessHint}
        onEnabledChange={setBlindnessEnabled}
        onShowHintChange={setBlindnessHint}
      />

      <CognitiveControls
        letterSpacingPx={letterSpacingPx}
        lineHeight={lineHeight}
        jitterEnabled={jitterEnabled}
        densityEnabled={densityEnabled}
        onLetterSpacingChange={setLetterSpacingPx}
        onLineHeightChange={setLineHeight}
        onJitterChange={setJitterEnabled}
        onDensityChange={setDensityEnabled}
      />
    </div>
  );
}
