const express = require('express');
const router = express.Router();
const productController = require('./../controllers/ProductController');

// Récupérer tous les produits
router.get('/getProducts', productController.getAllProducts);

// Récupérer un produit par son ID
router.get('/getProducts/:id', productController.getProductById);

// Créer un nouveau produit
router.post('/createProducts', productController.createProduct);

// Mettre à jour un produit par son ID
router.put('/updateProducts/:id', productController.updateProduct);

// Supprimer un produit par son ID
router.delete('/DeleteProducts/:id', productController.deleteProduct);

module.exports = router;
