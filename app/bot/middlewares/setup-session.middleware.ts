import { Middleware, session } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { supabaseAdapter } from "https://deno.land/x/grammy_storages@v2.0.1/supabase/src/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { connection } from "../../supabase.ts";
import { Context } from "../types/index.ts";
import { freeStorage } from "https://deno.land/x/grammy_storages@v2.0.1/free/src/mod.ts";
// const storage = new supabaseAdapter({
// 	instance:connection,
// 	table: 'session'
// });

export const middleware = (): Middleware<Context> =>
  session({
    initial: createInitialSessionData,
  });
	
export function createInitialSessionData(id: string) {
	return {
		userId: id,
		userBalance: 5,
		showPhoto: true,
		showOwnerName: true,
		showPrice: true,
		showLocation: true,
		showDesc: true,
		showTitle: true,
		showPublishTimeF: true,
		showRegistrationDateF: true,
		showViewsF: true,
		showCountItemsF: true,
		step : "1",
	};
}