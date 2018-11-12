import React from "react";

// internally React knows what component is rendering when `useState` is called
// but we'll track this globally
let currentInstance = null;

export const use = render => {
  return class extends React.Component {
    state = {};
    componentDidMount() {
      this.afterRender();
    }
    componentDidUpdate() {
      this.afterRender();
    }
    componentWillUnmount() {
      this.effects.forEach(({ create, destroy }) => {
        if (destroy) destroy();
      });
    }
    afterRender() {
      // unlike the real React implementation, this runs synchronously
      this.effects.forEach(({ create, destroy }) => {
        if (destroy) destroy();
        create();
      });
    }
    render() {
      currentInstance = this;
      currentInstance.callIndex = 0;
      currentInstance.effects = [];
      return render(this.props);
    }
  };
};

const nextStateCell = () => {
  // close over current component and index (so they don't change under us)
  const frame = currentInstance;
  const { state, callIndex } = currentInstance;

  // increment the pointer for the next `useState` call
  currentInstance.callIndex++;
  return {
    frame,
    state,
    key: callIndex
  };
};

export const useState = initialValue => {
  const { frame, state, key } = nextStateCell();

  return [
    // either the value in the current memory position, or the initial value
    state.hasOwnProperty(key) ? state[key] : initialValue,

    // internally, React would schedule state changes, but we'll just delegate
    // to component setState instead
    newValue => frame.setState({ [key]: newValue })
  ];
};

const inputsAreEqual = (next, prev) =>
  next && next.every((d, i) => d === prev[i]);

export const useEffect = (create, inputs = [create]) => {
  const { frame, state, key } = nextStateCell();

  const prevEffect = state[key];

  if (prevEffect && inputsAreEqual(inputs, prevEffect.inputs)) return;

  const effect = (state[key] = {
    create,
    inputs,
    destroy: prevEffect ? prevEffect.destroy : null
  });

  frame.effects.push(effect);
};
