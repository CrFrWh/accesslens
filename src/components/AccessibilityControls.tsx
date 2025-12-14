import { useState } from "react";

export default function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(50);
  return (
    <div>
      <h1>Accessibility Controls</h1>
      <section>
        <h2>Vision</h2>
        <div>
          <h3>Enable High Contrast Mode</h3>
          <button>Toggle High Contrast</button>
        </div>
        <div>
          <h3>Font Size Scale</h3>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              marginBottom: "8px",
            }}
            htmlFor="fontRange"
          >
            <input
              type="range"
              min="1"
              max="5"
              step={0.1}
              value={fontSize}
              className="slider"
              id="fontRange"
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
            />
            Font Size: {fontSize} x base scale
          </label>
        </div>
      </section>

      <section>
        <h3>Enable Screen Reader Support</h3>
        <button>Activate Screen Reader</button>
        <button>Deactivate Screen Reader</button>
      </section>
      <section>
        <h3>Enable Text-to-Speech</h3>
        <button>Start Text-to-Speech</button>
        <button>Stop Text-to-Speech</button>
      </section>
      <section>
        <h3>Adjust Color Schemes</h3>
        <button>Switch to Dark Mode</button>
        <button>Switch to Light Mode</button>
      </section>
      <section>
        <h3>Keyboard Navigation Shortcuts</h3>
        <p>Use arrow keys to navigate through elements.</p>
      </section>
    </div>
  );
}
