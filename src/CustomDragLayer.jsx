import { useRef } from "react";
import { useDragLayer } from "react-dnd";
import Xarrow from "react-xarrows";

function CustomDragLayer({ themeColor }) {
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
    <div className="fixed left-0 top-0">
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
          color={themeColor}
        />
      )}
    </div>
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
  };
}

export default CustomDragLayer;
