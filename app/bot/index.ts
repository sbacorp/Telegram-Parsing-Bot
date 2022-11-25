import "https://deno.land/x/dotenv/load.ts";
import { Bot } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { run } from "https://deno.land/x/grammy_runner@v1.0.4/mod.ts";
import { Context } from "./types/index.ts";
import { apiThrottler } from "https://deno.land/x/grammy_transformer_throttler@v1.2.1/mod.ts";
import {
	hydrateReply,
	parseMode,
} from "https://deno.land/x/grammy_parse_mode@1.5.0/mod.ts";
import { limit as rateLimit } from "https://deno.land/x/grammy_ratelimiter@v1.1.6/mod.ts";
import {
	marketsMenu,
	settingsMenu,
	helpMenu,
	personalAccountMenu,
	paymentsMenu,
	countOutputMenu,
} from "./keyboards/index.ts";
import { settingsHeading } from "./headers.ts";
import { welcomeFeature } from "./features/index.ts";

import { setupSession } from "./middlewares/index.ts";

import { router } from "./router/index.ts";

export const bot = new Bot<Context>(Deno.env.get("BOT_TOKEN"));

// Middlewares

bot.api.config.use(apiThrottler());
bot.api.config.use(parseMode("MarkdownV2"));
bot.use(rateLimit());
bot.use(hydrateReply);
bot.use(setupSession());
bot.use(marketsMenu);
bot.use(paymentsMenu);
bot.use(settingsMenu);

bot.use(personalAccountMenu);
bot.use(countOutputMenu);
personalAccountMenu.register(paymentsMenu);
settingsMenu.register(countOutputMenu);
//handlers
bot.use(welcomeFeature);
bot.hears("⚙️ Настройки", async (ctx: Context) => {
	await ctx.replyWithHTML(settingsHeading, {
		reply_markup: settingsMenu,
		disable_web_page_preview: true,
	});
});
bot.hears("📝 Помощь", async (ctx: Context) => {
	await ctx.reply("*Надеемся, мы вам поможем*", {
		reply_markup: helpMenu,
		disable_web_page_preview: true,
	});
});

bot.hears("🔎 Начать поиск", async (ctx: Context) => {
	await ctx.reply("*Выберите площадку :*", {
		reply_markup: marketsMenu,
		disable_web_page_preview: true,
	});
});
bot.hears("🔐 Личный кабинет", async (ctx: Context) => {
	await ctx.reply(
		`*🔐 Личный кабинет*\n\n Баланс : *${ctx.session.userBalance}$*\n\n *Промокод:*\n не активирован`,
		{
			reply_markup: personalAccountMenu,
			disable_web_page_preview: true,
		}
	);
});
bot.use(router);
bot.on("message:text", async (ctx) => {
	await ctx.reply(`*непонимаю тебя*`);
});
bot.catch((err) => console.error(err));

run(bot);
