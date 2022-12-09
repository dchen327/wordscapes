import { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

const LetterDraggable = ({ letterID, letter, arrows, onDragEnd }) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "invisible-dragger",
      item: { type: "invisible-dragger", source: letterID },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end: (item, monitor) => {
        onDragEnd();
      },
    }),
    [arrows]
  );

  useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  });

  return (
    <>
      <div
        className={`flex items-center justify-center ${
          isDragging ? "text-slate-50" : "inherit"
        }`}
        ref={drag}
        style={{
          minWidth: "80px",
          minHeight: "80px",
          height: "same-as-width",
          backgroundColor: isDragging ? "#67B7D1" : "transparent",
          borderRadius: "50%",
        }}
      >
        <h1 className="text-4xl font-semibold">{letter}</h1>
      </div>
    </>
  );
};

export default LetterDraggable;
