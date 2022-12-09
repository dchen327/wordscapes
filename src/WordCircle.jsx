import React, { useState } from "react";
import LetterNode from "./LetterNode";
import Xarrow from "react-xarrows";
import { disableBodyScroll } from "body-scroll-lock";

const WordCircle = () => {
  const letters = Array.from("LAPTOPS");
  const letterIDs = letters.map((letter, i) => `letter${i}_${letter}`);
  const [arrows, setArrows] = useState([]);
  const [inputtedWord, setInputtedWord] = useState("");
  // map to map usedLetters to booleans (setState)
  const [usedLetterIDs, setUsedLetterIDs] = useState(
    letterIDs.map((letterID) => false)
  );

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
      setInputtedWord(word);
      setArrows([]);
      setUsedLetterIDs(letterIDs.map((letterID) => false));
    }
  };

  const getCircleLayout = (letters) => {
    let radius = 120;
    let letterWidth = 17;
    let circleWidth = 2 * (radius + letterWidth);
    return (
      <div
        style={{
          backgroundColor: "rgba(205, 209, 230, 0.3)",
          width: circleWidth,
          height: circleWidth,
          borderRadius: "50%",
        }}
      >
        {letters.map((letter, i) => {
          let angle = (2 * Math.PI) / letters.length;
          // initial value centered vertically on positive y-axis
          let x =
            0.8 * radius * Math.cos(angle * i - Math.PI / 2) +
            radius -
            letterWidth;
          let y =
            0.8 * radius * Math.sin(angle * i - Math.PI / 2) +
            radius -
            letterWidth;
          return (
            <div
              key={`letter${i}`}
              style={{ left: `${x}px`, top: `${y}px`, position: "absolute" }}
            >
              <div className="flex items-center justify-center">
                <LetterNode
                  id={`letter${i}_${letter}`}
                  letter={letter}
                  letterID={`letter${i}_${letter}`}
                  usedLetterIDs={usedLetterIDs}
                  setUsedLetterIDs={setUsedLetterIDs}
                  arrows={arrows}
                  setArrows={setArrows}
                  onDragEnd={onDragEnd}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {arrows.map((arrow, i) => (
        <Xarrow
          start={arrow.start}
          end={arrow.end}
          key={`arrow${i}`}
          path="straight"
          startAnchor="middle"
          endAnchor="middle"
          showHead={false}
          strokeWidth={8}
          color="#67B7D1"
        />
      ))}
      {getCircleLayout(letters)}
      <h1>{inputtedWord}</h1>
    </>
  );
};

export default WordCircle;
