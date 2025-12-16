/*
Blur: Horizontal slider (0–20px) with labels: "Off / Mild / Moderate / Severe"
Contrast: Slider (0–200%) with visual preview (show text sample darkening in real-time)
Text Scale: Existing range slider is good; extend to 0.5–3x base
*/
import styles from "./LowVisionControls.module.css";

export default function LowVisionControls() {
  return (
    <section className={`${styles.lowVisionContainer}`}>
      <h2 className={`${styles.title}`}>Low Vision Controls</h2>

      <div className={`${styles.field}`}>
        <label htmlFor="blur">Enable Blur</label>
        <input id="blur" type="checkbox" />
      </div>

      <div className={styles.field}>
        <label htmlFor="intensity">Blur Intensity</label>
        <div className={styles.rangeGroup}>
          <input id="intensity" type="range" min={0} max={10} step={0.5} />
          <output>5px</output>
        </div>
      </div>
    </section>
  );
}
