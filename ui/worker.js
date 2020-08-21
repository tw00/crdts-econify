// Shared Worker

const connections = [];

function broadcast(e, port = null) {
  connections.forEach((connection) => {
    if (!port || connection !== port) {
      connection.postMessage(e.data);
    }
  });
}

onconnect = function (e) {
  const port = e.ports[0];
  connections.push(port);

  // port.onmessage = (e) => broadcast(e);
  port.onmessage = (e) => broadcast(e, port);
};
