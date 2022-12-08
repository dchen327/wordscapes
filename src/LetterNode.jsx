import { useDrop } from "react-dnd";
import LetterDraggable from "./LetterDraggable";

function LetterNode({
  letter,
  letterID,
  usedLetterIDs,
  setUsedLetterIDs,
  arrows,
  setArrows,
  onDragEnd,
}) {
  const [, drop] = useDrop(
    () => ({
      accept: "invisible-dragger",
      hover: (item) => {
        if (item.source !== letterID) {
          // console.log(letterID, usedLetterIDs[letterID]);
          if (!usedLetterIDs[letterID]) {
            let newArrow = { start: item.source, end: letterID };
            if (arrows && newArrow !== arrows[arrows.length - 1]) {
              setArrows([...arrows, newArrow]);
              // set letter to true
              setUsedLetterIDs({ ...usedLetterIDs, [newArrow.end]: true });
            }
            item.source = letterID;
          } else {
            // if letter is already used, remove the last arrow
            if (arrows.length > 1) {
              let arrowMin1 = arrows[arrows.length - 1];
              let arrowMin2 = arrows[arrows.length - 2];
              if (
                arrowMin1.start === letterID &&
                arrowMin1.end === item.source
              ) {
                let newArrows = arrows.slice(0, arrows.length - 2);
                setArrows(newArrows);
                // set letter to false
                setUsedLetterIDs({
                  ...usedLetterIDs,
                  [item.source]: false,
                  [letterID]: false,
                });
                item.source = arrowMin2.start;
              }
            }
          }
        }
      },
    }),
    [arrows, usedLetterIDs]
  );

  return (
    <>
      <div
        className={`flex items-center justify-center ${
          usedLetterIDs[letterID] ? "text-slate-50" : "text-gray-900"
        }`}
        ref={drop}
        id={letterID}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: usedLetterIDs[letterID] ? "#67B7D1" : "transparent",
        }}
      >
        <LetterDraggable
          startNodeID={letterID}
          letter={letter}
          arrows={arrows}
          onDragEnd={onDragEnd}
        />
      </div>
    </>
  );
}

export default LetterNode;
