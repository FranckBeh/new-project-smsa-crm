const express = require('express');
const router = express.Router();
const tagController = require('./../controllers/tagController');

// CRUD routes for Tag
router.get('/', tagController.getAllTags);
router.get('/:id', tagController.getTagById);
router.post('/create', tagController.createTag);
router.put('/update/:id', tagController.updateTag);
router.delete('/delete/:id', tagController.deleteTag);

module.exports = router;
