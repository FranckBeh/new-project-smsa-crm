const multer = require('multer');
const path = require('path');
const fs = require('fs');

const photoDir = path.join(__dirname, '..', 'uploads', 'photo_prestataire');
const documentDir = path.join(__dirname, '..', 'uploads', 'document_prestataire');

if (!fs.existsSync(photoDir)) {
  fs.mkdirSync(photoDir, { recursive: true });
}

if (!fs.existsSync(documentDir)) {
  fs.mkdirSync(documentDir, { recursive: true });
}

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 30 * 1024 * 1024 }
});

module.exports = upload;
