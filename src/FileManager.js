import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faSave } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";

export default function FileManager({
  handleUpload,
  handleSave,
  emptyWorkbook,
}) {
  const fileInputRef = useRef(null);

  function handleClick() {
    fileInputRef.current.click();
  }

  return (
    <div className="file-manager">
      {/* Upload */}
      <button
        data-tooltip-id={"Upload"}
        data-tooltip-content={"Upload"}
        onClick={handleClick}
        className="circle-button"
        id="upload-button"
      >
        <FontAwesomeIcon icon={faUpload} />
      </button>
      <Tooltip id={"Upload"} className="tooltip" />
      <input
        type="file"
        accept=".xls,.xlsx"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />

      {/* Save */}
      <button
        data-tooltip-id={"Save"}
        data-tooltip-content={"Save"}
        onClick={handleSave}
        className={`circle-button ${emptyWorkbook ? "disable" : ""}`}
        id="save-button"
      >
        <FontAwesomeIcon icon={faSave} />
      </button>
      <Tooltip id={"Save"} className="tooltip" />
    </div>
  );
}
