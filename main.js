const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { mergePDFs } = require('./script.js');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
}

// PDF file selection for PDF's that will be merged
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
  });

  return result.filePaths;
});

// "Save As" dialogue
ipcMain.handle('save-dialog', async () => {
  const result = await dialog.showSaveDialog({
    title: 'Save Merged PDF',
    defaultPath: 'mergedPDFs.pdf',
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
  });

  return result.filePath; // return "Save As" file path
});

// Merge PDFs
ipcMain.handle('merge-pdfs', async (event, filePaths, outputPath) => {
  try {
    await mergePDFs(filePaths, outputPath);
    return `PDFs merged successfully! Output saved at: ${outputPath}`;
  } catch (error) {
    return `Error merging PDFs: ${error.message}`;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // handle MAC closing
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
