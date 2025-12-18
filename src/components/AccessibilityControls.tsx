import { useEffect, useState } from "react";
import LowVisionControls from "./LowVisionControls";

export default function AccessibilityControls() {
  const [blurPx, setBlurPx] = useState(0);

  useEffect(() => {
    if (!chrome?.tabs) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;

      if (typeof tabId !== "number") return;

      chrome.tabs.sendMessage(
        tabId,
        //Send a blur message containing the blurPx value
        { type: "ACCESSLENS_SET_BLUR", payload: { blurPx } },
        () => {
          //If errors occur, log them
          if (chrome.runtime.lastError) {
            console.warn(
              "Failed to send blur message:",
              chrome.runtime.lastError.message
            );
          } else {
            //Blur message sent successfully
          }
        }
      );
    });
  }, [blurPx]);

  return (
    <div>
      <h1>Accessibility Controls</h1>
      <LowVisionControls blurValue={blurPx} onBlurChange={setBlurPx} />
    </div>
  );
}
