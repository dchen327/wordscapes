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

  // console.log(item, initialOffset, currentOffset);

  if (!isDragging) {
    return null;
  }

  return (
    <>
      <div
        ref={customDragRef}
        style={getDragLayerStyles(initialOffset, currentOffset)}
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

  // let xi = initialOffset.x;
  // let yi = initialOffset.y;
  let { x, y } = currentOffset;
  // console.log(initialOffset, currentOffset);
  const transform = `translate(${x}px, ${y - 100}px)`;
  return {
    transform,
    WebkitTransform: transform,
    backgroundColor: "rgb(135, 200, 100)",
    width: "20px",
  };
}

export default CustomDragLayer;
