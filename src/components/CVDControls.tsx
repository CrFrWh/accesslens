/*
Color Vision Deficiency (CVD) Controls
Radio buttons or segmented control (mutually exclusive):
None / Protanopia (red-blind) / Deuteranopia (green-blind) / Tritanopia (blue-blind) / Monochromacy (grayscale)
Intensity slider (0–100%) if you want partial saturation/mixing
*/
import styles from "./shared.module.css";

type CvdMode =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "monochromacy";

export default function CVDControls(props: {
  mode: CvdMode;
  intensity: number;
  onModeChange: (mode: CvdMode) => void;
  onIntensityChange: (intensity: number) => void;
}) {
  const options: { label: string; value: CvdMode }[] = [
    { label: "None", value: "none" },
    { label: "Protanopia", value: "protanopia" },
    { label: "Deuteranopia", value: "deuteranopia" },
    { label: "Tritanopia", value: "tritanopia" },
    { label: "Monochromacy", value: "monochromacy" },
  ];
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        Color Vision Deficiency (CVD) Controls
      </h2>

      <div className={styles.radioGroup}>
        {options.map((option) => (
          <label key={option.value} className={styles.radioLabel}>
            <input
              type="radio"
              name="cvd-mode"
              value={option.value}
              checked={props.mode === option.value}
              onChange={() => props.onModeChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor="cvd-intensity" className={styles.fieldLabel}>
          Intensity: {props.intensity.toFixed(0)}%
        </label>
        <input
          id="cvd-intensity"
          type="range"
          className={styles.slider}
          min={0}
          max={100}
          step={1}
          value={props.intensity}
          onChange={(e) => props.onIntensityChange(Number(e.target.value))}
        />
      </div>
    </section>
  );
}
