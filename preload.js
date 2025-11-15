const { contextBridge, ipcRenderer } = require('electron');

// Expose a controlled API to the renderer process (our React app)
contextBridge.exposeInMainWorld('electronAPI', {
    // This function will be callable from the React app via `window.electronAPI.getLocalIP()`
    getLocalIP: () => ipcRenderer.invoke('get-local-ip')
});
