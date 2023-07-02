import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#00000000',
      symbolColor: '#66cff',
      height: 75
    },
    icon: path.join(process.env.PUBLIC, 'lunar-reader.png'),
    minWidth: 800,
    minHeight: 450,
    width: 1120,
    height: 630,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(() => {
  createWindow()
})

// ------------------------api--------------------------------
// ipcMain.handle("open-dir", () => {
//   dialog
//     .showOpenDialog({
//       properties: ["openDirectory"],
//     })
//     .then((result) => {
//       if (!result.canceled) {
//         const dirPath = result.filePaths[0];
//         fs.readdir(dirPath, (err, files) => {
//           if (err) throw err;
//           return files;
//         });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });
ipcMain.handle('open-dir', () => {
  const res = fs.readdirSync('D:\\document\\books')
  return res
})

ipcMain.handle('open-book', (_event, file: string) => {
  const res = fs.readFileSync('D:\\document\\books\\' + file, 'utf-8')
  return res
})