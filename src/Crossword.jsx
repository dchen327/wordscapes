import { useEffect, useState } from "react";
import { useElementSize } from "usehooks-ts";

const Crossword = ({ propGrid, themeColor }) => {
  const [grid, setGrid] = useState([]);
  const numCols = grid[0]?.length;
  const [crosswordRef, { width, height }] = useElementSize();

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

  console.log(width, height);
  return (
    <div
      className="flex grow p-2 mt-5 aspect-square"
      style={{ maxWidth: "100vw", maxHeight: "100vw" }}
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
                height: (0.9 * height) / numCols,
                fontSize: (0.6 * height) / numCols,
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
      {/* <table className="table-fixed w-full border-separate border-spacing-[0.2rem]">
        <tbody>
          {grid &&
            numCols &&
            grid.map((row, i) => (
              <tr
                key={i}
                style={{
                  backgroundColor: "blue",
                  height: (0.5 * height) / numCols,
                }}
              >
                {row.map((col, j) => (
                  <td
                    className={getTDClassNames(col)}
                    key={`${i}${j}`}
                    style={{
                      backgroundColor: getCellBGColor(col),
                      width: "10%",
                    }}
                  >
                    {col !== "-" && (
                      <p
                        className="flex items-center justify-center font-mono font-bold text-center aspect-square"
                        style={{
                          // height: `calc(75vw / ${numCols})`,
                          // maxHeight: (0.7 * height) / numCols,
                          fontSize: (0.3 * height) / numCols,
                        }}
                      >
                        {col === "_" ? "" : col}
                      </p>
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default Crossword;
