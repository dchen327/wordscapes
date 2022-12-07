import { useRef } from "react";
import { useDragLayer } from "react-dnd";
import Xarrow from "react-xarrows";

function CustomDragLayer() {
  const customDragRef = useRef(null);
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    initialSourceOffset,
    clientOffset,
    differenceFromInitialSource,
    sourceClientOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialClientOffset(),
    initialSourceOffset: monitor.getInitialSourceClientOffset(),
    clientOffset: monitor.getClientOffset(),
    differenceFromInitialSource: monitor.getDifferenceFromInitialOffset(),
    sourceClientOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  // console.log(item?.source);

  if (!isDragging) {
    return null;
  }

  console.log(
    // initialOffset,
    // initialSourceOffset,
    clientOffset,
    // differenceFromInitialSource,
    sourceClientOffset
  );

  return (
    <>
      <div
        ref={customDragRef}
        style={getDragLayerStyles(initialOffset, clientOffset)}
      >
        <div style={{ width: "10px" }}>hi</div>
      </div>
      <Xarrow
        start={item.source}
        end={customDragRef}
        path="straight"
        startAnchor="middle"
        endAnchor="middle"
      />
    </>
  );
}

function getDragLayerStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }
  let { x, y } = currentOffset;
  // console.log(initialOffset, currentOffset);
  const transform = `translate(${x - 12}px, ${y - 225}px)`;
  return {
    transform,
    WebkitTransform: transform,
    backgroundColor: "rgb(135, 200, 100)",
    width: "20px",
  };
}

export default CustomDragLayer;
