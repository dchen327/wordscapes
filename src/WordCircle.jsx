import React, { useState } from "react";
import LetterNode from "./LetterNode";
import Xarrow from "react-xarrows";
import { useDragLayer } from "react-dnd";

const WordCircle = () => {
  const [dragging, setDragging] = useState(false);
  const letters = ["A", "B", "C"];
  const [arrows, setArrows] = useState([]);
  const [arrowStartRef, setArrowStartRef] = useState(null);
  const addArrow = ({ start, end }) => {
    setArrows([...arrows, { start, end }]);
  };

  return (
    <div className="columns m-5">
      {letters.map((letter, i) => (
        <div key={`letter${i}`} className="column">
          <LetterNode
            id={`letter${i}`}
            letter={letter}
            letterID={`letter${i}`}
            addArrow={addArrow}
            dragging={dragging}
            setDragging={setDragging}
            arrowStartRef={arrowStartRef}
            setArrowStartRef={setArrowStartRef}
          />
        </div>
      ))}
      {/* {arrowStartRef && <Xarrow start={arrowStartRef} end=} */}
      {arrows.map((arrow, i) => (
        <Xarrow start={arrow.start} end={arrow.end} key={`arrow${i}`} />
      ))}
    </div>
  );
};

export default WordCircle;
