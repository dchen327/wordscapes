import { useDrop } from "react-dnd";
import LetterDraggable from "./LetterDraggable";

const LetterNode = ({
  letter,
  letterID,
  usedLetterIDs,
  setUsedLetterIDs,
  arrows,
  setArrows,
  onDragEnd,
}) => {
  const [, drop] = useDrop(
    () => ({
      accept: "invisible-dragger",
      hover: (item) => {
        if (item.source !== letterID) {
          let newArrow = { start: item.source, end: letterID };
          if (arrows && newArrow !== arrows[arrows.length - 1]) {
            setArrows([...arrows, newArrow]);
            // set letter to true
            setUsedLetterIDs({ ...usedLetterIDs, [newArrow.end]: true });
          }
        } else {
        }
        item.source = letterID;
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
};

export default LetterNode;
