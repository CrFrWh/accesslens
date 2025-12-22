import styles from "./shared.module.css";

export default function LowVisionControls(props: {
  blurValue: number;
  onBlurChange: (value: number) => void;
}) {
  const getLabel = (value: number) => {
    if (value === 0) return "Off";
    if (value > 0 && value <= 2) return "Low";
    if (value > 2 && value <= 5) return "Medium";
    return "High";
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Low Vision Controls</h2>

      <div className={styles.field}>
        <label htmlFor="blur-intensity" className={styles.fieldLabel}>
          Blur Intensity
        </label>
        <div className={styles.sliderWrapper}>
          <input
            id="blur-intensity"
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={props.blurValue}
            className={styles.slider}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onBlurChange(Number(e.target.value))
            }
          />
          <output className={styles.sliderValue}>
            {props.blurValue.toFixed(1)}px {getLabel(props.blurValue)}
          </output>
        </div>
      </div>
    </section>
  );
}
