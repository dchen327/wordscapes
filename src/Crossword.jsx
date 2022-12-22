import { useEffect, useState } from "react";
import { useElementSize } from "usehooks-ts";

const Crossword = ({ propGrid, themeColor }) => {
  const [grid, setGrid] = useState([]);
  const numCols = grid[0]?.length;
  const [crosswordRef, dimensions] = useElementSize();

  // rerender when grid changes
  useEffect(() => {
    setGrid(propGrid);
  }, [propGrid]);

  const getCellBGColor = (col) => {
    if (col === "-") {
      return "transparent";
    } else if (col === "_") {
      return "rgb(205,209,230,0.8)";
    } else {
      return themeColor;
    }
  };

  const getTDClassNames = (col) => {
    return [
      "text-slate-50",
      "aspect-square",
      col === "-" ? "invisible" : "border rounded",
    ].join(" ");
  };

  return (
    <div
      className="flex grow p-2 mt-3 aspect-square"
      style={{ maxWidth: "95vw", maxHeight: "95vw" }}
    >
      {grid && numCols && (
        // display grid as 10x10 grid
        <div className="grid grid-cols-10 gap-0.5 w-full" ref={crosswordRef}>
          {grid.flat().map((col, i) => (
            <div
              className={getTDClassNames(col)}
              key={i}
              style={{
                backgroundColor: getCellBGColor(col),
                height: (0.9 * dimensions.height) / numCols,
                fontSize: (0.6 * dimensions.height) / numCols,
              }}
            >
              {col !== "-" && (
                <p className="flex items-center justify-center font-mono font-bold text-center aspect-square">
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
