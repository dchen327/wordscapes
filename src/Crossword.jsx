import { useEffect, useState } from "react";

const Crossword = (props) => {
  const [grid, setGrid] = useState([]);
  const numCols = grid[0]?.length;

  // rerender when grid changes
  useEffect(() => {
    setGrid(props.grid);
  }, [props.grid]);

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
                        backgroundColor:
                          col === "-"
                            ? "transparent"
                            : "rgba(205, 209, 230, 0.3)",
                      }}
                      key={`${i}${j}`}
                    >
                      <p
                        className="flex items-center justify-center font-mono font-bold text-center aspect-square"
                        style={{
                          height: `calc(70vw / ${numCols})`,
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
