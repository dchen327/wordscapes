import React, { useState } from "react";
import LetterNode from "./LetterNode";
import Xarrow from "react-xarrows";
import { disableBodyScroll } from "body-scroll-lock";

const WordCircle = () => {
  const [dragging, setDragging] = useState(false);
  const letters = Array.from("NABISCO");
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

  const getCircleLayout = (letters) => {
    let radius = 100;
    return (
      <div
        style={{
          // light grey background
          backgroundColor: "rgba(205, 209, 230, 0.3)",
          minWidth: radius * 2 + 75,
          width: radius * 2 + 75,
          height: "same-as-width",
          minHeight: radius * 2 + 75,
          borderRadius: "50%",
        }}
      >
        {letters.map((letter, i) => {
          let angle = (2 * Math.PI) / letters.length;
          // iniital value centered vertically on positive y-axis
          let x = radius * Math.cos(angle * i - Math.PI / 2) + radius;
          let y = radius * Math.sin(angle * i - Math.PI / 2) + radius;
          return (
            <div
              key={`letter${i}`}
              // className="column"
              style={{ left: `${x}px`, top: `${y}px`, position: "absolute" }}
            >
              <LetterNode
                id={`letter${i}_${letter}`}
                letter={letter}
                letterID={`letter${i}_${letter}`}
                arrows={arrows}
                setArrows={setArrows}
                onDragEnd={onDragEnd}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {getCircleLayout(letters)}
      {/* <div className="columns m-5">
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
      </div> */}
      {arrows.map((arrow, i) => (
        <Xarrow
          start={arrow.start}
          end={arrow.end}
          key={`arrow${i}`}
          path="straight"
          startAnchor="middle"
          endAnchor="middle"
          // strokeWidth={15}
        />
      ))}
    </>
  );
};

export default WordCircle;
