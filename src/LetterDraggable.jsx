import { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

const LetterDraggable = ({ startNodeID, letter, arrows, onDragEnd }) => {
  const [, drag, dragPreview] = useDrag(
    () => ({
      type: "invisible-dragger",
      item: { type: "invisible-dragger", source: startNodeID },
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
        ref={drag}
        style={{
          minWidth: "100px",
          minHeight: "100px",
          height: "same-as-width",
          // backgroundColor: "rgb(135, 200, 200)",
          borderRadius: "50%",
        }}
      >
        <h1 className="text-3xl font-bold underline">{letter}</h1>
      </div>
    </>
  );
};

export default LetterDraggable;
