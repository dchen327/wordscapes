import { useRef } from "react";
import { useDragLayer } from "react-dnd";
import Xarrow from "react-xarrows";

function CustomDragLayer() {
  const customDragRef = useRef(null);
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  console.log(item, initialOffset, currentOffset);

  if (!isDragging) {
    return null;
  }

  return (
    <>
      <div
        ref={customDragRef}
        style={getDragLayerStyles(initialOffset, currentOffset)}
      ></div>
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

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
    backgroundColor: "rgb(135, 200, 200)",
  };
}

export default CustomDragLayer;
