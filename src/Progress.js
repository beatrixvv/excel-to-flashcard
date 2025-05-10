import React from "react";

export default function Progress({
  progressDict,
  progressHeader,
  handleProgressChange,
  emptyWorkbook,
}) {
  return (
    <div className="progress">
      <p
        style={{
          paddingTop: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Keeping track of progress with the '{progressHeader}' column!
      </p>
      <div className="progress-buttons">
        {Object.entries(progressDict).map(([progress, color]) => (
          <button
            key={progress}
            value={progress}
            className={`rectangle-button ${emptyWorkbook ? "disable" : ""}`}
            style={{ backgroundColor: color }}
            onClick={handleProgressChange}
          >
            {progress}
          </button>
        ))}
      </div>
    </div>
  );
}
