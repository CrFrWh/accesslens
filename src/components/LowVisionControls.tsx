/*
Blur: Horizontal slider (0–20px) with labels: "Off / Mild / Moderate / Severe"
Contrast: Slider (0–200%) with visual preview (show text sample darkening in real-time)
Text Scale: Existing range slider is good; extend to 0.5–3x base
*/
import styles from "./LowVisionControls.module.css";

export default function LowVisionControls(props: {
  blurValue: number;
  onBlurChange: (value: number) => void;
}) {
  return (
    <section className={`${styles.lowVisionContainer}`}>
      <h2 className={`${styles.title}`}>Low Vision Controls</h2>

      <div className={styles.field}>
        <label htmlFor="intensity">Blur Intensity</label>
        <div className={styles.rangeGroup}>
          <input
            id="intensity"
            type="range"
            min={0}
            max={10}
            step={0.2}
            value={props.blurValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onBlurChange(Number(e.target.value))
            }
          />
          <output>{props.blurValue}px</output>
        </div>
      </div>
    </section>
  );
}
