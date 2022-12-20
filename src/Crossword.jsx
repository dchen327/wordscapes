import { useEffect, useState } from "react";

const Crossword = ({ propGrid, themeColor }) => {
  const [grid, setGrid] = useState([]);
  const numCols = grid[0]?.length;

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
    return ["text-slate-50", col === "-" ? "invisible" : "border rounded"].join(
      " "
    );
  };

  return (
    <>
      <div className="grow mx-2">
        <table className="table-fixed border-separate border-spacing-[0.2rem]">
          <tbody>
            {grid &&
              numCols &&
              grid.map((row, i) => (
                <tr key={i}>
                  {row.map((col, j) => (
                    <td
                      className={getTDClassNames(col)}
                      key={`${i}${j}`}
                      style={{ backgroundColor: getCellBGColor(col) }}
                    >
                      {col !== "-" && (
                        <p
                          className="flex items-center justify-center font-mono font-bold text-center aspect-square"
                          style={{
                            height: `calc(75vw / ${numCols})`,
                            fontSize: `calc(60vw / ${numCols})`,
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
        </table>
      </div>
    </>
  );
};

export default Crossword;
