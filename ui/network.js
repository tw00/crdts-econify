const worker = new SharedWorker("worker.js");
worker.port.start();

const network = {
  send(msg) {
    worker.port.postMessage(msg);
  },

  connect(cb) {
    worker.port.addEventListener("message", cb);
  },

  disconnect(cb) {
    worker.port.removeEventListener("message", cb);
  },
};

export default network;
