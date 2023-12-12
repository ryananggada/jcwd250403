const router = require('express').Router();
const orderController = require('../controller/order');
const { multerUpload } = require('../middleware/multer');

router.get('/tenant/:id', orderController.getOrdersAsTenant);
router.get('/user/:id', orderController.getOrdersAsUser);
router.delete('/:id/cancel', orderController.cancelOrder);
router.post(
  '/:id/upload-payment',
  multerUpload.single('paymentProof'),
  orderController.uploadPaymentProof
);
router.post('/', orderController.addOrder);
router.get('/:id', orderController.getSingleOrder);

module.exports = router;
