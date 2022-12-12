import { useState } from "react";
import Crossword from "./Crossword";
import CustomDragLayer from "./CustomDragLayer";
import WordCircle from "./WordCircle";

export const Game = () => {
  const [grid, setGrid] = useState(null);
  const [words, setWords] = useState(null);

  const fetchCrossword = async () => {
    const response = await fetch("/api/index.py");
    const data = await response.json();
    setWords(data.words);
    setGrid(data.grid);
  };

  return (
    <>
      <button onClick={fetchCrossword}>Fetch Crossword</button>
      <CustomDragLayer />
      {grid && <Crossword grid={grid} />}
      {words && <WordCircle />}
    </>
  );
};
