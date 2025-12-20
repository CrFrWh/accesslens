/*
Color Vision Deficiency (CVD) Controls
Radio buttons or segmented control (mutually exclusive):
None / Protanopia (red-blind) / Deuteranopia (green-blind) / Tritanopia (blue-blind) / Monochromacy (grayscale)
Intensity slider (0–100%) if you want partial saturation/mixing
*/

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
    <section>
      <h2>Color Vision Deficiency (CVD) Controls</h2>

      <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          {options.map((option) => (
            <label
              key={option.value}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
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

        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span>Intensity: {props.intensity.toFixed(0)}%</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={props.intensity}
            onChange={(e) => props.onIntensityChange(Number(e.target.value))}
          />
        </label>
      </div>
    </section>
  );
}
