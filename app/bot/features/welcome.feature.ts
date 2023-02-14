import { Composer } from "https://deno.land/x/grammy@v1.11.2/mod.ts";
import { Context } from "../types/index.ts";
import {mainMenu} from '../keyboards/index.ts'
import {greetings} from '../headers.ts'
import { UserModel } from "../../server/models.ts";
import { sequelize } from "../../server/db.ts";
export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", async (ctx: Context) => {
	const chatId = ctx.chat.id;
	try {
		 await sequelize.authenticate();
		await sequelize.sync();
		await UserModel.create({chatId})
	}
	catch (err) {
        console.error(err);
    }
	
	await ctx.reply(greetings);
	await ctx.reply("*Выберите действие*", {
		reply_markup: mainMenu,
		
	});
});