import { Sequelize } from "npm:sequelize";
import * as pg from 'npm:pg';
export const sequelize = new Sequelize("parserUsers", "bogdan", "0lDWCy6qeZgs", {
	host: "5.188.129.19",
	port: "6432",
	dialect: "postgres",
});