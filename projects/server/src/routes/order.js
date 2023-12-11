const router = require('express').Router();
const orderController = require('../controller/order');

router.get('/tenant/:id', orderController.getOrdersAsTenant);
router.get('/user/:id', orderController.getOrdersAsUser);
router.post('/', orderController.addOrder);
router.get('/:id', orderController.getSingleOrder);

module.exports = router;
