import { useState } from "react";
import Crossword from "./Crossword";
import CustomDragLayer from "./CustomDragLayer";
import WordCircle from "./WordCircle";

export const Game = () => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState(null);
  const [letters, setLetters] = useState("");
  const [wordsFound, setWordsFound] = useState(0);
  const [themeColor, setThemeColor] = useState("");

  const fetchCrossword = async () => {
    const response = await fetch("/api/index.py");
    const data = await response.json();
    // let words = data.words;
    setGrid(data.grid);
    setWords(data.words);
    let startWord = Object.keys(data.words)[0].split("");
    shuffleArray(startWord);
    setLetters(startWord);
    setThemeColor("bg-sky-500");
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button onClick={fetchCrossword}>Fetch Crossword</button>
      <CustomDragLayer themeColor={themeColor} />
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
          grid={grid}
          setGrid={setGrid}
          wordsFound={wordsFound}
          setWordsFound={setWordsFound}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
        />
      )}
    </div>
  );
};
