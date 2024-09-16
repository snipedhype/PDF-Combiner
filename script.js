const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

module.exports = { mergePDFs };

async function mergePDFs(pdfPaths, outputPath) {
  const mergedPDF = await PDFDocument.create();

  for (let pdfPath of pdfPaths) {
    const pdfData = fs.readFileSync(pdfPath);
    const pdfToMerge = await PDFDocument.load(pdfData);
    const copiedPages = await mergedPDF.copyPages(pdfToMerge, pdfToMerge.getPageIndices());
    copiedPages.forEach((page) => mergedPDF.addPage(page));
  }
  const finalPDFData = await mergedPDF.save();
  fs.writeFileSync(outputPath, finalPDFData);

  console.log(`check output file for merged pdf: ${outputPath}`);
}