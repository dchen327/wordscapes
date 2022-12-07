import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import LetterDraggable from "./LetterDraggable";

const LetterNode = ({
  letter,
  letterID,
  addArrow,
  dragging,
  setDragging,
  arrowStartRef,
  setArrowStartRef,
}) => {
  const ref = useRef(null);
  const [, drop] = useDrop(
    () => ({
      accept: "invisible-dragger",
      // canDrop: () => game.canMoveKnight(x, y),
      // drop: () => game.moveKnight(x, y),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        // canDrop: !!monitor.canDrop(),
      }),
      hover: (item, monitor) => {
        // console.log("hover", item);
      },
    }),
    []
  );

  return (
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
      {/* <LetterDraggable startNodeID={ref} /> */}
      <LetterDraggable startNodeID={letterID} />
    </div>
  );
};

export default LetterNode;
