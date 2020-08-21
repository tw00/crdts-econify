import React, { useState, useEffect } from "react";
import network from "./network";

import GCounterUI from "./components/GCounter";
import PNCounterUI from "./components/PNCounter";
import GSetUI from "./components/GSet";
import CmRDTSetUI from "./components/CmRDTSet";

const LamportClock = require("../../crdts/src/lamport-clock");

const GCounter = require("../../crdts-econify/src/G-Counter");

const {
  // GCounter,
  PNCounter,
  GSet,
  TwoPSet,
  ORSet,
  LWWSet,
} = require("../../crdts/src");

const crdtList = {
  GCounter: { name: "G-Counter", class: GCounter, ui: GCounterUI },
  PNCounter: { name: "PN-Counter", class: PNCounter, ui: PNCounterUI },
  GSet: { name: "GSet", class: GSet, ui: GSetUI },
  TwoPSet: { name: "TwoPSet", class: TwoPSet, ui: CmRDTSetUI },
  ORSet: { name: "ORSet", class: ORSet, ui: CmRDTSetUI },
  LWWSet: { name: "LWWSet", class: LWWSet, ui: CmRDTSetUI },
};

const AUTO_SEND_ON_UPDATE = false;

function from(CRDT, obj) {
  return typeof CRDT.from === "function"
    ? CRDT.from(obj)
    : Object.create(CRDT.prototype, Object.getOwnPropertyDescriptors(obj));
}

function UUID() {
  return "_" + Math.random().toString(36).substr(2, 8);
}

const actorId = UUID();
let CRDT = null;
let CRDTtype = null;
let local = null;

let clock = new LamportClock(actorId);

const App = () => {
  const [key, setKey] = useState(0);

  const update = () => setKey(key + 1);
  const setCRDT = (type) => {
    CRDT = crdtList[type];
    CRDTtype = type;
    function makeCRDT(type) {
      switch (type) {
        case "GCounter":
          return new CRDT.class(actorId);
        case "PNCounter":
          return new CRDT.class(actorId);
        case "GSet":
          return new CRDT.class([]);
        case "TwoPSet":
          return new CRDT.class([]);
        case "ORSet":
          return new CRDT.class(null, { compareFunc: LamportClock.isEqual });
        case "LWWSet":
          return new CRDT.class(null, { compareFunc: LamportClock.compare });
      }
    }
    local = makeCRDT(type);
    update();
  };

  useEffect(() => {
    setCRDT("GCounter");
  }, []);

  const onSend = () => {
    const crdt_serialized =
      typeof local.toJSON === "function" ? local.toJSON() : local;
    network.send(crdt_serialized);
  };

  const receive = (msg) => {
    if (typeof msg.data === "string") {
      setCRDT(msg.data);
    } else {
      // TODO: Check class
      const other = from(CRDT.class, msg.data);
      local.merge(other);
    }
    update();
  };

  useEffect(() => {
    network.connect(receive);
    return () => {
      network.disconnect(receive);
    };
  });

  const onChangeType = (type) => {
    setCRDT(type);
    network.send(type);
  };

  const UIComp = CRDT ? CRDT.ui : null;

  return (
    <div className="App" key={key}>
      <div style={{ display: "flex" }}>
        <select
          name="crdttype"
          id="crdttype"
          value={CRDTtype || ""}
          onChange={(e) => onChangeType(e.target.value)}
        >
          {Object.keys(crdtList).map((name) => (
            <option value={name} key={name}>
              {crdtList[name].name}
            </option>
          ))}
        </select>
        <button onClick={() => onSend()}>Send</button>
      </div>
      {/* <pre>actorId: {actorId}</pre> */}
      {UIComp && local && (
        <>
          <UIComp
            local={local}
            clock={clock}
            update={() => {
              update();
              AUTO_SEND_ON_UPDATE && onSend();
            }}
          />
        </>
      )}
    </div>
  );
};

export default App;
