import Logo from "@/assets/crx.svg";
import { useEffect, useState } from "react";
import { setBlurOverlay } from "../overlays/blur";
import "./App.css";

function App() {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  useEffect(() => {
    setBlurOverlay(show, 2);
    return () => setBlurOverlay(false, 0);
  }, [show]);

  return (
    <div className="popup-container">
      {show && (
        <div className={`popup-content ${show ? "opacity-100" : "opacity-0"}`}>
          <h1>HELLO CRXJS</h1>
        </div>
      )}
      <button className="toggle-button" onClick={toggle}>
        <img src={Logo} alt="CRXJS logo" className="button-icon" />
      </button>
    </div>
  );
}

export default App;
