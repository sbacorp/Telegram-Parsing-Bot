import { Router } from "https://deno.land/x/grammy_router@v2.0.0/router.ts";
import { parse } from "../../server/parsers/cbazar.ts";
import { cancel,mainMenu } from "../keyboards/index.ts";
import { Context } from "../types/index.ts";

export const router = new Router<Context>((ctx) => ctx.session.sbazarStep);


const sub = router.route("sub");
sub.on("message:text", async (ctx) => {
  if (ctx.msg.text==='отмена') {
    await ctx.reply(`Действие отменено`);
	await ctx.reply(" Выберите действие ",{reply_markup:mainMenu });
	ctx.session.sbazarStep = "idle";
    return;
  }
});
const countMaxAds = router.route("countMaxAds");
countMaxAds.on("message:text", async (ctx:Context) => {
	/**
	 * !первая омтена 
	 */
  if (ctx.msg.text==='отмена') {
    await ctx.reply(`Действие отменено`);
	await ctx.reply(" Выберите действие ",{reply_markup:mainMenu });  
	ctx.session.sbazarStep = "idle";
    return;
  }
	const countMaxAds = parseInt(ctx.msg.text);
	if (isNaN(countMaxAds) || countMaxAds < 1) {
		await ctx.reply("Неверно, повторите попытку");
		return;
	}
	ctx.session.countMaxAds = countMaxAds;
	
	await ctx.reply("*Готово*");
	await ctx.reply(
		"*🔎 Запуск поиска объявлений*\n\n📃 *Введите минимальную дату регистрации продавца*\n\n Пример : 2020",
		{ reply_markup: cancel }
	);
	ctx.session.sbazarStep = "registrationDate";
});

 countMaxAds.use(async (ctx:Context) => await ctx.reply({ reply_markup: cancel }));

const registrationDate = router.route("registrationDate");
registrationDate.on("message:text", async (ctx:Context) => {
	const countMaxAds = ctx.session.countMaxAds;
	if (countMaxAds === undefined) {
		await ctx.reply("Предыдущий фильтр не определен");
		ctx.session.sbazarStep = "countMaxAds";
		return;
    }
/**
 * !втоаря омтена 
 */
	if(ctx.msg.text==='отмена'){
		await ctx.reply(`Действие отменено`);
		await ctx.reply(
			"*🔎 Запуск поиска объявлений*\n\n📃 *Введите максимально допустимое количество активных объявлений у продавца*\n\n Пример : 10");
        ctx.session.sbazarStep = "countMaxAds";
        return;
	}

	const registrationDate = parseInt(ctx.msg.text);
	if (
		isNaN(registrationDate) ||
		registrationDate > 2022 ||
		registrationDate < 2000
	) {
		await ctx.reply("Неверный год\n повторите попытку");
		return;
	}
	
	ctx.session.registrationDate = registrationDate;
	await ctx.reply("Готово");
	await ctx.reply(
		"*🔎 Запуск поиска объявлений*\n\n📃 *Введите минимальную дату публикации товара `дней назад`*\n\n Пример : 3",
		{ reply_markup: cancel }	 
	);
	ctx.session.sbazarStep = "publishDate";
});

const publishDate = router.route("publishDate");
publishDate.on("message:text", async (ctx:Context) => {
	const registrationDate = ctx.session.registrationDate;
	if (registrationDate === undefined) {
		await ctx.reply("предыдущий фильтр не определен");
		ctx.session.sbazarStep = "registrationDate";
		return;
	}
	/**
    * !третья омтена 
    */
	 if ( ctx.msg.text ==='отмена'){
		await ctx.reply(`Действие отменено`);
		await ctx.reply(
			"*🔎 Запуск поиска объявлений*\n\n📃 *Введите минимальную дату регистрации продавца*\n\n Пример : 2020");
        ctx.session.sbazarStep = "registrationDate";
        return;
	}
	

	const publishDate = parseInt(ctx.msg.text);
	if (isNaN(publishDate) || publishDate < 1) {
		await ctx.reply("*Неверно, повторите попытку\!*");
		return;
	}
	ctx.session.publishDate = publishDate;
	await ctx.reply(
		`*Фильтры:*\n\n\n📃Количество объявлений: ${ctx.session.countMaxAds}\n📅 Дата регистрации: ${ctx.session.registrationDate}\n🕜 Дата публикации:  ${ctx.session.publishDate}\n📤Количество для выдачи: ${ctx.session.countOutput}`,{ reply_markup: cancel }
	);
	
	const values = { productsCount: Number(ctx.session.countMaxAds), daysAgo: Number(ctx.session.publishDate), year: 2022-Number(ctx.session.registrationDate), count: ctx.session.countOutput};
	await parse(ctx, values);
	ctx.session.sbazarStep = "idle";
});
router.otherwise(async (ctx) => ctx.answerCallbackQuery("Ошибка"));
