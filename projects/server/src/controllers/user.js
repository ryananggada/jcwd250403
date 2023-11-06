const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { User } = require("../models");
const fs = require("fs");

exports.handleRegister = async (req, res) => {
	const { firstName, lastName, password, email, phoneNumber } = req.body;

	const existingUser = await User.findOne({
		where: {
			[Op.or]: [{ email }, { phoneNumber }],
		},
	});

	if (existingUser) {
		return res.status(400).json({
			ok: false,
			error: "Email or phone number already used",
		});
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const result = await User.create({
			firstName,
			lastName,
			password: hashPassword,
			email,
			phoneNumber,
		});

		res.json({
			ok: true,
			message: "Register success",
			data: {
				firstName: result.firstName,
				lastName: result.lastName,
				phoneNumber: result.phoneNumber,
				email: result.email,
			},
		});
	} catch (error) {
		res.status(400).json({
			ok: false,
			error: error.message,
		});
	}
};
