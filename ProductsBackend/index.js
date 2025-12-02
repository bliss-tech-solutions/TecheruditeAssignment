const express = require('express');
const router = express.Router();

const productsController = require('./ProductsController');

router.get('/products/getAll', productsController.getAll);

router.get('/products/getById/:productId', productsController.getById);

router.get('/products/getByCategory/:categoryName', productsController.getByCategory);

router.post('/products/create', productsController.create);

router.put('/products/update/:productId', productsController.update);

router.delete('/products/delete/:productId', productsController.delete);

router.put('/products/restore/:productId', productsController.restore);

module.exports = router;
