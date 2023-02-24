const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const crypto = require("crypto");

// the file you want to get the hash

const getFileHash = async (fileName) => {
  return new Promise((resolve, reject) => {
    var fd = fs.createReadStream(fileName);
    var hash = crypto.createHash("sha256");
    hash.setEncoding("hex");

    fd.on("end", function () {
      hash.end();
      resolve(hash.read());
    });

    fd.pipe(hash);
  });
};
const SHA256 = (item) => {
  return crypto.createHash("sha256").update(item).digest("hex");
};
const openFileAsPDFDocument = async (_file) => {
  if (!_file) return;
  const fileBuff = fs.readFileSync(_file);
  try {
    return PDFDocument.load(fileBuff);
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

const saveFileAsPDFDocument = async (pdfDocument, fileName) => {
  const pdfBytes = await pdfDocument.saveAsBase64();
  const arrBuff = base64ToArrayBuffer(pdfBytes);
  fs.writeFileSync(fileName, Buffer.from(arrBuff));
};

const base64ToArrayBuffer = (base64) => {
  const binaryString = global.atob(base64);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
};

const issueCertificate = async (
  issuerName,
  issuerAddress,
  certificateNumber,
  certificateFileName,
  issuerPrivateKey
) => {
  const pdfDocument = await openFileAsPDFDocument(certificateFileName);
  const pdfAuthorObj = {
    issuerName,
    issuerAddress,
    certificateNumber,
  };
  const pdfAuthorString = JSON.stringify(pdfAuthorObj);
  pdfDocument.setAuthor(pdfAuthorString);
  return await saveFileAsPDFDocument(
    pdfDocument,
    `Signed_${certificateFileName}`
  );
};
const getCertificateInfo = async (pdfDocument) => {
  const pdfAuthor = pdfDocument.getAuthor();
  const pdfAuthorObj = JSON.parse(pdfAuthor);
  return pdfAuthorObj;
};

module.exports = {
  openFileAsPDFDocument,
  saveFileAsPDFDocument,
  issueCertificate,
  getCertificateInfo,
  getFileHash,
};
