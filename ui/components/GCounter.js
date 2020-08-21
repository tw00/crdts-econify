import React from "react";

const GCounter = ({ local, update }) => {
  const onIncrement = (value) => {
    local.increment(value);
    update();
  };

  return (
    <div className="GCounter">
      <pre style={{ fontWeight: "bold" }}>value: {local.value}</pre>
      <button onClick={() => onIncrement(5)}>+5</button>
      <button onClick={() => onIncrement(3)}>+3</button>
      <button onClick={() => onIncrement(1)}>+1</button>
      <pre>local state = {JSON.stringify(local, null, 2)}</pre>
    </div>
  );
};

export default GCounter;
