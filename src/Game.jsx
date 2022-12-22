import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import Crossword from "./Crossword";
import WordCircle from "./WordCircle";

export const Game = () => {
  const [grid, setGrid] = useState([]);
  const [completeGrid, setCompleteGrid] = useState([]);
  const [words, setWords] = useState(null);
  const [letters, setLetters] = useState([]);
  const [wordsFound, setWordsFound] = useState(0);
  const [themeColor, setThemeColor] = useState("");
  const [levelNum, setLevelNum] = useState(1);
  // defineMode true: tap letter -> define, false: tap letter -> reveal
  const [defineMode, setDefineMode] = useState(true);

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
    toast.success(`Level ${levelNum} Complete!`, {
      duration: 3000,
    });
    setLevelNum(levelNum + 1);
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
    <div
      className="flex flex-col justify-around items-center justify-center h-screen bg-cover"
      style={{
        backgroundImage: `url(${require("./assets/River-and-Trees-Wallpaper.jpg")})`,
        height: "-webkit-fill-available",
      }}
    >
      <Toaster />
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
  );
};
