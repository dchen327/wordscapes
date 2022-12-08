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
    <div style={{ position: "fixed", left: 0, top: 0 }}>
      <div
        ref={customDragRef}
        style={getDragLayerStyles(initialOffset, currentOffset)}
      />
      {item.source && (
        <Xarrow
          start={item.source}
          end={customDragRef}
          path="straight"
          startAnchor="middle"
          endAnchor="middle"
          showHead={false}
          strokeWidth={8}
          color="#67B7D1"
        />
      )}
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
  // const transform = `translate(${x - 12}px, ${y - 225}px)`;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export default CustomDragLayer;
