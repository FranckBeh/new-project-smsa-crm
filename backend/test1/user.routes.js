const express = require('express');
const router = express.Router();
const UserController = require('./UserController');  // Assurez-vous que le chemin vers votre contrôleur est correct

router.get('/user/:id', async (req, res) => {
    try {
        const user = await UserController.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).send(`Une erreur s'est produite lors de la récupération de l'utilisateur : ${error}`);
    }
});

router.post('/user', async (req, res) => {
    try {
        const user = await UserController.createUser(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).send(`Une erreur s'est produite lors de la création de l'utilisateur : ${error}`);
    }
});

router.put('/user/:id', async (req, res) => {
    try {
        const user = await UserController.updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        res.status(500).send(`Une erreur s'est produite lors de la mise à jour de l'utilisateur : ${error}`);
    }
});

router.delete('/user/:id', async (req, res) => {
    try {
        const user = await UserController.deleteUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).send(`Une erreur s'est produite lors de la suppression de l'utilisateur : ${error}`);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await UserController.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).send(`Une erreur s'est produite lors de la récupération des utilisateurs : ${error}`);
    }
});



module.exports = router;
