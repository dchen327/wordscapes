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
      return "bg-transparent";
    } else if (col === "_") {
      return "bg-[rgb(205,209,230)]/30";
    } else {
      return `bg-[${themeColor}]/80`;
    }
  };

  const getTDClassNames = (col) => {
    return [
      "text-slate-50",
      getCellBGColor(col),
      col === "-" ? "invisible" : "border rounded",
    ].join(" ");
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
                    <td className={getTDClassNames(col)} key={`${i}${j}`}>
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
