import "https://deno.land/x/dotenv/load.ts";
import { Bot } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
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
} from "./keyboards/index.ts";
import { settingsHeading, greetings } from "./headers.ts";
import { welcomeFeature } from "./features/index.ts";

import { setupSession } from "./middlewares/index.ts";

import { router } from "./router/index.ts";

export const bot = new Bot<Context>(Deno.env.get("BOT_TOKEN"));

// Middlewares

bot.api.config.use(apiThrottler());
bot.api.config.use(parseMode("HTML"));
bot.use(rateLimit());
bot.use(hydrateReply);
bot.use(setupSession());

bot.use(marketsMenu);
bot.use(paymentsMenu);
bot.use(settingsMenu);
bot.use(personalAccountMenu);
personalAccountMenu.register(paymentsMenu);

//handlers
bot.use(welcomeFeature);
bot.hears("⚙️ Настройки", async (ctx: Context) => {
	await ctx.reply(settingsHeading, {
		reply_markup: settingsMenu,
		disable_web_page_preview: true,
	});
});
bot.hears("📝 Помощь", async (ctx: Context) => {
	await ctx.reply("<b>Надеемся, мы вам поможем!</b>", {
		reply_markup: helpMenu,
		disable_web_page_preview: true,
	});
});

bot.hears("🔎 Начать поиск", async (ctx: Context) => {
	await ctx.reply("<b>Выберите площадку : </b>", {
		reply_markup: marketsMenu,
		disable_web_page_preview: true,
	});
});
bot.hears("🔐 Личный кабинет", async (ctx: Context) => {
	await ctx.reply(
		`<b>🔐 Личный кабинет</b>\n\n Баланс : <b>${ctx.session.userBalance}$</b>\n\n <b>Промокод:</b>\n не активирован`,
		{
			reply_markup: personalAccountMenu,
			disable_web_page_preview: true,
		}
	);
});
bot.use(router);
bot.catch((err) => console.error(err));

bot.start();
