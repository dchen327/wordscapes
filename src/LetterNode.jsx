import React, { useState } from "react";
import { useDrop } from "react-dnd";
import LetterDraggable from "./LetterDraggable";
import Xarrow from "react-xarrows";

const LetterNode = ({
  letter,
  letterID,
  arrows,
  addArrow,
  dragging,
  setDragging,
  arrowStartRef,
  setArrowStartRef,
}) => {
  const [arrow, setArrow] = useState(null);
  const [, drop] = useDrop(
    () => ({
      accept: "invisible-dragger",
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      hover: (item, monitor) => {
        if (item.source !== letterID) {
          let newArrow = { start: item.source, end: letterID };
          if (newArrow !== arrow) {
            setArrow({ start: item.source, end: letterID });
          }
        }
        item.source = letterID;
      },
    }),
    []
  );

  console.log(arrow);

  return (
    <>
      <div id={letterID} style={{ width: "150px", height: "same-as-width" }}>
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
          <LetterDraggable startNodeID={letterID} />
        </div>
      </div>
      {arrow && (
        <Xarrow
          start={arrow.start}
          end={arrow.end}
          // key={`arrow${i}`}
          path="straight"
          startAnchor="middle"
          endAnchor="middle"
        />
      )}
    </>
  );
};

export default LetterNode;
