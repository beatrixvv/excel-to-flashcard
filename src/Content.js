import React from "react";

export default function Content({
  commonHeaders,
  frontHeader,
  backHeader,
  handleFrontHeader,
  handleBackHeader,
}) {
  return (
    <div className="content">
      <p
        style={{
          paddingBottom: "1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Only common headers are shown!
      </p>
      <div className="settings-box">
        <h2>Front</h2>
        <div className="checkbox-container">
          {commonHeaders.map((header, index) => (
            <div className="checkbox-label">
              <input
                type="checkbox"
                id={`front-${index}`}
                checked={frontHeader.has(header)}
                onChange={() => handleFrontHeader(header)}
              />
              <label htmlFor={`front-${index}`}>{header}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="settings-box">
        <h2>Back</h2>
        <div className="checkbox-container">
          {commonHeaders.map((header, index) => (
            <div className="checkbox-label">
              <input
                type="checkbox"
                id={`back-${index}`}
                checked={backHeader.has(header)}
                onChange={() => handleBackHeader(header)}
              />
              <label htmlFor={`back-${index}`}>{header}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
