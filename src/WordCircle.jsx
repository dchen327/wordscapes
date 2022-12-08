import React, { useState } from "react";
import LetterNode from "./LetterNode";
import Xarrow from "react-xarrows";
import { disableBodyScroll } from "body-scroll-lock";

const WordCircle = () => {
  const [dragging, setDragging] = useState(false);
  const letters = ["A", "B", "C"];
  const [arrows, setArrows] = useState([]);

  // disableBodyScroll(document.body);
  const onDragEnd = () => {
    console.log(arrows);
    setArrows([]);
    
  };

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
              setArrows={setArrows}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
      </div>
      <div className="columns m-5">
        {letters.map((letter, i) => (
          <div key={`letter${i + 3}`} className="column">
            <LetterNode
              id={`letter${i + 3}`}
              letter={letter}
              letterID={`letter${i + 3}`}
              arrows={arrows}
              setArrows={setArrows}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
      </div>
      {arrows.map((arrow, i) => (
        <Xarrow
          start={arrow.start}
          end={arrow.end}
          key={`arrow${i}`}
          path="straight"
          startAnchor="middle"
          endAnchor="middle"
        />
      ))}
    </>
  );
};

export default WordCircle;
