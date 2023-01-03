import { useEffect } from "react";

const Crossword = ({
  grid,
  setGrid,
  completeGrid,
  words,
  levelComplete,
  getNextLevel,
  themeColor,
  defineMode,
  setDefineMode,
  posToWords,
  defineWords,
  revealAnimState,
  toggleRevealAnim,
  currRevealedIdxs,
  setCurrRevealedIdxs,
}) => {
  const numCols = grid[0]?.length;

  // rerender when grid or defineMode changes
  useEffect(() => {}, [grid, defineMode]);

  const getCellBGColor = (col) => {
    if (col === "-") {
      return "transparent";
    } else if (!defineMode) {
      // sniping mode, light yellow transparent highlight
      return "rgb(255,255,200,0.8)";
    }
    return "rgb(205,209,230,0.8)";
  };

  const getCellClassNames = (col, idx) => {
    return [
      "text-slate-50",
      "aspect-square",
      "overflow-hidden",
      col === "-" ? "invisible" : "rounded",
    ].join(" ");
  };

  const letterTapped = (idx) => {
    // get row and col
    let r = Math.floor(idx / numCols);
    let c = idx % numCols;
    if (defineMode && grid[r][c] !== "_") {
      const wordsToDefine = []; // found words
      // check if words are complete
      for (const word of posToWords[idx]) {
        let [r, c, horiz] = words[word];
        let wordFound = true;
        if (horiz) {
          for (let i = 0; i < word.length; i++) {
            if (grid[r][c + i] === "_") {
              wordFound = false;
              break;
            }
          }
        } else {
          for (let i = 0; i < word.length; i++) {
            if (grid[r + i][c] === "_") {
              wordFound = false;
              break;
            }
          }
        }

        if (wordFound) {
          wordsToDefine.push(word);
        }
      }
      if (wordsToDefine.length) {
        defineWords(wordsToDefine);
      }
    } else if (!defineMode && grid[r][c] === "_") {
      const newGrid = [...grid];
      newGrid[r][c] = completeGrid[r][c];
      setGrid(newGrid);
      setCurrRevealedIdxs({ [idx]: 0 });
      toggleRevealAnim(true);
      setDefineMode(true);
      if (levelComplete(newGrid)) {
        getNextLevel(500);
      }
    }
  };

  return (
    <div
      className="flex grow p-2 mt-5 aspect-square"
      style={{ maxWidth: "95vw", maxHeight: "95vw" }}
    >
      {grid && numCols && (
        // display grid as 10x10 grid
        <div className="grid grid-cols-10 gap-0.5 w-full">
          {grid.flat().map((col, idx) => (
            <div
              className={getCellClassNames(col, idx)}
              key={idx}
              onClick={() => letterTapped(idx)}
              style={{
                backgroundColor: getCellBGColor(col),
              }}
            >
              {col !== "-" && (
                <div
                  className={`aspect-square border rounded transition-all ${
                    idx in currRevealedIdxs &&
                    (revealAnimState.status === "entering" ||
                      revealAnimState.status === "entered")
                      ? "animate-fadeIn"
                      : ""
                  }`}
                  style={{
                    backgroundColor: col === "_" ? "transparent" : themeColor,
                    animationDelay: `${currRevealedIdxs[idx]}ms`,
                  }}
                >
                  <p
                    className={`flex items-center justify-center font-mono font-bold overflow-hidden select-none h-full 
                  `}
                    onAnimationEnd={() => toggleRevealAnim(false)}
                  >
                    {col === "_" ? "" : col}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Crossword;
