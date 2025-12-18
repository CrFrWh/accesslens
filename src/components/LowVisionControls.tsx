import styles from "./LowVisionControls.module.css";

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
            step={0.1}
            value={props.blurValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onBlurChange(Number(e.target.value))
            }
          />
          <output>
            {props.blurValue.toFixed(1)}px {getLabel(props.blurValue)}
          </output>
        </div>
      </div>
    </section>
  );
}
