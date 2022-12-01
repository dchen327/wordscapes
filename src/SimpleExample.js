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
