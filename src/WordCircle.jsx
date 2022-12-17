import { useState } from "react";
import LetterNode from "./LetterNode";
import Xarrow from "react-xarrows";
import { disableBodyScroll } from "body-scroll-lock";

const WordCircle = ({
  words,
  letters,
  grid,
  setGrid,
  wordsFound,
  setWordsFound,
  themeColor,
  setThemeColor,
}) => {
  const letterIDs = letters.map((letter, i) => `letter${i}_${letter}`);
  const [arrows, setArrows] = useState([]);
  const [inputtedWord, setInputtedWord] = useState("");
  // map to map usedLetters to booleans (setState)
  const [usedLetterIDs, setUsedLetterIDs] = useState(
    letterIDs.map((letterID) => false)
  );
  const circleRadius = 100;
  const letterWidth = circleRadius / 2;

  disableBodyScroll(document.body);

  const onDragEnd = () => {
    if (arrows.length > 0) {
      let lettersArray = [];
      arrows.forEach((element) => {
        lettersArray.push(element.start.split("_")[1]);
      });
      lettersArray.push(arrows[arrows.length - 1].end.split("_")[1]);
      let word = lettersArray.join("");
      setInputtedWord(word);
      setArrows([]);
      setUsedLetterIDs(letterIDs.map((letterID) => false));

      // update grid if word is present
      if (Object.keys(words).includes(word)) {
        let [r, c, horiz] = words[word];
        let wordArray = word.split("");
        if (horiz) {
          wordArray.forEach((letter, i) => {
            grid[r][c + i] = letter;
          });
        } else {
          wordArray.forEach((letter, i) => {
            grid[r + i][c] = letter;
          });
        }
        // print out grid
        // grid.forEach((row) => {
        //   console.log(row.join(""));
        // });
        setWordsFound(wordsFound + 1);
        setGrid(grid);
      }
    }
  };

  const GetCircleLayout = (letters) => {
    let circleWidth = 2 * (circleRadius + letterWidth / 4);
    return (
      <div
        className="relative rounded-full "
        style={{
          backgroundColor: "rgba(205, 209, 230, 0.3)",
          width: circleWidth,
          height: circleWidth,
        }}
      >
        {letters.map((letter, i) => {
          let angle = (2 * Math.PI) / letters.length;
          // initial value centered vertically on positive y-axis
          let x =
            0.8 * circleRadius * Math.cos(angle * i - Math.PI / 2) +
            circleRadius -
            letterWidth / 4;
          let y =
            0.8 * circleRadius * Math.sin(angle * i - Math.PI / 2) +
            circleRadius -
            letterWidth / 4;
          return (
            <div
              className="flex justify-center items-center"
              key={`letter${i}`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                position: "absolute",
              }}
            >
              <LetterNode
                id={`letter${i}_${letter}`}
                letter={letter}
                letterID={`letter${i}_${letter}`}
                letterWidth={letterWidth}
                usedLetterIDs={usedLetterIDs}
                setUsedLetterIDs={setUsedLetterIDs}
                arrows={arrows}
                setArrows={setArrows}
                onDragEnd={onDragEnd}
                themeColor={themeColor}
              />
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
          color={themeColor}
        />
      ))}
      <div className="flex flex-col items-center justify-center">
        <h1
          className={`text-2xl text-slate-50 my-1 px-2 rounded-2xl font-semibold bg-[${themeColor}]/80`}
        >
          HELLO
        </h1>
        {GetCircleLayout(letters)}
      </div>
    </>
  );
};

export default WordCircle;
