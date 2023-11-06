"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Users", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			firstName: {
				type: Sequelize.STRING,
			},
			lastName: {
				type: Sequelize.STRING,
			},
			password: {
				type: Sequelize.STRING,
			},
			email: {
				type: Sequelize.STRING,
			},
			phoneNumber: {
				type: Sequelize.STRING,
			},
			profilePicture: {
				type: Sequelize.STRING,
			},
			gender: {
				type: Sequelize.ENUM("Female", "Male", "Others"),
			},
			birthDate: {
				type: Sequelize.DATEONLY,
			},
			isVerified: {
				type: Sequelize.BOOLEAN,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Users");
	},
};
