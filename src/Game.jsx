import { useEffect, useState } from "react";
import Crossword from "./Crossword";
import WordCircle from "./WordCircle";

export const Game = () => {
  const [grid, setGrid] = useState([]);
  const [completeGrid, setCompleteGrid] = useState([]);
  const [words, setWords] = useState(null);
  const [letters, setLetters] = useState("");
  const [wordsFound, setWordsFound] = useState(0);
  const [themeColor, setThemeColor] = useState("");
  const [levelNum, setLevelNum] = useState(1);
  const getNextLevel = () => {
    setLevelNum(levelNum + 1);
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
      setThemeColor("#34D399");
      // TODO: pick new theme color here as well
    };

    fetchCrossword();
  }, [levelNum]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover"
      style={{
        backgroundImage: `url(${require("./assets/River-and-Trees-Wallpaper.jpg")})`,
      }}
    >
      {grid && (
        <Crossword
          propGrid={grid}
          wordsFound={wordsFound}
          themeColor={themeColor}
        />
      )}
      {words && letters && (
        <WordCircle
          words={words}
          letters={letters}
          completeGrid={completeGrid}
          grid={grid}
          setGrid={setGrid}
          wordsFound={wordsFound}
          setWordsFound={setWordsFound}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
          getNextLevel={getNextLevel}
        />
      )}
    </div>
  );
};
