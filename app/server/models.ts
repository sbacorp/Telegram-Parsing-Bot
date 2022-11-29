import { DataTypes } from "npm:sequelize";
import { sequelize } from "./db.ts";

export const UserModel = sequelize.define("user", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	chatId: {
		type: DataTypes.STRING,
		unique: true,
	},
	userBalance: {
		type: DataTypes.INTEGER,
		defaultValue: 10,
	},
});
