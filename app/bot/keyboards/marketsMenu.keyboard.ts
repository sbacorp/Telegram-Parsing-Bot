import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import { Context } from "../types/index.ts";
export const marketsMenu = new Menu("marketsMenuMain")
	.text("🇨🇿 sbazar.cz", 
	async (ctx:Context) => {
		const countMaxAds = ctx.session?.countMaxAds;
		const registrationDate = ctx.session?.registrationDate;
		const publishDate = ctx.session?.publishDate;
		console.log(countMaxAds,registrationDate,publishDate);
		
		if (countMaxAds !== undefined && registrationDate !== undefined &&publishDate !==undefined) {
			await ctx.reply(`<b>🔎 Фильтры:</b>\n\n\n📃Кол-во объявлений: ${ctx.session.countMaxAds}\n📅 Дата регистрации: ${ctx.session.registrationDate}\n🕜 Дата публикации:  ${ctx.session.publishDate}\n\n\n`)
		} else {
			ctx.session.sbazarStep = "countMaxAds";
			await ctx.reply("<b>🔎 Запуск поиска объявлений</b>\n\n📃 <b>Введите максимально допустимое количество активных объявлений у продавца</b>\n\n Пример : 10")
			ctx.session.sbazarStep = "countMaxAds";
		}
	})
	.text("🇭🇺 jofagos.hu", async (ctx: Context) => {});
