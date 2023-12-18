const router = require('express').Router();
const propertyController = require('../controller/property');
const propertyValidator = require('../middleware/validation/property');
const authMiddleware = require('../middleware/auth');
const { multerUpload } = require('../middleware/multer');

router.get('/with-rooms', propertyController.getPropertiesFromLowestPrice);
router.get(
  '/',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  propertyController.getAllProperties
);
router.post(
  '/',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  multerUpload.single('picture'),
  propertyValidator.propertyRules,
  propertyValidator.applyPropertyValidation,
  propertyController.addProperty
);
router.get('/:id', propertyController.getSingleProperty);
router.put(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  multerUpload.single('picture'),
  propertyValidator.propertyRules,
  propertyValidator.applyPropertyValidation,
  propertyController.editProperty
);
router.delete(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  propertyController.deleteProperty
);

module.exports = router;
