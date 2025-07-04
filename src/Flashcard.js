import React, { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

export default function Flashcard({
  content,
  index,
  frontHeader,
  backHeader,
  progressDict,
  progressHeader,
}) {
  const [frontSide, setFrontSide] = useState(true);
  const elementRef = useRef(null);
  const data = content[index] ?? {};
  const header = frontSide ? frontHeader : backHeader;

  function readFlashcard(event) {
    // Prevent the card from flipping
    event.stopPropagation();

    const values = Object.entries(data)
      .filter(([key]) => header.has(key))
      .map(([_, value]) => value)
      .join(", ");

    const utterance = new SpeechSynthesisUtterance(values);
    // Add chinese support
    const isChinese = /[\u4e00-\u9fa5]/.test(values);
    utterance.lang = isChinese ? "zh-CN" : "en-US";
    window.speechSynthesis.speak(utterance);
  }

  function handleFullscreen(event) {
    // Prevent the card from flipping
    event.stopPropagation();

    if (elementRef.current) {
      elementRef.current.requestFullscreen();
    }
  }

  const handleClick = useCallback(() => {
    setFrontSide((prev) => !prev);
  }, []);

  // Handle keyboard events to flip flashcard
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        handleClick();
      } else if (event.key === "f") {
        handleFullscreen(event);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClick]);

  return (
    <div
      ref={elementRef}
      onClick={handleClick}
      className={`flashcard ${frontSide ? "" : "back"}`}
      style={{
        backgroundColor: progressDict[data[progressHeader]] || "transparent",
      }}
    >
      <button
        className={`flashcard-button fullscreen ${
          content.length ? "" : "disable"
        }`}
        onClick={handleFullscreen}
      >
        <FontAwesomeIcon icon={faExpand} />
      </button>
      <button
        className={`flashcard-button read ${content.length ? "" : "disable"}`}
        onClick={readFlashcard}
      >
        <FontAwesomeIcon icon={faVolumeUp} />
      </button>
      <div>
        {Object.entries(data)
          .filter(([key]) => header.has(key) && key !== progressHeader)
          .map(([key, value]) => (
            <p key={key} style={{ whiteSpace: "pre-wrap" }}>
              {value}
            </p>
          ))}
      </div>
      <h3 className={"index-tracker"}>
        {content.length ? index + 1 : 0} / {content.length}
      </h3>
    </div>
  );
}
