import React, { useState } from "react";
import LetterNode from "./LetterNode";
import Xarrow from "react-xarrows";
import { disableBodyScroll } from "body-scroll-lock";

const WordCircle = () => {
  const [dragging, setDragging] = useState(false);
  const letters = ["A", "B", "C"];
  const [arrows, setArrows] = useState([]);
  const [arrowStartRef, setArrowStartRef] = useState(null);
  const addArrow = ({ start, end }) => {
    setArrows([...arrows, { start, end }]);
  };

  // disableBodyScroll(document.body);
  // console.log(arrows);

  return (
    <>
      <div className="columns m-5">
        {letters.map((letter, i) => (
          <div key={`letter${i}`} className="column">
            <LetterNode
              id={`letter${i}`}
              letter={letter}
              letterID={`letter${i}`}
              arrows={arrows}
              addArrow={addArrow}
              dragging={dragging}
              setDragging={setDragging}
              arrowStartRef={arrowStartRef}
              setArrowStartRef={setArrowStartRef}
            />
          </div>
        ))}
      </div>
      <div className="columns m-5">
        {letters.map((letter, i) => (
          <div key={`letter${i + 5}`} className="column">
            <LetterNode
              id={`letter${i + 5}`}
              letter={letter}
              letterID={`letter${i + 5}`}
              arrows={arrows}
              addArrow={addArrow}
              dragging={dragging}
              setDragging={setDragging}
              arrowStartRef={arrowStartRef}
              setArrowStartRef={setArrowStartRef}
            />
          </div>
        ))}
      </div>
      {/* {arrows.map((arrow, i) => (
        <Xarrow
          start={arrow.start}
          end={arrow.end}
          key={`arrow${i}`}
          path="straight"
          startAnchor="middle"
          endAnchor="middle"
        />
      ))} */}
    </>
  );
};

export default WordCircle;
