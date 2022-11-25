import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import { Context } from "../types/index.ts";
import { cancel,personalAccountMenu } from "../keyboards/index.ts";

export const marketsMenu = new Menu("marketsMenu")



	.text(
		"🇨🇿 sbazar.cz",

		async (ctx: Context) => {
			const countMaxAds = ctx.session?.countMaxAds;
			const registrationDate = ctx.session?.registrationDate;
			const publishDate = ctx.session?.publishDate;

			
            if (ctx.session.userBalance == 0 || ctx.session.userBalance < 0){
				await ctx.reply('Недостаточно средств');
				await ctx.reply("Пополните баланс", { reply_markup: personalAccountMenu });
				return;
			};
			

			  if (
				countMaxAds !== undefined &&
				registrationDate !== undefined &&
				publishDate !== undefined

			) {
				await ctx.reply(
					`*🔎 Фильтры:*\n\n\n📃Кол\-во объявлений: ${ctx.session.countMaxAds}\n📅 Дата регистрации: ${ctx.session.registrationDate}\n🕜 Дата публикации:  ${ctx.session.publishDate}\n\n\n`
				);
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
