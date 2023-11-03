const router = require('express').Router();
const categoryController = require('../controller/category');
const categoryValidator = require('../middleware/validation/category');

router.get('/', categoryController.getAllCategories);
router.post(
  '/',
  categoryValidator.categoryRules,
  categoryValidator.applyCategoryValidation,
  categoryController.addCategory
);
router.get('/:id', categoryController.getSingleCategory);
router.put(
  '/:id',
  categoryValidator.categoryRules,
  categoryValidator.applyCategoryValidation,
  categoryController.editCategory
);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
