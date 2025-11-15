const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return null;
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // These are important for security and modern Electron apps
            contextIsolation: true,
            nodeIntegration: false,
        },
        icon: path.join(__dirname, 'icon-512.png') // Optional: add an icon
    });

    // In production, load the built index.html file.
    // In development, you might load a URL from a dev server.
    // For this project structure, we load the root index.html directly.
    mainWindow.loadFile('index.html');
    
    // Open DevTools automatically if not in production
    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    // Set up an IPC handler to listen for requests for the IP address
    ipcMain.handle('get-local-ip', () => {
        return getLocalIpAddress();
    });

    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    // On macOS, applications and their menu bar stay active until the user quits
    // explicitly with Cmd + Q. On other platforms, we quit.
    if (process.platform !== 'darwin') app.quit();
});
