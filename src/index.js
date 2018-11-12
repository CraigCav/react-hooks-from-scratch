import React from "react";
import ReactDOM from "react-dom";
import { use, useState, useEffect } from "./future";

const Example = use(() => {
  const [count, setCount] = useState(0);

  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  const updateMousePosition = ev => {
    setMousePosition({ x: ev.clientX, y: ev.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>{JSON.stringify(mousePosition)}</p>
    </div>
  );
});

function App() {
  return (
    <div className="App">
      <Example />
      <Example />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
