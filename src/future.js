import React from "react";

// internally React knows what component is rendering when `useState` is called
// but we'll track this globally
let currentInstance = null;

export const use = render => {
  return class extends React.Component {
    state = {};
    render() {
      currentInstance = this;
      currentInstance.callIndex = 0;
      return render(this.props);
    }
  };
};

export const useState = initialValue => {
  // close over current component and index (so they don't change under us)
  const frame = currentInstance;

  // close over current component and index (so they don't change under us)
  const key = currentInstance.callIndex;

  // destructure current state
  const { state } = currentInstance;

  // increment the pointer for the next `useState` call
  currentInstance.callIndex++;

  return [
    // either the value in the current memory position, or the initial value
    state.hasOwnProperty(key) ? state[key] : initialValue,

    // internally, React would schedule state changes, but we'll just delegate
    // to component setState instead
    newValue => frame.setState({ [key]: newValue })
  ];
};
