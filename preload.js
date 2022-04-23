// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require("electron");

// White-listed channels.
const $ipc = {
  render: {
    // From render to main.
    send: [],
    // From main to render.
    receive: ["channel:test"],
    // From render to main and back again.
    sendReceive: ["channel:count"],
  },
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("ipcRender", {
  // From render to main.
  send: (channel, args) => {
    let validChannels = $ipc.render.send;
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, args);
    }
  },

  // From main to render.
  receive: (channel, listener) => {
    let validChannels = $ipc.render.receive;
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`.
      ipcRenderer.on(channel, (event, ...args) => listener(...args));
    }
  },

  // From render to main and back again.
  invoke: (channel, args) => {
    let validChannels = $ipc.render.sendReceive;
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, args);
    }
  },
});
