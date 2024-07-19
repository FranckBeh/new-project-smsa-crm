// backend/routes/file.js
const express = require('express');
const router = express.Router();
const FileController = require('./../controllers/FileController');

router.post('/upload', FileController.uploadFiles);

module.exports = router;
