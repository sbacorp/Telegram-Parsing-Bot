import { Sequelize } from "npm:sequelize";
import * as pg from 'npm:pg';
export const sequelize = new Sequelize('parserUsers', 'bogdan', 'root', {
	host: '77.223.106.99',
	port: '6432',
	dialect: 'postgres'
  });