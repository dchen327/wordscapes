import React, { useRef } from "react";
import Xarrow from "react-xarrows";

const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "15px",
  margin: "50px",
};

function SimpleExample() {
  return (
    <>
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

export default SimpleExample;
