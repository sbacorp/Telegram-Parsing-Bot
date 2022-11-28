import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import { Context } from "../types/index.ts";
import { cancel,subscriptionMenu } from "../keyboards/index.ts";
import { parse } from "../../server/parsers/cbazar.ts";


export const marketsMenu = new Menu("marketsMenu")
	.text(
		"🇨🇿 sbazar.cz",

		async (ctx: Context) => {
			const countMaxAds = ctx.session?.countMaxAds;
			const registrationDate = ctx.session?.registrationDate;
			const publishDate = ctx.session?.publishDate;
			const urls = ctx.session?.urls;
			if (ctx.session.subActive ===false){
				ctx.session.sbazarStep = 'sub'
				await ctx.reply('Подписка не активна',{reply_markup:subscriptionMenu});
				return;
			};
			

			  if (
				countMaxAds !== undefined &&
				registrationDate !== undefined &&
				publishDate !== undefined&& urls !== undefined
			) {
				await ctx.reply(
					`*🔎 Фильтры:*\n\n\n📃Количество объявлений: ${ctx.session.countMaxAds}\n📅 Дата регистрации: ${ctx.session.registrationDate}\n🕜 Дата публикации:  ${ctx.session.publishDate}\nКатегории : ${ctx.session.urls}`
				);
				const values = { productsCount: Number(ctx.session.countMaxAds), daysAgo: Number(ctx.session.publishDate), year: 2022-Number(ctx.session.registrationDate), count: ctx.session.countOutput};
				await parse(ctx, values, urls);
			} else {
				ctx.session.sbazarStep = "countMaxAds";
				await ctx.reply(
					"*🔎 Запуск поиска объявлений*\n\n📃 *Введите максимально допустимое количество активных объявлений у продавца*\n\n Пример : 10",
					{ reply_markup: cancel} 
				);
				await ctx.reply({reply_markup: marketsMenu})
				ctx.session.sbazarStep = "countMaxAds";
			}
			
		}
	)
	.text("🇭🇺 jofagos.hu", async (ctx: Context) => {});
