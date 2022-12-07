import { useDragLayer } from "react-dnd";

function CustomDragLayer() {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  console.log(initialOffset, currentOffset);

  if (!isDragging) {
    return null;
  }

  return (
    <div className="draglayer">
      <p>hi</p>
    </div>
  );
}

export default CustomDragLayer;
