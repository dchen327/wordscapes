import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import Xarrow from "react-xarrows";

const LetterDraggable = ({ startNodeID }) => {
  const draggableRef = useRef(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "invisible-dragger",
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    []
  );

  return (
    <>
      <div
        ref={drag}
        style={{
          width: "25",
          height: "25px",
          backgroundColor: "rgb(135, 200, 200)",
          borderRadius: "25%",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <p ref={draggableRef}>drag</p>
      </div>
      {isDragging && <Xarrow start={startNodeID} end={draggableRef} />}
    </>
  );
};

export default LetterDraggable;
