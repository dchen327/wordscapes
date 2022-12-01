import "bulma/css/bulma.min.css";
import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";
import SimpleExample from "./SimpleExample";

const connectPointStyle = {
  position: "absolute",
  width: 15,
  height: 15,
  borderRadius: "50%",
  background: "black",
};
const connectPointOffset = {
  left: { left: "0px", top: "50%", transform: "translate(-50%, -50%)" },
  right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
  top: { left: "50%", top: "0px", transform: "translate(-50%, -50%)" },
  bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
};

const ConnectPointsWrapper = ({ boxId, handler, ref0 }) => {
  const ref1 = useRef();

  const [, setPosition] = useState({});
  const [beingDragged, setBeingDragged] = useState(false);
  return (
    <React.Fragment>
      <div
        className="connectPoint"
        style={{
          ...connectPointStyle,
          ...connectPointOffset[handler],
        }}
        draggable
        onDragStart={(e) => {
          setBeingDragged(true);
          e.dataTransfer.setData("arrow", boxId);
        }}
        onDrag={(e) => {
          setPosition({}); // <---- just to force re-rendering, to draw arrow with updated value
          ref1.current.style.position = "fixed";
          ref1.current.style.left = e.clientX + "px";
          ref1.current.style.top = e.clientY + "px";
          ref1.current.style.transform = "none";
          ref1.current.style.opacity = 0;
        }}
        ref={ref1}
        onDragEnd={(e) => {
          ref1.current.style.position = "absolute";
          ref1.current.style.left = connectPointOffset[handler].left;
          ref1.current.style.top = connectPointOffset[handler].top;
          ref1.current.style.transform = connectPointOffset[handler].transform;
          ref1.current.style.opacity = 0.5;
          setBeingDragged(false);
        }}
      />
      {beingDragged ? (
        <Xarrow start={ref0} end={ref1} path={"straight"} />
      ) : null}
    </React.Fragment>
  );
};

const boxStyle = {
  border: "1px solid black",
  position: "relative",
  padding: "20px 10px",
};

const Box = ({ text, handler, addArrow, boxId }) => {
  const ref0 = useRef();
  return (
    <div
      id={boxId}
      style={boxStyle}
      ref={ref0}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        if (e.dataTransfer.getData("arrow") === boxId) {
          console.log(e.dataTransfer.getData("arrow"), boxId);
        } else {
          const refs = { start: e.dataTransfer.getData("arrow"), end: boxId };
          addArrow(refs);
          console.log("droped!", refs);
        }
      }}
    >
      {text}
      <ConnectPointsWrapper {...{ boxId, handler, ref0 }} />
    </div>
  );
};

export default function App() {
  const [arrows, setArrows] = useState([]);
  const addArrow = ({ start, end }) => {
    setArrows([...arrows, { start, end }]);
  };
  return (
    <>
      <SimpleExample />
      <div style={{ margin: 20, border: "1px solid gray", padding: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {/* two boxes */}
          <Box
            text="drag my handler to second element"
            {...{ addArrow, handler: "right", boxId: "box2_1" }}
          />
          <Box
            text="second element"
            {...{ addArrow, handler: "left", boxId: "box2_2" }}
          />
          {arrows.map((ar) => (
            <Xarrow
              start={ar.start}
              end={ar.end}
              key={ar.start + "-." + ar.start}
            />
          ))}
        </div>
      </div>
    </>
  );
}