import { useEffect } from "react";
import { toast } from "react-hot-toast";

const Crossword = ({
  grid,
  setGrid,
  completeGrid,
  levelComplete,
  getNextLevel,
  themeColor,
  defineMode,
  setDefineMode,
}) => {
  const numCols = grid[0]?.length;

  // rerender when grid or defineMode changes
  useEffect(() => {}, [grid, defineMode]);

  const getCellBGColor = (col) => {
    if (col === "-") {
      return "transparent";
    } else if (col === "_") {
      if (!defineMode) {
        // sniping mode, light yellow transparent highlight
        return "rgb(255,255,200,0.8)";
      }
      return "rgb(205,209,230,0.8)";
    } else {
      return themeColor;
    }
  };

  const getCellClassNames = (col) => {
    return [
      "text-slate-50",
      "aspect-square",
      "overflow-hidden",
      col === "-" ? "invisible" : "border rounded",
    ].join(" ");
  };

  const letterTapped = (idx) => {
    // get row and col
    let r = Math.floor(idx / numCols);
    let c = idx % numCols;
    if (defineMode && grid[r][c] !== "_") {
      toast.error("Definitions not implemented yet");
    } else if (!defineMode && grid[r][c] === "_") {
      const newGrid = [...grid];
      newGrid[r][c] = completeGrid[r][c];
      setGrid(newGrid);
      setDefineMode(true);
      if (levelComplete(newGrid)) {
        getNextLevel();
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
          {grid.flat().map((col, i) => (
            <div
              className={getCellClassNames(col)}
              key={i}
              style={{
                backgroundColor: getCellBGColor(col),
              }}
              onClick={() => letterTapped(i)}
            >
              {col !== "-" && (
                <p className="flex items-center justify-center font-mono font-bold overflow-hidden select-none h-full">
                  {col === "_" ? "" : col}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Crossword;
