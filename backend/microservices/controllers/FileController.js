// backend/controllers/FileController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/document');
const Prestataire = require('../models/prestataire');

// Dossiers de stockage des fichiers
const photoDir = path.join(__dirname, '..', 'uploads', 'photo_prestataire');
const documentDir = path.join(__dirname, '..', 'uploads', 'document_prestataire');

// Configuration Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      cb(null, photoDir);
    } else if (file.fieldname === 'documents') {
      cb(null, documentDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage }).fields([{ name: 'photo' }, { name: 'documents' }]);

exports.uploadFiles = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erreur lors de l\'upload des fichiers', error: err });
    }
    
    const prestataireData = {
      nom: req.body.nom,
      ville: req.body.ville,
      telephone: req.body.telephone,
      fax: req.body.fax,
      email: req.body.email,
      adresse: req.body.adresse,
      nomResponsable: req.body.nomResponsable,
      fonctionResponsable: req.body.fonctionResponsable,
      gsmResponsable: req.body.gsmResponsable,
      emailResponsable: req.body.emailResponsable,
      remarques: req.body.remarques,
      domaineActivite: req.body.domaineActivite,
      motsCles: req.body.motsCles,
      infosSupplementaires: req.body.infosSupplementaires,
      validite: req.body.validite === 'true',
      avis: req.body.avis,
      internet: req.body.internet
    };

    try {
      // Créer le prestataire
      const prestataire = await Prestataire.create(prestataireData);

      // Ajout de la photo
      if (req.files.photo) {
        const photo = req.files.photo[0];
        const photoPath = photo.path;

        await Document.create({
          IdPrest: prestataire.id,
          nom: `${prestataire.nom}_photo`,
          nomFichier: photo.filename,
          cheminFichier: photoPath
        });
      }

      // Ajout des documents
      if (req.files.documents) {
        for (const document of req.files.documents) {
          const documentPath = document.path;

          await Document.create({
            IdPrest: prestataire.id,
            nom: `${prestataire.nom}_document_${document.filename}`,
            nomFichier: document.filename,
            cheminFichier: documentPath
          });
        }
      }

      res.status(200).json({ success: true, message: 'Prestataire et fichiers uploadés avec succès' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};
