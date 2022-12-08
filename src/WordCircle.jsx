import React, { useState } from "react";
import LetterNode from "./LetterNode";
import Xarrow from "react-xarrows";
import { disableBodyScroll } from "body-scroll-lock";

const WordCircle = () => {
  const [dragging, setDragging] = useState(false);
  const letters = ["A", "B", "C"];
  const [arrows, setArrows] = useState([]);
  // const [lettersArray, setLettersArray] = useState([]);

  disableBodyScroll(document.body);
  const onDragEnd = () => {
    if (arrows.length > 0) {
      let lettersArray = [];
      arrows.forEach((element) => {
        lettersArray.push(element.start.split("_")[1]);
      });
      lettersArray.push(arrows[arrows.length - 1].end.split("_")[1]);
      let word = lettersArray.join("");
      console.log(word);
      setArrows([]);
    }
  };

  return (
    <>
      <div className="columns m-5">
        {letters.map((letter, i) => (
          <div key={`letter${i}`} className="column">
            <LetterNode
              id={`letter${i}_${letter}`}
              letter={letter}
              letterID={`letter${i}_${letter}`}
              arrows={arrows}
              setArrows={setArrows}
              onDragEnd={onDragEnd}
            />
          </div>
        ))}
      </div>
      <div className="columns m-5">
        {["D", "E", "F"].map((letter, i) => (
          <div key={`letter${i + 3}`} className="column">
            <LetterNode
              id={`letter${i + 3}_${letter}`}
              letter={letter}
              letterID={`letter${i + 3}_${letter}`}
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
