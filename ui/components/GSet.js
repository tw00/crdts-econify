import React from "react";

const GSet = ({ local, update }) => {
  const onAdd = (item) => {
    local.add(item);
    update();
  };

  // const things = ["banana", "milk", "flour"];
  const things = ["🍌", "🥛", "🥚", "🍉", "🍞", "🍏", "🧅", "🧂"];

  return (
    <div className="GSet">
      <pre style={{ fontWeight: "bold" }}>
        value: {JSON.stringify(Array.from(local.values()))}
      </pre>
      {things
        .filter((thing) => !local.has(thing))
        .map((thing) => (
          <button onClick={() => onAdd(thing)} key={thing}>
            +{thing}
          </button>
        ))}
      <pre>local state = {JSON.stringify(local, null, 2)}</pre>
    </div>
  );
};

export default GSet;
