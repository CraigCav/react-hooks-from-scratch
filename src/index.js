import React from "react";
import ReactDOM from "react-dom";
import { use, useState } from "./future";

const Example = use(() => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
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
