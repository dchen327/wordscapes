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

- onMouseMove event doesn't work on mobile
- create a single draggable from the start, track where it goes to draw current arrow?

- https://www.npmjs.com/package/react-swipeable?

- maybe don't use dnd, just use onDrag and track mousePosition, draw arrow
accordingly and track onDragOver to start new arrow?
- mousedown -> track mousemove -> track mouseup (submit word)


dnd:
https://www.npmjs.com/package/react-dnd-multi-backend (switch desktop/mobile)
react-dnd: drag invisible circle "connector"


Game Features:
- hint: reveals a definition of an uncomplete word


dnd:
isDragging -> getSourceClientOffset -> use to calculate offset for arrow div
CustomDragLayer needs getInitialClientOffset from useDrag 
grab item dimensions somehow or store in variables to track offsets
issue: on desktop
only use ID's for arrows, refs for dnd?
the div for active cursor position is added under all the other divs -> offset

store letter in LetterNode, add to lettersArray in WordCircle when hover

TODO:
- deploy and test on mobile
- can't use same letter multiple times (maybe refactor so letter_IDs are tracked as well)
- allow for undoing last path (check last arrow, if curr arrow is flipped then remove last arrow
- don't hardcode all the sizes
- highlight used letters (flip text color from black to white)