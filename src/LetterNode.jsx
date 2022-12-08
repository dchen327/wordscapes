import { useDrop } from "react-dnd";
import LetterDraggable from "./LetterDraggable";

const LetterNode = ({ letter, letterID, arrows, setArrows, onDragEnd }) => {
  const [, drop] = useDrop(
    () => ({
      accept: "invisible-dragger",
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      hover: (item) => {
        if (item.source !== letterID) {
          let newArrow = { start: item.source, end: letterID };
          if (arrows && newArrow !== arrows[arrows.length - 1]) {
            setArrows([...arrows, newArrow]);
          }
        }
        item.source = letterID;
      },
    }),
    [arrows]
  );

  return (
    <>
      <div
        className="columns is-centered is-vcentered"
        ref={drop}
        id={letterID}
        style={{
          width: "100px",
          height: "100px",
          // backgroundColor: "rgb(205, 209, 228)",
          borderRadius: "50%",
        }}
      >
        <LetterDraggable
          startNodeID={letterID}
          letter={letter}
          arrows={arrows}
          onDragEnd={onDragEnd}
        />
      </div>
    </>
  );
};

export default LetterNode;
