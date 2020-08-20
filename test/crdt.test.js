const assert = require("assert");

const GCounter = require("../src/G-Counter");

const crdts = [
  {
    name: "G-Counter",
    create: (id) => new GCounter(id),
    mutate: (crdt, value) => crdt.increment(value),
    merge: (crdt1, crdt2) => crdt1.merge(crdt2),
    query: (crdt) => crdt.value,
  },
  // Add CRDTS here...
];

describe("CRDTs", () => {
  crdts.forEach(async (CRDT) => {
    describe(CRDT.name, () => {
      createTestSuite(CRDT);
    });
  });
});

function createTestSuite(CRDT) {
  // Non-Triviality:
  // a != {}
  it("is not trivial", () => {
    const crdt = CRDT.create("A");
    CRDT.mutate(crdt, 8);
    assert.ok(CRDT.query(crdt) === 8);
  });

  // Associativity:
  // a + (b + c) == (a + b) + c
  it("is associative", () => {
    // a + (b + c)
    const crdt1 = CRDT.create("A");
    const crdt2 = CRDT.create("B");
    const crdt3 = CRDT.create("C");
    CRDT.mutate(crdt1, 42);
    CRDT.mutate(crdt2, 2);
    CRDT.mutate(crdt3, 1);
    CRDT.merge(crdt2, crdt3);
    CRDT.merge(crdt1, crdt2);
    const resLeft = CRDT.query(crdt1);

    // (a + b) + c
    const crdt4 = CRDT.create("A");
    const crdt5 = CRDT.create("B");
    const crdt6 = CRDT.create("C");
    CRDT.mutate(crdt4, 42);
    CRDT.mutate(crdt5, 2);
    CRDT.mutate(crdt6, 1);
    CRDT.merge(crdt4, crdt5);
    CRDT.merge(crdt6, crdt4);
    const resRight = CRDT.query(crdt6);

    // a + (b + c) == (a + b) + c
    assert.deepEqual(resLeft, resRight);
    assert.ok(resLeft);
    assert.ok(resRight);
  });

  // Commutativity:
  // a + b == b + a
  it("is commutative", () => {
    // a + b
    const crdt1 = CRDT.create("A");
    const crdt2 = CRDT.create("B");
    CRDT.mutate(crdt1, 12);
    CRDT.mutate(crdt2, 43);
    CRDT.merge(crdt1, crdt2);
    const resLeft = CRDT.query(crdt1);

    // b + a
    const crdt3 = CRDT.create("A");
    const crdt4 = CRDT.create("B");
    CRDT.mutate(crdt3, 12);
    CRDT.mutate(crdt4, 43);
    CRDT.merge(crdt3, crdt4);
    const resRight = CRDT.query(crdt3);

    // a + b == b + a
    assert.deepEqual(resLeft, resRight);
    assert.ok(resLeft);
    assert.ok(resRight);
  });

  // Idempotence:
  // a + a = a
  it("is idempotent", () => {
    const crdt = CRDT.create("A");
    CRDT.mutate(crdt, 3);
    CRDT.mutate(crdt, 42);
    CRDT.mutate(crdt, 7);
    const resLeft = CRDT.query(crdt);
    CRDT.merge(crdt, crdt);
    const resRight = CRDT.query(crdt);

    // a + a = a
    assert.deepEqual(resLeft, resRight);
    assert.ok(resLeft);
    assert.ok(resRight);
  });
}
