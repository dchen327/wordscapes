import React from "react";
import "bulma/css/bulma.min.css";
import WordCircle from "./WordCircle";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";

export default function App() {
  return (
    <>
      <DndProvider options={HTML5toTouch}>
        <WordCircle />
      </DndProvider>
    </>
  );
}
