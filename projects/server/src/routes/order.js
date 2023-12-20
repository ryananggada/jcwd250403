const router = require('express').Router();
const orderController = require('../controller/order');
const { multerUpload } = require('../middleware/multer');
const authMiddleware = require('../middleware/auth');
const orderValidator = require('../middleware/validation/order');

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
router.get(
  '/user',
  authMiddleware.tokenValidator,
  authMiddleware.userValidator,
  orderController.getOrdersAsUser
);
router.post(
  '/:id/confirm',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  orderController.confirmOrder
);
router.delete(
  '/:id/reject',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  orderController.rejectOrder
);
router.delete(
  '/:id/cancel',
  authMiddleware.tokenValidator,
  orderController.cancelOrder
);
router.post(
  '/:id/upload-payment',
  authMiddleware.tokenValidator,
  authMiddleware.userValidator,
  multerUpload.single('paymentProof'),
  orderController.uploadPaymentProof
);
router.post(
  '/',
  authMiddleware.tokenValidator,
  authMiddleware.userValidator,
  orderValidator.orderRules,
  orderValidator.applyOrderValidation,
  orderController.addOrder
);
router.get(
  '/:id',
  authMiddleware.tokenValidator,
  orderController.getSingleOrder
);

module.exports = router;
