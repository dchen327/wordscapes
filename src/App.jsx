import React from "react";
import WordCircle from "./WordCircle";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import CustomDragLayer from "./CustomDragLayer";

export default function App() {
  return (
    <>
      <DndProvider options={HTML5toTouch}>
        <CustomDragLayer />
        <WordCircle />
      </DndProvider>
    </>
  );
}
