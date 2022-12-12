import { useState } from "react";
import Crossword from "./Crossword";
import CustomDragLayer from "./CustomDragLayer";
import WordCircle from "./WordCircle";

export const Game = () => {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState(null);
  const [letters, setLetters] = useState("");
  const [wordsFound, setWordsFound] = useState(0);

  const fetchCrossword = async () => {
    const response = await fetch("/api/index.py");
    const data = await response.json();
    // let words = data.words;
    setGrid(data.grid);
    setWords(data.words);
    let startWord = Object.keys(data.words)[0].split("");
    shuffleArray(startWord);
    console.log(startWord);
    setLetters(startWord);
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  return (
    <>
      <button onClick={fetchCrossword}>Fetch Crossword</button>
      <CustomDragLayer />
      {grid && <Crossword grid={grid} wordsFound={wordsFound} />}
      {words && letters && (
        <WordCircle
          words={words}
          letters={letters}
          grid={grid}
          setGrid={setGrid}
          wordsFound={wordsFound}
          setWordsFound={setWordsFound}
        />
      )}
    </>
  );
};
