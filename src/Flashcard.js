import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";

export default function Flashcard({
  content,
  index,
  frontHeader,
  backHeader,
  progressDict,
  progressHeader,
}) {
  const [frontSide, setFrontSide] = useState(true);
  const data = content[index] ?? {};
  const header = frontSide ? frontHeader : backHeader;

  function handleClick() {
    setFrontSide((prev) => !prev);
  }

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

  return (
    <div
      onClick={handleClick}
      className={`flashcard ${frontSide ? "" : "back"}`}
      style={{
        backgroundColor: progressDict[data[progressHeader]] || "transparent",
      }}
    >
      <button
        className={`read-button ${frontSide ? "" : "back"}`}
        onClick={readFlashcard}
      >
        <FontAwesomeIcon icon={faVolumeUp} />
      </button>
      <div>
        {Object.entries(data)
          .filter(([key]) => header.has(key) && key !== progressHeader)
          .map(([key, value]) => (
            <p key={key}>{value}</p>
          ))}
      </div>
      <h3 className={"index-tracker"}>
        {index} / {content.length}
      </h3>
    </div>
  );
}
