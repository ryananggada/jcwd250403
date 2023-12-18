const router = require('express').Router();
const orderController = require('../controller/order');
const { multerUpload } = require('../middleware/multer');
const authMiddleware = require('../middleware/auth');

router.get(
  '/tenant',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  orderController.getOrdersAsTenant
);
router.get(
  '/report',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  orderController.getOrderReports
);
router.get('/user/:id', orderController.getOrdersAsUser);
router.post('/:id/confirm', orderController.confirmOrder);
router.delete('/:id/reject', orderController.rejectOrder);
router.delete('/:id/cancel', orderController.cancelOrder);
router.post(
  '/:id/upload-payment',
  multerUpload.single('paymentProof'),
  orderController.uploadPaymentProof
);
router.post('/', orderController.addOrder);
router.get('/:id', orderController.getSingleOrder);

module.exports = router;
