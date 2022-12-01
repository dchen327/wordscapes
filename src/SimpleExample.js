import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";
import { disableBodyScroll } from "body-scroll-lock";

const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "15px",
  margin: "50px",
};

function SimpleExample() {
  // disable body scroll
  disableBodyScroll(document.body);
  return (
    <>
      <LetterCircle />
      {/* <br /> */}
      {/* <LetterNode letter={"A"} /> */}
      <div style={boxStyle}>
        <div id="elem1" style={boxStyle}>
          hey
        </div>
        <p id="elem2" style={boxStyle}>
          hey2
        </p>
        <Xarrow
          start="elem1"
          end="elem2"
          showHead={false}
          startAnchor="middle"
          endAnchor="middle"
        />
      </div>
    </>
  );
}

const LetterNode = ({
  letter,
  addArrow,
  dragging,
  setDragging,
  arrowStartRef,
  setArrowStartRef,
}) => {
  const ref = useRef(null);

  return (
    <div
      className="button"
      ref={ref}
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: "rgb(205, 209, 228)",
        borderRadius: "50%",
      }}
      onMouseDown={(e) => {
        // console.log mouse position
        console.log(e.clientX, e.clientY);
        setArrowStartRef(ref);
        setDragging(true);
      }}
      onMouseOver={(e) => {
        if (dragging) {
          if (ref !== arrowStartRef) {
            console.log(arrowStartRef, ref);
            addArrow({ start: arrowStartRef, end: ref });
            setArrowStartRef(ref);
          }
        }
      }}
    >
      <p style={{ margin: "auto" }}>{letter}</p>
    </div>
  );
};

const LetterCircle = () => {
  const [dragging, setDragging] = useState(false);
  const letters = ["A", "B", "C"];
  const [arrows, setArrows] = useState([]);
  const [arrowStartRef, setArrowStartRef] = useState(null);
  const addArrow = ({ start, end }) => {
    setArrows([...arrows, { start, end }]);
  };

  const onMouseUp = (e) => {
    setDragging(false);
    console.log("mouse up");
  };

  const onMouseMove = (e) => {
    // if (dragging) {
    // }
  };

  return (
    <div className="columns" onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
      {letters.map((letter, i) => (
        <div key={`letter${i}`} className="column">
          <LetterNode
            id={`letter${letter}`}
            letter={letter}
            addArrow={addArrow}
            dragging={dragging}
            setDragging={setDragging}
            arrowStartRef={arrowStartRef}
            setArrowStartRef={setArrowStartRef}
          />
        </div>
      ))}
      {/* {arrowStartRef && <Xarrow start={arrowStartRef} end=} */}
      {arrows.map((arrow, i) => (
        <Xarrow start={arrow.start} end={arrow.end} key={`arrow${i}`} />
      ))}
    </div>
  );
};

export default SimpleExample;
