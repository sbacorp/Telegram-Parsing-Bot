import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import { Context } from "../types/index.ts";
import { cancel,subscriptionMenu,BeginParse } from "../keyboards/index.ts";


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
					`*🔎 Фильтры:*\n\n\n📃Количество объявлений: ${ctx.session.countMaxAds}\n📅 Дата регистрации: ${ctx.session.registrationDate}\n🕜 Дата публикации:  ${ctx.session.publishDate}\nКатегории : ${ctx.session.urls}`,
					{ reply_markup: BeginParse }
				);
				ctx.session.sbazarStep = "startingSbazar";
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
