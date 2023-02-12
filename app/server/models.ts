import { DataTypes } from "npm:sequelize";
import { sequelize } from "./db.ts";

export const UserModel = sequelize.define("user", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	chatId: {
		type: DataTypes.STRING,
		unique: true
	},
	userBalance: {
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	
});

export const ShopModel = sequelize.define("shop", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	shopId: {
		type: DataTypes.STRING,
		unique: true,
	},
	count: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
	},
	shown: {
		type: DataTypes.ARRAY(DataTypes.STRING),
	},
});