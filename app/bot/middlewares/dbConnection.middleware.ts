import { Middleware, session } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { sequelize } from "../../server/db.ts";
import { Context } from "../types/index.ts";

export const middleware = (): Middleware<Context> => async (ctx, next) => {

	await sequelize.authenticate();
	await sequelize.sync();
	await session({
		initial: createInitialSessionData,
	  });
		
	return next();
  };

export function createInitialSessionData() {
	return {
		showOwnerName: true,
		showPrice: true,
		showTitle: true,
		onlyWithPhone:false,
		onlyWithWA:false,
		countOutput:5,
		subActive:false,
		sbazarStep: "idle",
		subOneDays:4,
		subThreeDays:6,
		subSevenDays:13,
		subMonth:50,
	};
}