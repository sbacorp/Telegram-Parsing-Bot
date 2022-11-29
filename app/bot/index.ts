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
	subscriptionMenu,
} from "./keyboards/index.ts";
import { settingsHeading } from "./headers.ts";
import { welcomeFeature } from "./features/index.ts";

import { setupSession,dbConnect } from "./middlewares/index.ts";

import { router } from "./router/index.ts";
import {UserModel} from '../server/models.ts'
export const bot = new Bot<Context>(
	"5688898772:AAHP__a-2XsXT-lbq9TgxzEq3pcAERpG6Rw"
);

// Middlewares

bot.api.config.use(apiThrottler());
bot.api.config.use(parseMode("MarkdownV2"));
bot.use(rateLimit());

bot.use(hydrateReply);
bot.use(dbConnect())
bot.use(subscriptionMenu);
bot.use(marketsMenu);
bot.use(paymentsMenu);
bot.use(settingsMenu);
bot.use(personalAccountMenu);
bot.use(countOutputMenu);
marketsMenu.register(subscriptionMenu);
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
	try {
	const chatId = ctx.chat.id;
	const user = await UserModel.findOne({chatId})
	await ctx.reply(
		`*🔐 Личный кабинет*\n\n Баланс : *${user.userBalance}$*\n\n *Промокод:*\n не активирован`,
		{
			reply_markup: personalAccountMenu,
			disable_web_page_preview: true,
		}
	);	
	} catch (error) {
		await ctx.reply("Произошла ошибка, попробуйте снова")
	}
	
});
bot.use(router);
bot.on("message:text", async (ctx) => {
	await ctx.reply(`*непонимаю тебя*`);
});
bot.catch((err) => console.error(err));

run(bot);
