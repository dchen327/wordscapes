import React from "react";
import { useDrop } from "react-dnd";
import LetterDraggable from "./LetterDraggable";

const LetterNode = ({ letter, letterID, arrows, addArrow }) => {
  const [, drop] = useDrop(
    () => ({
      accept: "invisible-dragger",
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      hover: (item) => {
        if (item.source !== letterID) {
          let newArrow = { start: item.source, end: letterID };
          if (arrows && newArrow !== arrows[arrows.length - 1]) {
            addArrow(newArrow);
          }
        }
        item.source = letterID;
      },
    }),
    [arrows]
  );

  return (
    <>
      <div
        id={letterID}
        style={{
          width: "150px",
          height: "same-as-width",
        }}
      >
        <div
          className="button"
          ref={drop}
          id={letterID}
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "rgb(205, 209, 228)",
            borderRadius: "50%",
          }}
        >
          {/* <p style={{ margin: "auto" }}>
        {letter}
      </p> */}
          <LetterDraggable startNodeID={letterID} arrows={arrows} />
        </div>
      </div>
    </>
  );
};

export default LetterNode;
