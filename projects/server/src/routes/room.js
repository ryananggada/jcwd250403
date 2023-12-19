const router = require('express').Router();
const roomController = require('../controller/room');
const roomValidator = require('../middleware/validation/room');
const authMiddleware = require('../middleware/auth');

router.get(
  '/',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  roomController.getAllRooms
);
router.post(
  '/',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  roomValidator.roomRules,
  roomValidator.applyRoomValidation,
  roomController.addRoom
);
router.get('/property/:id', roomController.getRoomsByPropertyId);
router.get('/:id', roomController.getSingleRoom);
router.put(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  roomValidator.roomRules,
  roomValidator.applyRoomValidation,
  roomController.editRoom
);
router.delete(
  '/:id',
  authMiddleware.tokenValidator,
  authMiddleware.tenantValidator,
  roomController.deleteRoom
);

module.exports = router;
