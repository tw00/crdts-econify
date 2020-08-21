const sum = (acc, val) => acc + val;

module.exports = class GCounter {
  constructor(id) {
    this._id = id || Math.random().toString(16).substring(2);
    this._counters = { [this._id]: 0 };
  }

  increment(value) {
    this._counters[this._id] += value;
  }

  get value() {
    return Object.values(this._counters).reduce(sum, 0);
  }

  merge(other) {
    Object.entries(other._counters).forEach(([id, value]) => {
      this._counters[this._id] = Math.max(value, this._counters[this._id] || 0);
    });
  }
};
