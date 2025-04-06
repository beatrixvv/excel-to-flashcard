import React from "react";

export default function Sheets({
  sheetNames,
  selectedSheets,
  handleSheetSelection,
}) {
  return (
    <div className="settings-box">
      <h2>Sheets</h2>
      <div className="checkbox-container">
        {sheetNames.map((sheet, index) => (
          <div className="checkbox-label">
            <input
              type="checkbox"
              id={`sheet-${index}`}
              checked={selectedSheets.has(sheet)}
              onChange={() => handleSheetSelection(sheet)}
            />
            <label htmlFor={`sheet-${index}`}>{sheet}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
