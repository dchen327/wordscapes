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
    // when drag starts, add letterID to selectedLetterIDs
    setSelectedLetterIDs([letterID]);
    letterIDsToWord([letterID]);
    // return item for useDrag hook
    return { type: "invisible-dragger", source: letterID };
  };

  const [collected, drag, dragPreview] = useDrag(
    () => ({
      type: "invisible-dragger",
      item: beginDrag,
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
      hover: (item) => {
        if (item.source !== letterID) {
          if (!selectedLetterIDs.includes(letterID)) {
            const newSelectedLetterIDs = [...selectedLetterIDs, letterID];
            setSelectedLetterIDs(newSelectedLetterIDs);
            letterIDsToWord(newSelectedLetterIDs);
            item.source = letterID;
          } else if (
            selectedLetterIDs.length > 1 &&
            selectedLetterIDs[selectedLetterIDs.length - 2] === letterID
          ) {
            // undoing first drag (pop from end of list), set arrow source
            item.source = selectedLetterIDs[selectedLetterIDs.length - 2];
            const newSelectedLetterIDs = selectedLetterIDs.slice(
              0,
              selectedLetterIDs.length - 1
            );
            setSelectedLetterIDs(newSelectedLetterIDs);
            letterIDsToWord(newSelectedLetterIDs);
          }
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
            ? themeColor
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
