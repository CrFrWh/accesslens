/*
Letter spacing slider: 0–10px (show before/after text sample)
Line height slider: 1.0–2.0 (show before/after in preview)
Optional word jitter toggle: Mild visual jitter (visual only, non-functional)
Info density highlighter toggle: Highlight CTAs and text-dense regions with a subtle background
Layout: Stack sliders vertically; show live preview of spacing changes
*/
import styles from "./CognitiveControls.module.css";

export default function CognitiveControls(props: {
  letterSpacingPx: number;
  lineHeight: number;
  jitterEnabled: boolean;
  densityEnabled: boolean;
  onLetterSpacingChange: (value: number) => void;
  onLineHeightChange: (value: number) => void;
  onJitterChange: (enabled: boolean) => void;
  onDensityChange: (enabled: boolean) => void;
}) {
  return (
    <section className={styles.cognitiveContainer}>
      <h2 className={styles.title}>Cognitive Controls</h2>
      <p className={styles.description}>
        Controls for letter spacing, line height, jitter, and density.
      </p>

      <label className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>
          Letter Spacing: {props.letterSpacingPx.toFixed(1)}px
        </span>
        <input
          type="range"
          className={styles.slider}
          min={0}
          max={15}
          step={0.1}
          value={props.letterSpacingPx}
          onChange={(e) => props.onLetterSpacingChange(Number(e.target.value))}
        />
      </label>
      <label className={styles.sliderContainer}>
        <span className={styles.sliderLabel}>
          Line Height: {props.lineHeight.toFixed(1)}px
        </span>
        <input
          type="range"
          className={styles.slider}
          min={0}
          max={15}
          step={0.1}
          value={props.lineHeight}
          onChange={(e) => props.onLineHeightChange(Number(e.target.value))}
        />
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={props.jitterEnabled}
          onChange={(e) => props.onJitterChange(e.target.checked)}
        />
        Enable Word Jitter
      </label>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={props.densityEnabled}
          onChange={(e) => props.onDensityChange(e.target.checked)}
        />
        Enable Density
      </label>
    </section>
  );
}
