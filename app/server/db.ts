import { Sequelize } from "npm:sequelize";
import * as pg from 'npm:pg';
export const sequelize = new Sequelize("xParsTest", "postgres", "root", {
	host: "localhost",
	port: "5432",
	dialect: "postgres",
});