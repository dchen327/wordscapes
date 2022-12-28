import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { disableBodyScroll } from "body-scroll-lock";
import Crossword from "./Crossword";
import WordCircle from "./WordCircle";
import Modal from "react-modal";

export const Game = () => {
  const [grid, setGrid] = useState([]);
  const [completeGrid, setCompleteGrid] = useState([]);
  const [words, setWords] = useState(null);
  const [letters, setLetters] = useState([]);
  const [wordsFound, setWordsFound] = useState(0);
  const [themeColor, setThemeColor] = useState("");
  // defineMode true: tap letter -> define, false: tap letter -> reveal
  const [defineMode, setDefineMode] = useState(true);
  const [levelNum, setLevelNum] = useState(() => {
    // get levelNum from local storage
    const levelNum = localStorage.getItem("levelNum");
    return levelNum ? parseInt(levelNum) : 1;
  });
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [levelNumInput, setLevelNumInput] = useState(levelNum);

  // disable body scrolling
  useEffect(() => {
    disableBodyScroll(document.body);
  }, []);

  const levelComplete = (grid) => {
    // ensure grid === completeGrid
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] !== completeGrid[r][c]) {
          return false;
        }
      }
    }
    return true;
  };

  const getNextLevel = () => {
    toast.dismiss(); // clear previous toasts
    toast.success(`Level ${levelNum} Complete!`, {
      duration: 3000,
    });
    setLevelNum(levelNum + 1);
    localStorage.setItem("levelNum", levelNum + 1);
    // TODO: set theme color to something new
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const selectLevel = (newLevelNum) => {
    if (newLevelNum > 0) {
      setLevelNum(newLevelNum);
      toast.success(`Level ${newLevelNum} Selected!`);
      localStorage.setItem("levelNum", newLevelNum);
    }
    closeLevelSelect();
  };

  const closeLevelSelect = () => {
    setShowLevelSelect(false);
    setLevelNumInput(levelNum);
  };

  // fetch new crossword each time levelNum changes
  useEffect(() => {
    const fetchCrossword = async () => {
      const response = await fetch("/api/index.py", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ levelNum }),
      });
      const data = await response.json();
      setCompleteGrid(data.grid);
      // replace all non-hyphens (crossword letters) with underscores in grid
      let grid = data.grid.map((row) => {
        return row.map((letter) => {
          return letter === "-" ? letter : "_";
        });
      });
      setGrid(grid);
      setWords(data.words);
      let startWord = Object.keys(data.words)[0].split("");
      shuffleArray(startWord);
      setLetters(startWord);
      setThemeColor("#CF9FFF");
      // TODO: pick new theme color here as well
    };

    fetchCrossword();
  }, [levelNum]);

  return (
    <>
      <Toaster />
      {/* level select modal */}
      <Modal
        className="flex flex-col justify-center items-center absolute bg-sky-800 rounded-lg p-4 mx-auto inset-x-0 top-1/3 text-center"
        isOpen={showLevelSelect}
        ariaHideApp={false}
        onRequestClose={() => closeLevelSelect()}
        shouldCloseOnOverlayClick={true}
      >
        <h1 className="text-2xl text-slate-200 font-bold">Level Select</h1>
        <input
          className="border-2 border-gray-300 rounded-lg p-2 m-2 text-center"
          type="number"
          value={levelNumInput}
          onChange={(e) => setLevelNumInput(e.target.value)}
          autoFocus
        />
        <div className="flex flex-row justify-evenly w-full">
          <button
            className="bg-slate-200 text-sky-00 rounded-lg p-2 m-2"
            onClick={() => selectLevel(levelNumInput)}
          >
            Select
          </button>
          <button
            className="bg-slate-200 text-sky-800 rounded-lg p-2 m-2"
            onClick={() => closeLevelSelect()}
          >
            Cancel
          </button>
        </div>
      </Modal>
      <div
        id="background"
        className="flex flex-col justify-evenly items-center justify-center h-screen w-screen bg-cover"
        style={{
          backgroundImage: `url(${require("./assets/River-and-Trees-Wallpaper.jpg")})`,
        }}
      >
        {grid && (
          <Crossword
            {...{
              grid,
              setGrid,
              completeGrid,
              levelComplete,
              getNextLevel,
              wordsFound,
              themeColor,
              defineMode,
              setDefineMode,
            }}
          />
        )}
        {words && letters && themeColor && (
          <WordCircle
            {...{
              words,
              letters,
              setLetters,
              completeGrid,
              grid,
              setGrid,
              wordsFound,
              setWordsFound,
              themeColor,
              setThemeColor,
              levelNum,
              setLevelNum,
              levelComplete,
              getNextLevel,
              shuffleArray,
              setDefineMode,
              setShowLevelSelect,
            }}
          />
        )}
      </div>
    </>
  );
};
