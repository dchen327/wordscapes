import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";

const LetterDraggable = ({ startNodeID }) => {
  const draggableRef = useRef(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "invisible-dragger",
      item: { type: "invisible-dragger", source: draggableRef },
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
          width: "100px",
          height: "100px",
          backgroundColor: "rgb(135, 200, 200)",
          borderRadius: "25%",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <p ref={draggableRef}>drag</p>
      </div>
    </>
  );
};

export default LetterDraggable;
