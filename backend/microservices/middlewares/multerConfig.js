// backend/microservices/middlewares/multerConfig.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Définir le dossier pour les photos
const photoDir = path.join(__dirname, '..', 'uploads', 'photo_prestataire');
// Définir le dossier pour les documents
const documentDir = path.join(__dirname, '..', 'uploads', 'document_prestataire');

// Créer les dossiers s'ils n'existent pas
if (!fs.existsSync(photoDir)) {
  fs.mkdirSync(photoDir, { recursive: true });
}

if (!fs.existsSync(documentDir)) {
  fs.mkdirSync(documentDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'photo') {
      cb(null, photoDir);
    } else if (file.fieldname === 'documents') {
      cb(null, documentDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
