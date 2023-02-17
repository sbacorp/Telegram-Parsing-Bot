import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import { Context } from "../types/index.ts";
import { cancel, subscriptionMenu, BeginParse } from "../keyboards/index.ts";
import { UserModel } from "../../server/models.ts";

export const marketsMenu = new Menu("marketsMenu").text(
	"🇨🇿 sbazar.cz",

	async (ctx: Context) => {
		const chatId = ctx.chat.id.toString();
		const user = await UserModel.findOne({ where: { chatId: chatId } });
		const countMaxAds = ctx.session?.countMaxAds;
		const registrationDate = ctx.session?.registrationDate;
		const publishDate = ctx.session?.publishDate;
		const urls = ctx.session?.urls;
		if (
			(user.subEndDateTime = 0 || user.subEndDateTime < Math.floor(Date.now() / 1000))
		) {
			ctx.session.sbazarStep = "sub";
			await ctx.reply("Подписка не активна", {
				reply_markup: subscriptionMenu,
			});
			return;
		}

		if (
			countMaxAds !== undefined &&
			registrationDate !== undefined &&
			publishDate !== undefined &&
			urls !== undefined
		) {
			await ctx.reply(
				`*🔎 Фильтры:*\n\n\n📃Количество объявлений: ${ctx.session.countMaxAds}\n📅 Дата регистрации: ${ctx.session.registrationDate}\n🕜 Дата публикации:  ${ctx.session.publishDate}\nКатегории : ${ctx.session.urls}\n📤Количество для выдачи: ${ctx.session.countOutput}\n`,
				{ reply_markup: BeginParse }
			);
			ctx.session.sbazarStep = "startingSbazar";
		} else {
			ctx.session.sbazarStep = "countMaxAds";
			await ctx.reply(
				"*🔎 Запуск поиска объявлений*\n\n📃 *Введите максимально допустимое количество активных объявлений у продавца*\n\n Пример : 10",
				{ reply_markup: cancel }
			);
			ctx.session.sbazarStep = "countMaxAds";
		}
	}
);
