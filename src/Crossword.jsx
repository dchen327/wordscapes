import { useState } from "react";

const Crossword = () => {
  const [grid, setGrid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCrossword = async () => {
    const response = await fetch("/api/index.py");
    const data = await response.json();
    let words = data.words;
    setGrid(data.grid);
    let r = data.grid.length;
    let c = data.grid[0].length;
  };

  return (
    <>
      <button onClick={fetchCrossword}>Fetch Crossword</button>
      <div className="mx-2 flex items-center justify-center">
        <table className="table-fixed border-separate border">
          <tbody>
            {grid &&
              grid.map((row, i) => (
                <tr key={i}>
                  {row.map((col, j) => (
                    <td
                      className={`${
                        col === "-" ? "invisible" : "border rounded"
                      } `}
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor:
                          col === "-"
                            ? "transparent"
                            : "rgba(205, 209, 230, 0.3)",
                      }}
                      key={`${i}${j}`}
                    >
                      <p className="font-mono font-bold text-center text-4xl">
                        {col.toUpperCase()}
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
