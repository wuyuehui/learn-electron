// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

(function () {
  const OCounter = document.querySelector("h2");
  const counter = () => {
    setInterval(() => {
      window.ipcRender
        .invoke("channel:count", OCounter.innerText)
        .then((result) => {
          OCounter.innerText = result;
        });
    }, 1000);
  };

  counter();
  // Listen on this channel for an incoming test.
  window.ipcRender.receive("channel:test", (message) => {
    console.log(message);
  });
})();
