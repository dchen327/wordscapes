import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { disableBodyScroll } from "body-scroll-lock";
import Crossword from "./Crossword";
import WordCircle from "./WordCircle";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const Game = () => {
  const [grid, setGrid] = useState([]);
  const [completeGrid, setCompleteGrid] = useState([]);
  const [words, setWords] = useState([]);
  const [bonusWords, setBonusWords] = useState([]);
  const [letters, setLetters] = useState([]);
  const [wordsFound, setWordsFound] = useState(0);
  const [foundBonusWords, setFoundBonusWords] = useState([]);
  const [themeColor, setThemeColor] = useState("");
  // defineMode true: tap letter -> define, false: tap letter -> reveal
  const [defineMode, setDefineMode] = useState(true);
  const [levelNum, setLevelNum] = useState(() => {
    // get levelNum from local storage
    const levelNum = localStorage.getItem("levelNum");
    return levelNum ? parseInt(levelNum) : 1;
  });
  const [showBonusWords, setShowBonusWords] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [levelNumInput, setLevelNumInput] = useState(levelNum);
  const NUM_LEVELs = 10;

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
    setLevel(levelNum + 1);
    // TODO: set theme color to something new
  };

  const setLevel = (levelNum) => {
    setLevelNum(levelNum);
    localStorage.setItem("levelNum", levelNum);
    setFoundBonusWords([]);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const levelSelectClicked = () => {
    setLevelNumInput(levelNum);
    setShowLevelSelect(true);
  };

  const selectLevel = () => {
    const newLevelNum = parseInt(levelNumInput);
    if (newLevelNum > 0) {
      toast.success(`Level ${newLevelNum} Selected!`);
      setLevel(newLevelNum);
    }
    closeLevelSelect();
  };

  const closeLevelSelect = () => {
    setShowLevelSelect(false);
  };

  const defineWord = async (word) => {
    console.log(word);
    const response = await fetch("/api/define.py", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    });
    const data = await response.json();
    console.log(data);
  };

  // fetch new crossword each time levelNum changes
  useEffect(() => {
    const fetchCrossword = async () => {
      const response = await fetch("/api/index.py", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ levelNum: ((levelNum - 1) % NUM_LEVELs) + 1 }),
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
      setBonusWords(data.bonus);
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
      <div
        id="background"
        className="flex flex-col justify-evenly items-center justify-center h-screen w-screen bg-cover"
        style={{
          backgroundImage: `url(${require("./assets/River-and-Trees-Wallpaper.jpg")})`,
        }}
      >
        <div className="flex items-center justify-center w-full">
          <button
            className="bg-slate-200 rounded-lg py-1 px-2 m-2"
            onClick={() => levelSelectClicked()}
          >
            Level {levelNum}
          </button>
        </div>
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
              bonusWords,
              letters,
              setLetters,
              completeGrid,
              grid,
              setGrid,
              wordsFound,
              setWordsFound,
              foundBonusWords,
              setFoundBonusWords,
              setShowBonusWords,
              themeColor,
              setThemeColor,
              levelComplete,
              getNextLevel,
              shuffleArray,
              setDefineMode,
            }}
          />
        )}
      </div>
      {/* level select modal */}
      <Modal
        className="flex flex-col justify-center items-center absolute bg-sky-800 rounded-lg p-4 mx-5 inset-x-0 top-1/3 text-center"
        isOpen={showLevelSelect}
        ariaHideApp={false}
        onRequestClose={() => closeLevelSelect()}
        shouldCloseOnOverlayClick={true}
      >
        <form onSubmit={selectLevel}>
          <h1 className="text-xl text-slate-200 font-bold">Level Select</h1>
          <input
            className="text-base w-1/2 border-2 border-gray-300 rounded-lg p-1 m-2 text-center"
            type="number"
            value={levelNumInput}
            onChange={(e) => setLevelNumInput(e.target.value)}
            autoFocus
          />
          <div className="flex flex-row justify-center w-full">
            <button
              type="submit"
              className="bg-slate-200 rounded-lg py-1 px-2 m-2"
              onClick={() => selectLevel(levelNumInput)}
            >
              Select
            </button>
            <button
              className="bg-slate-200 rounded-lg py-1 px-2 m-2"
              onClick={() => closeLevelSelect()}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
      {/* bonus words modal */}
      <Modal
        className="bg-sky-800 rounded-lg p-4 m-5 inset-x-0 h-5/6 overflow-y-scroll"
        isOpen={showBonusWords}
        ariaHideApp={false}
        onRequestClose={() => setShowBonusWords(false)}
        shouldCloseOnOverlayClick={true}
      >
        <div className="grid grid-cols-5 items-center mb-1">
          <h1 className="col-start-2 col-span-3 text-lg text-center text-slate-200 font-bold">
            Bonus Words
          </h1>
          <button
            className="text-slate-300 p-1 text-right"
            onClick={() => setShowBonusWords(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="flex flex-col justify-center items-center">
          {foundBonusWords.map((word) => (
            <p
              key={word}
              onClick={() => defineWord(word)}
              className="text-sm text-slate-200"
            >
              {word}
            </p>
          ))}
        </div>
      </Modal>
    </>
  );
};
