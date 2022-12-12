const Crossword = ({ grid }) => {
  const numCols = grid[0]?.length;

  return (
    <>
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
                          height: `calc(80vw / ${numCols})`,
                          fontSize: `calc(65vw / ${numCols})`,
                        }}
                      >
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
