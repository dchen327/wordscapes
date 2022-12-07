import { useRef } from "react";
import { useDragLayer } from "react-dnd";
import Xarrow from "react-xarrows";

function CustomDragLayer() {
  const customDragRef = useRef(null);
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      initialOffset: monitor.getInitialClientOffset(),
      currentOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  if (!isDragging) {
    return null;
  }

  return (
    <div>
      <div
        ref={customDragRef}
        style={getDragLayerStyles(initialOffset, currentOffset)}
      >
        <div>hi</div>
      </div>
      <Xarrow
        start={item.source}
        end={customDragRef}
        path="straight"
        startAnchor="middle"
        endAnchor="middle"
      />
    </div>
  );
}

function getDragLayerStyles(initialOffset, currentOffset) {
  // console.log(initialOffset, currentOffset);
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }
  let { x, y } = currentOffset;
  const transform = `translate(${x - 12}px, ${y - 225}px)`;
  return {
    transform,
    WebkitTransform: transform,
    backgroundColor: "rgb(135, 200, 100)",
    width: "20px",
  };
}

export default CustomDragLayer;
