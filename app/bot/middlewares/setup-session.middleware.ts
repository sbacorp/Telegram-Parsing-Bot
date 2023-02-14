import { Middleware, session } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { Context } from "../types/index.ts";
import { sequelize } from "../../server/db.ts";

export const middleware = (): Middleware<Context> =>
  session({
    initial: createInitialSessionData,
  });
	
export function createInitialSessionData() {
	return {
		showOwnerName: true,
		showPrice: true,
		showTitle: true,
		onlyWithPhone:false,
		onlyWithWA:false,
		countOutput:5,
		sbazarStep: "idle",
		subOneDays:4,
		subThreeDays:6,
		subSevenDays:13,
		subMonth:50,
	};
}