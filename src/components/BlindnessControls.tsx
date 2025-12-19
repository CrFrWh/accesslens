/*
Toggle button ("Simulate Blindness: Off/On")
Optional banner below: Contextual checkbox: "Show screen reader hint banner"
When enabled, displays: "This mode simulates blindness. Use NVDA, JAWS, or your preferred screen reader for the best experience."
High contrast: Make the toggle very prominent (this is a heavy mode)
*/
export default function BlindnessControls(props: {
  enabled: boolean;
  showHint: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onShowHintChange: (show: boolean) => void;
}) {
  return (
    <section>
      <h2>Blindness Controls</h2>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={props.enabled}
          onChange={(e) => props.onEnabledChange(e.target.checked)}
        />
        Simulate Blindness: {props.enabled ? "On" : "Off"}
      </label>
      <label
        style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}
      >
        <input
          type="checkbox"
          checked={props.showHint}
          onChange={(e) => props.onShowHintChange(e.target.checked)}
        />
        Show screen reader hint banner
      </label>
    </section>
  );
}
