const router = require('express').Router();
const tenantAuthController = require('../controller/tenantAuth');
const { multerUpload } = require('../middleware/multer');
const tenantAuthValidator = require('../middleware/validation/tenantAuth');

router.post(
  '/signup',
  multerUpload.single('ktpCard'),
  tenantAuthValidator.tenantSignupRules,
  tenantAuthValidator.applyTenantAuthValidation,
  tenantAuthController.createTenant
);
router.post(
  '/login',
  tenantAuthValidator.tenantLoginRules,
  tenantAuthValidator.applyTenantAuthValidation,
  tenantAuthController.loginHandler
);

module.exports = router;
