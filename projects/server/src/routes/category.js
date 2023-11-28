const router = require('express').Router();
const categoryController = require('../controller/category');
const categoryValidator = require('../middleware/validation/category');
const authMiddleware = require('../middleware/auth');

router.get('/', categoryController.getAllCategories);
router.post(
  '/',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  categoryValidator.categoryRules,
  categoryValidator.applyCategoryValidation,
  categoryController.addCategory
);
router.get('/:id', categoryController.getSingleCategory);
router.put(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  categoryValidator.categoryRules,
  categoryValidator.applyCategoryValidation,
  categoryController.editCategory
);
router.delete(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  categoryController.deleteCategory
);

module.exports = router;
