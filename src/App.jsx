import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { Game } from "./Game";

export default function App() {
  return (
    <>
      <DndProvider options={HTML5toTouch}>
        <Game />
      </DndProvider>
    </>
  );
}
