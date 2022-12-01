import React, { useRef } from "react";

const LetterNode = ({
  letter,
  addArrow,
  dragging,
  setDragging,
  arrowStartRef,
  setArrowStartRef,
}) => {
  const ref = useRef(null);

  return (
    <div
      className="button"
      ref={ref}
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: "rgb(205, 209, 228)",
        borderRadius: "50%",
      }}
      onMouseDown={(e) => {
        // console.log mouse position
        console.log(e.clientX, e.clientY);
        setArrowStartRef(ref);
        setDragging(true);
      }}
      onMouseOver={(e) => {
        if (dragging) {
          if (ref !== arrowStartRef) {
            console.log(arrowStartRef, ref);
            addArrow({ start: arrowStartRef, end: ref });
            setArrowStartRef(ref);
          }
        }
      }}
    >
      <p style={{ margin: "auto" }}>{letter}</p>
    </div>
  );
};

export default LetterNode;
