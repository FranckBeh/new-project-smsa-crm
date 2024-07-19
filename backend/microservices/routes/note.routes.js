const express = require('express');
const router = express.Router();
const noteController = require('../controllers/NoteController');

// Routes pour les opérations CRUD de base
router.post('/create', noteController.createNote);
router.get('/last-id', noteController.getLastId);
router.get('/list', noteController.getList);
router.get('/current', noteController.getCurrentNotes);
router.get('/finalized', noteController.getFinlizedNotes);
router.post('/current/by', noteController.getCurrentNotesBy);
router.post('/finalized/by', noteController.getFinlizedNotesBy);
router.put('/update', noteController.updateNote);
router.delete('/delete:id', noteController.deleteNote);
router.get('/:idNote/details', noteController.getDetailsNote);
router.get('/search', noteController.searchNotes);
//router.post('/action', noteController.insertActionPrise);
//router.delete('/action/:idNote', noteController.deleteActionsPrises);
//router.post('/visibility', noteController.setVisible);

module.exports = router;
