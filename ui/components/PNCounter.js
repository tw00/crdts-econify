import React from "react";

const PNCounter = ({ local, update }) => {
  const onIncrement = (value) => {
    local.increment(value);
    update();
  };

  const onDecrement = (value) => {
    local.decrement(value);
    update();
  };

  return (
    <div className="PNCounter">
      <pre style={{ fontWeight: "bold" }}>value: {local.value}</pre>
      <button onClick={() => onIncrement(5)}>+5</button>
      <button onClick={() => onIncrement(2)}>+2</button>
      <button onClick={() => onDecrement(2)}>-2</button>
      <button onClick={() => onDecrement(5)}>-5</button>
      <pre>local state = {JSON.stringify(local, null, 2)}</pre>
    </div>
  );
};

export default PNCounter;
