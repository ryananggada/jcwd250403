const router = require('express').Router();
const roomController = require('../controller/room');
const roomValidator = require('../middleware/validation/room');

router.get('/', roomController.getAllRooms);
router.post('/', roomValidator.applyRoomValidation, roomController.addRoom);
router.get('/:id', roomController.getSingleRoom);
router.put('/:id', roomValidator.applyRoomValidation, roomController.editRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
