const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.validateToken = (req, res, next) => {
	let token = req.headers.authorization;
	if (!token) {
		res.status(401).json({
			ok: false,
			message: "Token is not found",
		});
		return;
	}
	try {
		token = token.split(" ")[1];
		if (!token) {
			res.status(401).json({
				ok: false,
				message: "Token is not found",
			});
			return;
		}
		console.log(token);
		const payload = jwt.verify(token, JWT_SECRET_KEY);
		if (!payload) {
			res.status(401).json({
				ok: false,
				message: "Failed to get authorization data",
			});
			return;
		}

		req.user = payload;
		next();
	} catch (error) {
		res.status(401).json({
			ok: false,
			message: String(error),
		});
	}
};

exports.checkRole = (req, res, next) => {
	if (req.user.accountType === true ) {
		next();
		return;
	}

	res.status(401).json({
		ok: false,
		message: "invalid account role type",
	});
};
exports.checkRoleUser = (req, res, next) => {
	if (req.user.accountType === false ) {
		next();
		return;
	}

	res.status(401).json({
		ok: false,
		message: "invalid account role type",
	});
};
