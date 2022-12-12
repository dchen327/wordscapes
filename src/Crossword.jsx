import { useState } from "react";

const Crossword = () => {
  const [grid, setGrid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCrossword = async () => {
    const response = await fetch("/api/index.py");
    const data = await response.json();
    let words = data.words;
    setGrid(data.grid);
    let r = grid.length;
    let c = grid[0].length;
  };

  return (
    <div>
      <button onClick={fetchCrossword}>Fetch Crossword</button>
      <table>
        <tbody>
          {grid &&
            grid.map((row, i) => (
              <tr key={i}>
                {row.map((col, j) => (
                  <td key={j}>
                    <p>{grid[i][j]}</p>
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Crossword;
