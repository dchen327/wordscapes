import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import Draggable from "react-draggable";
import Xarrow, { useXarrow } from "react-xarrows";

const LetterDraggable = ({ startNodeID }) => {
  const draggableRef = useRef(null);
  const updateXArrow = useXarrow();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "invisible-dragger",
      item: { type: "invisible-dragger", source: startNodeID },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    []
  );

  return (
    <>
      {/* <Draggable onDrag={updateXArrow}> */}
      {/* <Draggable onStart={() => setIsDragging(true)} onDrag={updateXArrow}></Draggable> */}
      <div
        ref={drag}
        style={{
          width: "25",
          height: "25px",
          backgroundColor: "rgb(135, 200, 200)",
          borderRadius: "25%",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <p ref={draggableRef}>drag</p>
      </div>
      {/* {isDragging && (
        <Xarrow
          start={startNodeID}
          end={draggableRef}
          path="straight"
          startAnchor="middle"
          endAnchor="middle"
        />
      )} */}
    </>
  );
};

export default LetterDraggable;

// const LetterDraggable = ({ startNodeID }) => {
//   const draggableRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const updateXArrow = useXarrow();

//   return (
//     <>
//       <Draggable onStart={() => setIsDragging(true)} onDrag={updateXArrow}>
//         <div
//           style={{
//             width: "25",
//             height: "25px",
//             backgroundColor: "rgb(135, 200, 200)",
//             borderRadius: "25%",
//             opacity: isDragging ? 0.5 : 1,
//           }}
//         >
//           <p ref={draggableRef}>drag</p>
//         </div>
//       </Draggable>
//       {isDragging && (
//         <Xarrow
//           start={startNodeID}
//           end={draggableRef}
//           path="straight"
//           startAnchor="middle"
//           endAnchor="middle"
//         />
//       )}
//     </>
//   );
// };

// export default LetterDraggable;
