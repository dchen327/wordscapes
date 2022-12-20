import { useState } from "react";
import LetterNode from "./LetterNode";
import Xarrow from "react-xarrows";
import { disableBodyScroll } from "body-scroll-lock";
import CustomDragLayer from "./CustomDragLayer";

const WordCircle = ({
  words,
  letters,
  completeGrid,
  grid,
  setGrid,
  wordsFound,
  setWordsFound,
  themeColor,
  setThemeColor,
  getNextLevel,
}) => {
  const [selectedLetterIDs, setSelectedLetterIDs] = useState([]);
  const [inputtedWord, setInputtedWord] = useState("");
  const circleRadius = Math.min(120, (window.innerWidth - 200) / 2);
  const letterWidth = circleRadius / 2;

  disableBodyScroll(document.body);

  const letterIDsToWord = (selectedLetterIDs) => {
    let lettersArray = [];
    selectedLetterIDs.forEach((letterID) => {
      lettersArray.push(letterID.split("_")[1]);
    });
    const word = lettersArray.join("");
    setInputtedWord(word);
    return word;
  };

  const onDragEnd = () => {
    let clearTime = 500; // time to wait before clearing
    if (selectedLetterIDs.length > 0) {
      const word = letterIDsToWord(selectedLetterIDs);
      setSelectedLetterIDs([]);
      setInputtedWord(word);

      // update grid if word is present
      if (enterWord(word)) {
        clearTime = 3000; // longer for correct words
      }

      // check if level is complete
      if (levelComplete(grid)) {
        // setThemeColor("#34D399");
        getNextLevel();
      } else {
        // clear the inputted word after some time
        setTimeout(() => {
          setInputtedWord("");
        }, clearTime);
      }
    }
  };

  const enterWord = (word) => {
    // enter word into crossword, return true if word was not already there
    if (Object.keys(words).includes(word)) {
      let [r, c, horiz] = words[word];
      let wordArray = word.split("");
      let changeMade;
      if (horiz) {
        wordArray.forEach((letter, i) => {
          if (grid[r][c + i] === "_") {
            changeMade = true;
          }
          grid[r][c + i] = letter;
        });
      } else {
        wordArray.forEach((letter, i) => {
          if (grid[r + i][c] === "_") {
            changeMade = true;
          }
          grid[r + i][c] = letter;
        });
      }

      if (changeMade) {
        setWordsFound(wordsFound + 1);
        setGrid(grid);
        delete words[word];
        setInputtedWord(word);
        return true;
      }
      return false;
    }
  };

  const levelComplete = (grid) => {
    // ensure grid === completeGrid
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] !== completeGrid[r][c]) {
          return false;
        }
      }
    }
    return true;
  };

  const GetCircleLayout = (letters) => {
    let circleWidth = 2 * (circleRadius + letterWidth / 4);
    return (
      <div
        className="relative rounded-full mb-10 z-0"
        style={{
          backgroundColor: "rgba(205, 209, 230, 0.9)",
          width: circleWidth,
          height: circleWidth,
        }}
      >
        {/* Draw arrows from selectedLetterIDs, use index i as start and i+1 as end */}
        {selectedLetterIDs.map((letterID, i) => {
          return (
            i < selectedLetterIDs.length - 1 && (
              <Xarrow
                start={letterID}
                end={selectedLetterIDs[i + 1]}
                key={`arrow${i}`}
                path="straight"
                startAnchor="middle"
                endAnchor="middle"
                showHead={false}
                strokeWidth={8}
                color={themeColor}
              />
            )
          );
        })}
        {/* All arrows must be before letters to appear under the letters */}
        <CustomDragLayer themeColor={themeColor} />
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
                onDragEnd={onDragEnd}
                themeColor={themeColor}
                letterIDsToWord={letterIDsToWord}
                selectedLetterIDs={selectedLetterIDs}
                setSelectedLetterIDs={setSelectedLetterIDs}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center ">
        <div className="min-h-[2.5rem]">
          <h1
            className={
              "text-2xl text-slate-50 my-2 px-2 rounded-2xl font-semibold"
            }
            style={{ backgroundColor: themeColor }}
          >
            {inputtedWord}
          </h1>
        </div>
        {GetCircleLayout(letters)}
      </div>
    </>
  );
};

export default WordCircle;
