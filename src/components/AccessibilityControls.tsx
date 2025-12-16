import { useState } from "react";
import LowVisionControls from "./LowVisionControls";

export default function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(50);
  return (
    <div>
      <h1>Accessibility Controls</h1>
      <LowVisionControls />
    </div>
  );
}
