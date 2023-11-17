const router = require('express').Router();
const propertyController = require('../controller/property');
const propertyValidator = require('../middleware/validation/property');
const { multerUpload } = require('../middleware/multer');

router.get('/', propertyController.getAllProperties);
router.post(
  '/',
  multerUpload.single('picture'),
  propertyValidator.propertyRules,
  propertyValidator.applyPropertyValidation,
  propertyController.addProperty
);
router.get('/:id', propertyController.getSingleProperty);
router.put(
  '/:id',
  multerUpload.single('picture'),
  propertyValidator.propertyRules,
  propertyValidator.applyPropertyValidation,
  propertyController.editProperty
);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;
