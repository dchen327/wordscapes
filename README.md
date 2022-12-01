# Wordscapes++
## TODO:
- upper bound on num of 4 letter words
- faster can_insert/is_valid? refactor?
- refactor main loop


WEB:
- https://stackoverflow.com/questions/62408529/react-drag-drop-and-connect-arrowor-anything-else-with-animation-between-elem
- react draggable + xarrow?
  - store list of arrows, highlight circle when mouse over
  - remove arrow if you drag back over
  - onDragEnd fired from the source of drag, onDrop fired from target dropped on
    - onDragEnd fired from connector, onDrop fired from box
  - don't use box? just use connectors?
  - can't get info in onDragOver event? (onDragStart not guaranteed to have been called)
    - onDragStart doesn't finish setting state, no e.dataTransfer to grab current arrow
- https://codesandbox.io/s/so-drag-anim-optimization-forked-4ossxb?file=/src/Example2.jsx:1766-1810&resolutionWidth=320&resolutionHeight=675
- letters in a circle component
  - polar, cos, sin, center in component


- maybe don't use dnd, just use onDrag and track mousePosition, draw arrow
accordingly and track onDragOver to start new arrow?