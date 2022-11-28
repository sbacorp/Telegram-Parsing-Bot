import { Composer } from "https://deno.land/x/grammy@v1.11.2/mod.ts";

import { Context } from "../types/index.ts";
import {mainMenu} from '../keyboards/index.ts'
import {greetings} from '../headers.ts'
import { connection } from "../../supabase.ts";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", async (ctx: Context) => {
	
	const { data, error } = await connection
  .from('session')
  .insert([
    { userId: ctx.from.id}
  ])
	
	await ctx.reply(greetings);
	await ctx.reply("*Выберите действие*", {
		reply_markup: mainMenu,
		
	});
});