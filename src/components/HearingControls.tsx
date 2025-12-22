/*
Page mute toggle: "Mute page audio: Off/On"
Captions reminder checkbox: "☐ Highlight videos without captions"
When enabled, overlays a banner on detected <video> elements: "⚠ Video detected; captions recommended."
*/
interface HearingControlsProps {
  isMuted: boolean;
  showCaptionsReminder: boolean;
  onMutedChange: (muted: boolean) => void;
  onCaptionsReminderChange: (enabled: boolean) => void;
}

export default function HearingControls({
  isMuted,
  showCaptionsReminder,
  onMutedChange,
  onCaptionsReminderChange,
}: HearingControlsProps) {
  return (
    <section>
      <label>
        <input
          type="checkbox"
          checked={isMuted}
          onChange={(e) => onMutedChange(e.target.checked)}
        />
        Mute page audio: {isMuted ? "On" : "Off"}
      </label>
      <label>
        <input
          type="checkbox"
          checked={showCaptionsReminder}
          onChange={(e) => onCaptionsReminderChange(e.target.checked)}
        />
        ☐ Highlight videos without captions
      </label>
      {showCaptionsReminder && (
        <p style={{ fontSize: "0.9em", color: "#666" }}>
          Orange banners will appear on videos without captions
        </p>
      )}
    </section>
  );
}
