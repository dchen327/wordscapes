import { useCallback, useState } from "react";
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
import useTransition from "react-transition-state";

const WordCircle = ({
  words,
  bonusWords,
  letters,
  setLetters,
  completeGrid,
  grid,
  setGrid,
  foundBonusWords,
  setFoundBonusWords,
  setShowBonusWords,
  themeColor,
  setThemeColor,
  levelComplete,
  getNextLevel,
  shuffleArray,
  defineMode,
  setDefineMode,
  toggleRevealAnim,
  setCurrRevealedIdxs,
  setRevealAnimClass,
}) => {
  const [selectedLetterIDs, setSelectedLetterIDs] = useState([]);
  const [inputtedWord, setInputtedWord] = useState("");
  const [inputtedWordBGColor, setInputtedWordBGColor] = useState(themeColor);
  const circleRadius = Math.min(120, (window.innerWidth - 200) / 2);
  const letterWidth = circleRadius / 2;
  const [inputtedWordAnimClass, setInputtedWordAnimClass] = useState("");
  const [inputtedAnimState, toggleInputtedAnim] = useTransition({
    timeout: 500,
  });
  const [bonusWordAnimClass, setBonusWordAnimClass] = useState("");
  const [bonusWordAnimState, toggleBonusWordAnim] = useTransition({
    timeout: 500,
  });

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
    let clearTime = 1000; // time to wait before clearing
    if (selectedLetterIDs.length > 0) {
      const word = letterIDsToWord(selectedLetterIDs);
      setSelectedLetterIDs([]);
      setInputtedWord(word);

      if (Object.keys(words).includes(word)) {
        // word is correct (could already be entered)
        setInputtedWordAnimClass("animate-pulse animate-faster");
        if (enterWord(word)) {
          setInputtedWordBGColor("#34D399");
        } else {
          // word is a duplicate (will be animated in the grid)
          setInputtedWordBGColor("#F87171");
        }
      } else if (bonusWords.includes(word)) {
        // bonus word
        setInputtedWordAnimClass("animate-pulse animate-faster");
        toggleBonusWordAnim(true); // flash bonus circle
        // check if already found
        if (!foundBonusWords.includes(word)) {
          setFoundBonusWords([...foundBonusWords, word]);
          setInputtedWordBGColor("#60A5FA");
          setBonusWordAnimClass("animate-bounce");
        } else {
          // duplicate bonus
          setInputtedWordBGColor("#F87171");
          setBonusWordAnimClass("animate-headShake");
        }
      } else {
        setInputtedWordAnimClass("animate-headShake");
        setInputtedWordBGColor("#F87171");
      }

      toggleInputtedAnim(true);
      setTimeout(() => {
        setInputtedWord("");
        setInputtedWordBGColor(themeColor);
        setInputtedWordAnimClass("");
        toggleInputtedAnim(false);

        if (levelComplete(grid)) {
          getNextLevel();
        }
      }, clearTime);
    }
  };

  const enterWord = useCallback(
    (word) => {
      // enter word into crossword, return true if word was not already there
      let [r, c, horiz] = words[word];
      let wordArray = word.split("");
      let changeMade = false;
      const allAnimDelays = new Map();
      const newLetterAnimDelays = new Map();
      if (horiz) {
        wordArray.forEach((letter, i) => {
          if (grid[r][c + i] === "_") {
            changeMade = true;
            newLetterAnimDelays.set(r * grid[0].length + c + i, 150 * i);
          }
          allAnimDelays.set(r * grid[0].length + c + i, 150 * i);
          grid[r][c + i] = letter;
        });
      } else {
        wordArray.forEach((letter, i) => {
          if (grid[r + i][c] === "_") {
            changeMade = true;
            newLetterAnimDelays.set((r + i) * grid[0].length + c, 150 * i);
          }
          allAnimDelays.set((r + i) * grid[0].length + c, 150 * i);
          grid[r + i][c] = letter;
        });
      }

      toggleRevealAnim(true);
      if (changeMade) {
        setInputtedWord(word);
        setGrid(grid);
        setCurrRevealedIdxs(newLetterAnimDelays);
        setRevealAnimClass(horiz ? "animate-backInUp" : "animate-backInRight");
        return true;
      } else {
        // already in grid
        setCurrRevealedIdxs(allAnimDelays);
        setRevealAnimClass("animate-flash");
        return false;
      }
    },
    [
      words,
      grid,
      setGrid,
      toggleRevealAnim,
      setCurrRevealedIdxs,
      setRevealAnimClass,
    ]
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
    const revealedIdxs = new Map();
    const newGrid = [...grid];
    for (let i = 0; i < numLetters && i < allEmptyCoords.length; i++) {
      let [r, c] = allEmptyCoords[i];
      newGrid[r][c] = completeGrid[r][c];
      revealedIdxs.set(r * grid[0].length + c, 0);
    }

    setGrid(newGrid);
    setCurrRevealedIdxs(revealedIdxs);
    setRevealAnimClass("animate-rollIn");
    toggleRevealAnim(true);
    // if grid is complete, move to next level
    if (levelComplete(newGrid)) {
      // wait a bit before moving to next level
      getNextLevel(500);
    }
  };

  const GetCircleLayout = (letters) => {
    let circleWidth = 2 * (circleRadius + letterWidth / 4);
    return (
      <div
        className="relative rounded-full z-0"
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
            0.85 * circleRadius * Math.cos(angle * i - Math.PI / 2) +
            circleRadius -
            letterWidth / 4;
          let y =
            0.85 * circleRadius * Math.sin(angle * i - Math.PI / 2) +
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
    <>
      <div className="flex mb-20 w-full justify-evenly">
        <div className="flex flex-col justify-start mt-10">
          <button
            className="my-1 w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full select-none"
            onClick={shuffleLetters}
          >
            <FontAwesomeIcon icon={faShuffle} size="xl" />
          </button>
          <button
            className="my-1 w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full select-none"
            onClick={() => setDefineMode(!defineMode)}
          >
            <FontAwesomeIcon icon={faCrosshairs} size="xl" />
          </button>
          <button
            key={foundBonusWords.length}
            className={`mt-auto w-[50px] aspect-square text-center text-slate-50 bg-slate-700 p-1 bg-opacity-25 border rounded-full select-none ${
              bonusWordAnimState.status === "entering" ||
              bonusWordAnimState.status === "entered"
                ? bonusWordAnimClass
                : ""
            }`}
            onClick={() => setShowBonusWords(true)}
            onAnimationEnd={() => toggleBonusWordAnim(false)}
          >
            {foundBonusWords.length}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center ">
          <div className="min-h-[2.75rem]">
            <h1
              className={`text-2xl text-slate-50 my-1.5 px-2 rounded-2xl font-semibold ${
                inputtedAnimState.status === "entering" ||
                inputtedAnimState.status === "entered"
                  ? inputtedWordAnimClass
                  : ""
              }`}
              style={{ backgroundColor: inputtedWordBGColor }}
            >
              {inputtedWord}
            </h1>
          </div>
          {GetCircleLayout(letters)}
        </div>

        <div className="flex flex-col justify-start mt-10">
          <button className="my-1 w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full select-none">
            <FontAwesomeIcon
              icon={faLightbulb}
              size="xl"
              onClick={() => revealLetters()}
            />
          </button>
          <button className="my-1 w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full select-none">
            <FontAwesomeIcon
              icon={faBurst}
              size="xl"
              onClick={() => revealLetters(5)}
            />
          </button>
          <button
            className="mt-auto w-[50px] aspect-square text-slate-50 bg-slate-700 bg-opacity-25 border rounded-full select-none"
            onClick={getNextLevel}
          >
            <FontAwesomeIcon icon={faForward} size="xl" />
          </button>
        </div>
      </div>
    </>
  );
};

export default WordCircle;
