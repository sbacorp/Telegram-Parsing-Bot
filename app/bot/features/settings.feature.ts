import { Composer } from "https://deno.land/x/grammy@v1.11.2/mod.ts";

import { Context } from "../types/index.ts";
import {settingsMenu} from '../keyboards/index.ts'
import {settingsHeading} from '../headers.ts'
export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.hears("⚙️ Настройки", async (ctx: Context) => {
	await ctx.reply(settingsHeading, {
		reply_markup: settingsMenu,
		disable_web_page_preview: true,
	});
});