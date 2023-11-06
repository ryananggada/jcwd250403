const express = require("express");
const router = express.Router();

const authController = require("../controllers/user");
const authValidator = require("../middleware/validation/auth");
const authMiddleware = require("../middleware/auth");

router.post(
	"/register",
	// authValidator.registerValidationRules,
	authValidator.applyRegisterValidation,
	authController.handleRegister
);

module.exports = router;
