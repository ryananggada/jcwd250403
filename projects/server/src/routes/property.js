const router = require('express').Router();
const propertyController = require('../controller/property');
const propertyValidator = require('../middleware/validation/property');
const { multerUpload } = require('../middleware/multer');

router.get('/', propertyController.getAllProperties);
router.post(
  '/',
  propertyValidator.propertyRules,
  propertyValidator.applyPropertyValidation,
  multerUpload.single('picture'),
  propertyController.addProperty
);
router.get('/:id', propertyController.getSingleProperty);
router.put(
  '/:id',
  propertyValidator.propertyRules,
  propertyValidator.applyPropertyValidation,
  multerUpload.single('picture'),
  propertyController.editProperty
);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;
