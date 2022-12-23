import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { disableBodyScroll } from "body-scroll-lock";
import Crossword from "./Crossword";
import WordCircle from "./WordCircle";

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
    // clear previous toasts
    toast.dismiss();
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
      <div
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
              levelComplete,
              getNextLevel,
              shuffleArray,
              setDefineMode,
            }}
          />
        )}
      </div>
    </>
  );
};
