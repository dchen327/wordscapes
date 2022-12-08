import { useDrag } from "react-dnd";

const LetterDraggable = ({ startNodeID, letter, arrows, onDragEnd }) => {
  const [, drag] = useDrag(
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

  return (
    <>
      <div
        className="columns is-centered is-vcentered"
        ref={drag}
        style={{
          minWidth: "100px",
          minHeight: "100px",
          height: "same-as-width",
          backgroundColor: "rgb(135, 200, 200)",
          borderRadius: "50%",
        }}
      >
        <h1 className="title">{letter}</h1>
      </div>
    </>
  );
};

export default LetterDraggable;
