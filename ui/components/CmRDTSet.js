import React from "react";

const CmRDTSet = ({ local, update, clock }) => {
  const onAdd = (item) => {
    local.add(item, clock.tick());
    update();
  };

  const onRemove = (item) => {
    local.remove(item, clock.tick());
    update();
  };

  // const things = ["banana", "milk", "flour"];
  const things = ["🍌", "🥛", "🥚", "🍉", "🍞", "🍏", "🧅", "🧂"];

  return (
    <div className="CmRDTSet">
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
      {Array.from(local.values()).map((thing) => (
        <button onClick={() => onRemove(thing)} key={thing}>
          - {thing}
        </button>
      ))}
      <pre>local state = {JSON.stringify(local, null, 2)}</pre>
      {/* <pre>local state = {JSON.stringify(local._operations, null, 2)}</pre> */}
      {/* <pre>local: {JSON.stringify(local, null, 2)}</pre> */}
    </div>
  );
};

export default CmRDTSet;
