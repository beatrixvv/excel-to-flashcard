import { React } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Sort({
  selectedHeaders,
  sortDict,
  sortIndex,
  handleSort,
}) {
  return (
    <div id="sort" className="settings-box">
      <h2>Sort</h2>
      <div className="checkbox-container">
        {[...selectedHeaders].map((header) => (
          <div className="sort-row">
            <button
              className="rectangle-button"
              value={header}
              onClick={handleSort}
            >
              <FontAwesomeIcon
                icon={
                  sortDict[
                    sortIndex.find((item) => item.header === header)?.order ?? 0
                  ].icon
                }
              />
            </button>
            <p style={{ fontSize: "1.2rem" }}>{header}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
