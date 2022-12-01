import "bulma/css/bulma.min.css";
import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";

export default function App() {
  const [arrows, setArrows] = useState([]);
  const addArrow = ({ start, end }) => {
    setArrows([...arrows, { start, end }]);
  };
  return (
    <>
      
    </>
  );
}
