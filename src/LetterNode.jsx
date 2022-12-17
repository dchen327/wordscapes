import { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

function LetterNode({
  letter,
  letterID,
  letterWidth,
  usedLetterIDs,
  setUsedLetterIDs,
  arrows,
  setArrows,
  onDragEnd,
  themeColor,
}) {
  const [, drop] = useDrop(
    () => ({
      accept: "invisible-dragger",
      hover: (item) => {
        // don't do anything when hover immediately triggered
        if (item.source !== letterID) {
          // isDragging is used to determine starting letterNode
          if (!usedLetterIDs[letterID] && !isDragging) {
            let newArrow = { start: item.source, end: letterID };
            if (arrows && newArrow !== arrows[arrows.length - 1]) {
              setArrows([...arrows, newArrow]);
              // set letter to true
              setUsedLetterIDs({ ...usedLetterIDs, [newArrow.end]: true });
            }
            item.source = letterID;
          } else {
            // undoing first drag
            if (arrows.length === 1) {
              setArrows([]);
              setUsedLetterIDs({
                ...usedLetterIDs,
                [item.source]: false,
                [letterID]: false,
              });
              item.source = letterID;
            }
            // if letter is already used, remove the last arrow
            if (arrows.length > 1) {
              let arrowMin1 = arrows[arrows.length - 1];
              let arrowMin2 = arrows[arrows.length - 2];
              if (
                arrowMin1.start === letterID &&
                arrowMin1.end === item.source
              ) {
                let newArrows = arrows.slice(0, arrows.length - 2);
                setArrows(newArrows);
                // set letter to false
                setUsedLetterIDs({
                  ...usedLetterIDs,
                  [item.source]: false,
                  [letterID]: false,
                });
                item.source = arrowMin2.start;
              }
            }
          }
        }
      },
    }),
    [arrows, usedLetterIDs]
  );

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "invisible-dragger",
      item: { type: "invisible-dragger", source: letterID },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: () => {
        onDragEnd();
      },
    }),
    [arrows]
  );

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  });

  useEffect(() => {
    if (isDragging) document.body.style.cursor = "grab !important";
    else document.body.style.cursor = "normal";
  }, [isDragging]);

  return (
    <>
      <div
        className={`rounded-full ${
          usedLetterIDs[letterID] ? "text-slate-50" : "text-gray-900"
        }`}
        ref={drop}
        id={letterID}
        style={{
          width: `${letterWidth}px`,
          height: `${letterWidth}px`,
          backgroundColor: usedLetterIDs[letterID]
            ? `${themeColor}`
            : "transparent",
        }}
      >
        <div
          className={`flex justify-center items-center rounded-full ${
            isDragging ? "text-slate-50" : "inherit"
          }`}
          ref={drag}
          style={{
            height: `${letterWidth}px`,
            backgroundColor: isDragging ? `${themeColor}` : "transparent",
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
