import { useCallback, useEffect, useState } from "react";
import LetterNode from "./LetterNode";
import Xarrow from "react-xarrows";
import CustomDragLayer from "./CustomDragLayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBurst,
  faCrosshairs,
  faForward,
  faLightbulb,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";

const WordCircle = ({
  words,
  letters,
  setLetters,
  completeGrid,
  grid,
  setGrid,
  wordsFound,
  setWordsFound,
  themeColor,
  setThemeColor,
  levelNum,
  levelComplete,
  getNextLevel,
  shuffleArray,
  setDefineMode,
}) => {
  const [selectedLetterIDs, setSelectedLetterIDs] = useState([]);
  const [inputtedWord, setInputtedWord] = useState("");
  const [inputtedWordBGColor, setInputtedWordBGColor] = useState(themeColor);
  const circleRadius = Math.min(120, (window.innerWidth - 200) / 2);
  const letterWidth = circleRadius / 2;

  const letterIDsToWord = (selectedLetterIDs) => {
    let lettersArray = [];
    selectedLetterIDs.forEach((letterID) => {
      lettersArray.push(letterID.split("_")[1]);
    });
    const word = lettersArray.join("");
    setInputtedWord(word);
    setInputtedWordBGColor(themeColor);
    return word;
  };

  const onDragEnd = () => {
    let clearTime; // time to wait before clearing
    if (selectedLetterIDs.length > 0) {
      const word = letterIDsToWord(selectedLetterIDs);
      setSelectedLetterIDs([]);
      setInputtedWord(word);

      // update grid if word is present
      if (enterWord(word)) {
        clearTime = 3000; // longer for correct words
        setInputtedWordBGColor("#34D399");
      } else {
        clearTime = 1000; // shorter for incorrect words
        setInputtedWordBGColor("#F87171");
      }

      // check if level is complete
      if (levelComplete(grid)) {
        setInputtedWord("");
        setInputtedWordBGColor(themeColor);
        getNextLevel();
      } else {
        // clear the inputted word after some time
        setTimeout(() => {
          setInputtedWord("");
          setInputtedWordBGColor(themeColor);
        }, clearTime);
      }
    }
  };

  const enterWord = useCallback(
    (word) => {
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
    },
    [words, grid, setGrid, wordsFound, setWordsFound]
  );

  const shuffleLetters = () => {
    let newLetters = [...letters];
    shuffleArray(newLetters);
    setLetters(newLetters);
  };

  const revealLetters = (numLetters = 1) => {
    // reveal numLetters letters
    // loop through 2d grid, find _ and pick random ones to reveal with complete grid
    const allEmptyCoords = []; // coords of covered letters
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        if (grid[r][c] === "_") {
          allEmptyCoords.push([r, c]);
        }
      }
    }
    shuffleArray(allEmptyCoords);

    // reveal random letters
    const newGrid = [...grid];
    for (let i = 0; i < numLetters && i < allEmptyCoords.length; i++) {
      let [r, c] = allEmptyCoords[i];
      newGrid[r][c] = completeGrid[r][c];
    }
    // if grid is complete, move to next level
    if (levelComplete(newGrid)) {
      getNextLevel();
    } else {
      setGrid(newGrid);
    }
  };

  const GetCircleLayout = (letters) => {
    let circleWidth = 2 * (circleRadius + letterWidth / 4);
    return (
      <div
        className="relative rounded-full mb-20 z-0"
        style={{
          backgroundColor: "rgba(205, 209, 230, 0.9)",
          width: circleWidth,
          height: circleWidth,
        }}
      >
        {/* Draw arrows from selectedLetterIDs, use index i as start and i+1 as end */}
        {selectedLetterIDs.length > 1 &&
          selectedLetterIDs.map((letterID, i) => {
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
                letterID={`letter${i}_${letter}`}
                {...{
                  letter,
                  letterWidth,
                  onDragEnd,
                  themeColor,
                  letterIDsToWord,
                  selectedLetterIDs,
                  setSelectedLetterIDs,
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // level debugging, auto enter all words except last
  // useEffect(() => {
  //   // loop through all but 1 word in words and enterWord
  //   let wordsArray = Object.keys(words);
  //   for (let i = 0; i < wordsArray.length - 1; i++) {
  //     enterWord(wordsArray[i]);
  //   }
  //   console.log(wordsArray[wordsArray.length - 1]);
  // }, [words, enterWord]);

  return (
    <div className="flex justify-evenly w-full">
      <div className="flex flex-col justify-start my-10">
        <button
          className="my-1 w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full"
          onClick={shuffleLetters}
        >
          <FontAwesomeIcon icon={faShuffle} size="lg" />
        </button>
        <button
          className="my-1 w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full"
          onClick={() => setDefineMode(false)}
        >
          <FontAwesomeIcon icon={faCrosshairs} size="lg" />
        </button>
        <button
          className="mt-auto w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full"
          onClick={getNextLevel}
        >
          <FontAwesomeIcon icon={faForward} size="lg" />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center ">
        <div className="min-h-[2.75rem]">
          <h1
            className={
              "text-2xl text-slate-50 my-1.5 px-2 rounded-2xl font-semibold"
            }
            style={{ backgroundColor: inputtedWordBGColor }}
          >
            {inputtedWord}
          </h1>
        </div>
        {GetCircleLayout(letters)}
      </div>
      <div className="flex flex-col justify-start my-10">
        <button className="my-1 w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full">
          <FontAwesomeIcon
            icon={faLightbulb}
            size="lg"
            onClick={() => revealLetters()}
          />
        </button>
        <button className="my-1 w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full">
          <FontAwesomeIcon
            icon={faBurst}
            size="lg"
            onClick={() => revealLetters(5)}
          />
        </button>
        <div className="mt-auto w-[50px] py-1 text-center text-slate-50 bg-slate-700 p-1 bg-opacity-75 rounded">
          Level {levelNum}
        </div>
      </div>
    </div>
  );
};

export default WordCircle;
