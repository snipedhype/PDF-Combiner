const { ipcRenderer } = require('electron');

document.getElementById('selectFilesBtn').addEventListener('click', async () => {
  const filePaths = await ipcRenderer.invoke('select-files');
  if (filePaths.length > 0) {
    document.getElementById('outputMessage').innerText = `Selected Files: ${filePaths.join(', ')}`;
    window.selectedFiles = filePaths; // Store the selected file paths
  } else {
    document.getElementById('outputMessage').innerText = 'No files selected.';
  }
});

document.getElementById('mergeBtn').addEventListener('click', async () => {
  if (!window.selectedFiles || window.selectedFiles.length === 0) {
    document.getElementById('outputMessage').innerText = 'Please select files first!';
    return;
  }

  // get the output file path from the user
  const outputPath = await ipcRenderer.invoke('save-dialog');
  if (!outputPath) {
    document.getElementById('outputMessage').innerText = 'Output file path was not selected.';
    return;
  }

  const resultMessage = await ipcRenderer.invoke('merge-pdfs', window.selectedFiles, outputPath);
  document.getElementById('outputMessage').innerText = resultMessage;
});