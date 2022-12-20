import { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

function LetterNode({
  letter,
  letterID,
  letterWidth,
  onDragEnd,
  themeColor,
  letterIDsToWord,
  selectedLetterIDs,
  setSelectedLetterIDs,
}) {
  const beginDrag = () => {
    setSelectedLetterIDs([...selectedLetterIDs, letterID]);
    letterIDsToWord([...selectedLetterIDs, letterID]);
    return { type: "invisible-dragger", source: letterID };
  };

  const [collected, drag, dragPreview] = useDrag(
    () => ({
      type: "invisible-dragger",
      // set to false when drag starts using item as function
      item: beginDrag,
      // item: { type: "invisible-dragger", source: letterID },
      collect: (monitor) => ({
        dragging: !!monitor.isDragging(),
      }),
      end: () => {
        onDragEnd();
      },
    }),
    [selectedLetterIDs]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "invisible-dragger",
      // hover: (item) => {
      //   // don't do anything when hover immediately triggered
      //   if (item.source !== letterID) {
      //     // dragging is used to determine starting letterNode
      //     if (!usedLetterIDs[letterID]) {
      //       let newArrow = { start: item.source, end: letterID };
      //       if (arrows && newArrow !== arrows[arrows.length - 1]) {
      //         setArrows([...arrows, newArrow]);
      //         // set letter to true
      //         setUsedLetterIDs({ ...usedLetterIDs, [newArrow.end]: true });
      //         findWordFromArrows([...arrows, newArrow]);
      //       }
      //       item.source = letterID;
      //     } else {
      //       // undoing first drag
      //       if (arrows.length === 1) {
      //         setArrows([]);
      //         setUsedLetterIDs({
      //           ...usedLetterIDs,
      //           [item.source]: false,
      //           [letterID]: false,
      //         });
      //         item.source = letterID;
      //       }
      //       // if letter is already used, remove the last arrow
      //       if (arrows.length > 1) {
      //         let arrowMin1 = arrows[arrows.length - 1];
      //         let arrowMin2 = arrows[arrows.length - 2];
      //         if (
      //           arrowMin1.start === letterID &&
      //           arrowMin1.end === item.source
      //         ) {
      //           let newArrows = arrows.slice(0, arrows.length - 2);
      //           setArrows(newArrows);
      //           // set letter to false
      //           setUsedLetterIDs({
      //             ...usedLetterIDs,
      //             [item.source]: false,
      //             [letterID]: false,
      //           });
      //           findWordFromArrows(newArrows);
      //           item.source = arrowMin2.start;
      //         }
      //       }
      //     }
      //   }
      // },
      hover: (item) => {
        // don't do anything when hover immediately triggered
        if (item.source !== letterID) {
          if (!selectedLetterIDs.includes(letterID)) {
            const newSelectedLetterIDs = [...selectedLetterIDs, letterID];
            setSelectedLetterIDs(newSelectedLetterIDs);
            // console.log(newSelectedLetterIDs);
            letterIDsToWord(newSelectedLetterIDs);
          }
          item.source = letterID;
        } else {
          // undoing first drag
        }
      },
    }),
    [selectedLetterIDs]
  );

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  });

  useEffect(() => {
    if (collected.dragging) document.body.style.cursor = "grab !important";
    else document.body.style.cursor = "normal";
  }, [collected.dragging]);

  return (
    <>
      <div
        className={`rounded-full ${
          selectedLetterIDs.includes(letterID)
            ? "text-slate-50"
            : "text-gray-900"
        }`}
        ref={drop}
        id={letterID}
        style={{
          width: `${letterWidth}px`,
          height: `${letterWidth}px`,
          backgroundColor: selectedLetterIDs.includes(letterID)
            ? `${themeColor}`
            : "transparent",
        }}
      >
        <div
          className={"flex justify-center items-center rounded-full"}
          ref={drag}
          style={{
            height: `${letterWidth}px`,
          }}
        >
          <h1
            className="font-sans font-semibold"
            style={{ fontSize: `${letterWidth / 1.2}px` }}
          >
            {letter}
          </h1>
        </div>
      </div>
    </>
  );
}

export default LetterNode;
