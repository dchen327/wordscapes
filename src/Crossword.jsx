import { useEffect, useState } from "react";

const Crossword = (props) => {
  const [grid, setGrid] = useState([]);
  const numCols = grid[0]?.length;

  // rerender when grid changes
  useEffect(() => {
    setGrid(props.grid);
  }, [props.grid]);

  const getCellBGColor = (col) => {
    if (col === "-") {
      return "transparent";
    } else if (col === "_") {
      return "rgba(205, 209, 230, 0.3)";
    } else {
      return "rgb(0,191,255, 0.3)";
    }
  };

  return (
    <>
      <div className="mx-2 flex items-center justify-center">
        <table className="table-fixed border-separate border">
          <tbody>
            {grid &&
              numCols &&
              grid.map((row, i) => (
                <tr key={i}>
                  {row.map((col, j) => (
                    <td
                      className={`${
                        col === "-" ? "invisible" : "border rounded"
                      } `}
                      style={{
                        backgroundColor: getCellBGColor(col),
                      }}
                      key={`${i}${j}`}
                    >
                      <p
                        className="flex items-center justify-center font-mono font-bold text-center aspect-square"
                        style={{
                          height: `calc(75vw / ${numCols})`,
                          fontSize: `calc(60vw / ${numCols})`,
                        }}
                      >
                        {col !== "_" ? col : ""}
                      </p>
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
