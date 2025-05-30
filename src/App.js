import { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import arrayShuffle from "array-shuffle";

import "./App.css";
import AppTour from "./AppTour";
import FileManager from "./FileManager";
import Sheets from "./Sheets";
import Sort from "./Sort";
import Flashcard from "./Flashcard";
import Content from "./Content";
import Progress from "./Progress";

const PROGRESS = {
  "almost unknown": "#5a5f9f",
  "barely understood": "#4a7c79",
  "clearly recognized": "#a05a3e",
  "deeply grasped": "#6b8e62",
  "expertly applied": "#a8925a",
};
const SORT = [
  { name: "default", icon: faSort },
  { name: "increasing", icon: faSortUp },
  { name: "decreasing", icon: faSortDown },
];
const PROGRESS_HEADER = "Status";
const DEFAULT_STATUS = "almost unknown";

function App() {
  const [sheets, setSheets] = useState([]);
  const [workbook, setWorkbook] = useState(null);
  const [updatedWorkbook, setUpdatedWorkbook] = useState(null);
  const [selectedSheets, setSelectedSheets] = useState(new Set());
  const [frontHeader, setFrontHeader] = useState(new Set());
  const [backHeader, setBackHeader] = useState(new Set());
  const [flashcards, setFlashcards] = useState([]);
  const [index, setIndex] = useState(0);
  const [sort, setSort] = useState(false);
  const [sortIndex, setSortIndex] = useState([]);
  const [random, setRandom] = useState(false);
  const [orderIndices, setOrderIndices] = useState([]);

  function handleUpload(event) {
    const file = event.target.files[0];
    let status = "success";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: "array" });

      // Capitalize headers
      wb.SheetNames.forEach((sheetName) => {
        const sheet = wb.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Skip empty sheets
        if (sheetData.length === 0) return;

        // Capitalize
        let headers = sheetData[0].map((header) =>
          header
            ? header.charAt(0).toUpperCase() + header.slice(1).toLowerCase()
            : header
        );

        let statusIndex = headers.indexOf(PROGRESS_HEADER);
        // Add PROGRESS_HEADER column if it doesn't exist
        if (statusIndex === -1) {
          headers.push(PROGRESS_HEADER);
          statusIndex = headers.length - 1;
          status = "added";
        }

        // Update rows
        for (let i = 1; i < sheetData.length; i++) {
          let row = sheetData[i];

          // Ensure each row has correct number of columns
          if (row.length < headers.length) {
            row.length = headers.length;
          }

          // Keep row only if it has content in non-status columns
          const content = row.filter((_, idx) => idx !== statusIndex);
          const keepRow = content.some(
            (cell) => cell !== null && cell !== undefined && cell !== ""
          );
          if (keepRow) {
            let statusValue = row[statusIndex] || "";
            if (!(statusValue in PROGRESS)) {
              row[statusIndex] = DEFAULT_STATUS;
              if (status !== "added") status = "modified";
            }
          }
        }

        // Reconstruct the sheet
        sheetData[0] = headers;
        const newSheet = XLSX.utils.aoa_to_sheet(sheetData);
        wb.Sheets[sheetName] = newSheet;
      });

      setWorkbook(wb);
      setUpdatedWorkbook(wb);
      setSheets(wb.SheetNames);
      // First sheet selected by default
      setSelectedSheets(new Set([wb.SheetNames[0]]));

      // Trigger even if the same file is re-uploaded
      event.target.value = "";

      // Reset status
      setIndex(0);

      // Show messages based on the changes
      if (status === "added") {
        toast.success(`${PROGRESS_HEADER} column added!`);
      } else if (status === "modified") {
        toast.success(
          `${PROGRESS_HEADER} values updated to '${DEFAULT_STATUS}' where needed!`
        );
      } else {
        toast.success("File uploaded successfully!");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleSave() {
    if (updatedWorkbook) {
      XLSX.writeFile(updatedWorkbook, "flashcard.xlsx");
    }
  }

  function handleSheetSelection(sheet) {
    setSelectedSheets((prev) => {
      const newSet = new Set(prev);
      newSet.has(sheet) ? newSet.delete(sheet) : newSet.add(sheet);
      return new Set(newSet);
    });

    // Reset index
    setIndex(0);
    // Reset sort status
    resetSort();
    setSort(true);
    setRandom(false);
  }

  function handleSort(event) {
    const clickedHeader = event.currentTarget.value;

    const newSortIndex = sortIndex.filter(
      (item) => item.header !== clickedHeader
    );
    // Clicked header will have the lowest priority
    newSortIndex.unshift({
      header: clickedHeader,
      order:
        (sortIndex.find((item) => item.header === clickedHeader).order + 1) %
        SORT.length,
    });
    setSortIndex(newSortIndex);
    setSort(true);

    // Show the first flashcard
    setIndex(0);
    setRandom(false);
  }

  function randomFlashcard() {
    resetSort();
    setRandom(true);
    setSort(false);
    setIndex(0);
  }

  function resetOrder() {
    resetSort();
    setRandom(false);
    setSort(true);
    setIndex(0);
  }

  // Helper functions
  function toggleHeader(setter) {
    return (header) => {
      setter((prev) => {
        const newSet = new Set(prev);
        newSet.has(header) ? newSet.delete(header) : newSet.add(header);
        return newSet;
      });
    };
  }

  function resetSort() {
    const newSortIndex = [...sortIndex];
    newSortIndex.map((element) => (element.order = 0));
    setSortIndex(newSortIndex);
  }

  const commonHeaders = useMemo(() => {
    if (!workbook || selectedSheets.size === 0) return [];
    const selectedHeaders = [...selectedSheets].map(
      (sheet) =>
        XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 })[0] || []
    );

    // Filter the common headers and place the PROGRESS_HEADER at the end
    return selectedHeaders
      .reduce((common, currentHeader) =>
        common.filter((header) => currentHeader.includes(header))
      )
      .sort((a, b) =>
        a === PROGRESS_HEADER ? 1 : b === PROGRESS_HEADER ? -1 : 0
      );
  }, [workbook, selectedSheets]);

  const handleFrontHeader = toggleHeader(setFrontHeader);
  const handleBackHeader = toggleHeader(setBackHeader);

  const selectedHeaders = useMemo(() => {
    return new Set([...frontHeader, ...backHeader]);
  }, [frontHeader, backHeader]);

  const decreaseIndex = useCallback(() => {
    if (flashcards.length === 0) return;
    setIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, [flashcards.length]);

  const increaseIndex = useCallback(() => {
    if (flashcards.length === 0) return;
    setIndex((prevIndex) => Math.min(prevIndex + 1, flashcards.length - 1));
  }, [flashcards.length]);

  const handleProgressChange = useCallback(
    (event, newStatus = null) => {
      if (updatedWorkbook) {
        const status =
          newStatus === null ? event.currentTarget.value : newStatus;

        // Update the workbook
        const newWorkbook = { ...updatedWorkbook };
        const sheetName = flashcards[index].sheet;
        const worksheet = newWorkbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(worksheet);
        const rowIndex = jsonData.findIndex((row) =>
          [...selectedHeaders].every(
            (header) => row[header] === flashcards[index][header]
          )
        );
        if (rowIndex !== -1) {
          // Remove __EMPTY data
          jsonData = jsonData.map((row) => {
            const cleaned = { ...row };
            Object.keys(cleaned).forEach((key) => {
              if (key.startsWith("__EMPTY")) delete cleaned[key];
            });
            return cleaned;
          });
          // Update status
          jsonData[rowIndex][PROGRESS_HEADER] = status;
          const headers = Object.keys(jsonData[0] || {});
          newWorkbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(jsonData, {
            header: headers,
          });
        }
        setUpdatedWorkbook(newWorkbook);
        setSort(false);
      }
    },
    [updatedWorkbook, flashcards, index, selectedHeaders]
  );

  useEffect(() => {
    if (commonHeaders.length > 0) {
      // Set the front and back headers
      setFrontHeader(new Set([commonHeaders[0]]));
      setBackHeader(new Set(commonHeaders.slice(1)));

      // Reset the sort index
      setSortIndex(() => {
        const updated = [];
        [...commonHeaders].forEach((header) => {
          updated.push({ header, order: 0 });
        });
        return updated;
      });
      setSort(true);
    } else {
      setFrontHeader(new Set());
      setBackHeader(new Set());
      setSortIndex([]);
      setSort(true);
    }
  }, [commonHeaders]);

  // Set the flashcard's data
  useEffect(() => {
    if (!updatedWorkbook) return;

    // Get the data
    let allData = [];
    selectedSheets.forEach((sheetName) => {
      const worksheet = updatedWorkbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const filteredData = jsonData.map((row) => {
        let filteredRow = {};
        [...selectedHeaders].forEach((header) => {
          if (row[header] !== undefined) {
            filteredRow[header] = row[header];
          }
        });
        // Add sheet and progress information
        filteredRow["sheet"] = sheetName;
        return filteredRow;
      });
      allData = [...allData, ...filteredData];
    });

    // Sort or randomize the data
    let data = [];
    let indices = allData.map((_, index) => index);
    if (random) {
      // Randomize the data
      indices = arrayShuffle(indices);
      if (JSON.stringify(indices) !== JSON.stringify(orderIndices)) {
        setOrderIndices(indices);
      }
      data = indices.map((i) => allData[i]);
      setRandom(false);
    } else if (sort) {
      // Sort the data
      indices.sort((a, b) => {
        let result = 0;
        for (const { header, order } of sortIndex) {
          const aVal = allData[a][header];
          const bVal = allData[b][header];
          if (order === 0 || aVal === bVal) continue;
          const increasing = order === 1;
          result = increasing ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
        }
        return result;
      });
      if (JSON.stringify(indices) !== JSON.stringify(orderIndices)) {
        setOrderIndices(indices);
      }
      data = indices.map((i) => allData[i]);
      setSort(false);
    } else {
      // Use previous order
      data = orderIndices.map((i) => allData[i]);
    }
    // If there is no header selected (PROGRESS_HEADER is always selected by default)
    data = selectedHeaders.size === 1 ? [] : data;
    setFlashcards(data);
  }, [
    updatedWorkbook,
    selectedSheets,
    selectedHeaders,
    sortIndex,
    random,
    sort,
    orderIndices,
  ]);

  // Handle keyboard events to navigate and handle progress
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        increaseIndex();
      } else if (event.key === "ArrowLeft") {
        decreaseIndex();
      } else if (event.key === "1") {
        handleProgressChange(null, "almost unknown");
      } else if (event.key === "2") {
        handleProgressChange(null, "barely understood");
      } else if (event.key === "3") {
        handleProgressChange(null, "clearly recognized");
      } else if (event.key === "4") {
        handleProgressChange(null, "deeply grasped");
      } else if (event.key === "5") {
        handleProgressChange(null, "expertly applied");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [increaseIndex, decreaseIndex, handleProgressChange]);

  return (
    <div className="app-container">
      <AppTour />
      <h1>Excel to Flashcard</h1>
      <Toaster position="top-center" />
      <div className="app-content">
        <div className="file-sheet">
          <FileManager
            handleUpload={handleUpload}
            handleSave={handleSave}
            emptyWorkbook={workbook ? false : true}
          />
          <Sheets
            sheetNames={sheets}
            selectedSheets={selectedSheets}
            handleSheetSelection={handleSheetSelection}
          />
          <Sort
            selectedHeaders={selectedHeaders}
            sortDict={SORT}
            sortIndex={sortIndex}
            handleSort={handleSort}
          />
        </div>
        <div className="flashcard-container">
          <button
            className={`circle-button ${index === 0 ? "disable" : ""}`}
            onClick={decreaseIndex}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <Flashcard
            index={index}
            content={flashcards}
            frontHeader={frontHeader}
            backHeader={backHeader}
            progressDict={PROGRESS}
            progressHeader={PROGRESS_HEADER}
          />
          <button
            className={`circle-button ${
              index === flashcards.length - 1 || flashcards.length === 0
                ? "disable"
                : ""
            }`}
            onClick={increaseIndex}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
        <Content
          commonHeaders={commonHeaders.filter(
            (header) => header !== PROGRESS_HEADER
          )}
          frontHeader={frontHeader}
          backHeader={backHeader}
          handleFrontHeader={handleFrontHeader}
          handleBackHeader={handleBackHeader}
        />
        <Progress
          progressDict={PROGRESS}
          progressHeader={PROGRESS_HEADER}
          handleProgressChange={handleProgressChange}
          emptyWorkbook={workbook ? false : true}
        />
        <div className="order">
          <button
            className={`rectangle-button ${workbook ? "" : "disable"}`}
            onClick={randomFlashcard}
          >
            Random
          </button>
          <button
            className={`rectangle-button ${workbook ? "" : "disable"}`}
            onClick={resetOrder}
          >
            Reset Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
