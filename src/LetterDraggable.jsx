import React, { useRef } from "react";
import { useDrag } from "react-dnd";

const LetterDraggable = ({ startNodeID }) => {
  const draggableRef = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "invisible-dragger",
    item: { type: "invisible-dragger", source: draggableRef },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log("dropped, go calculate word inputted and clear arrows");
    },
  }));

  return (
    <>
      <div
        ref={drag}
        style={{
          width: "100px",
          height: "same-as-width",
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
