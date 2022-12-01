import { Router } from "https://deno.land/x/grammy_router@v2.0.0/router.ts";
import { parse } from "../../server/parsers/cbazar.ts";
import { allowedCategories } from "../headers.ts";
import { cancel,mainMenu,BeginParse} from "../keyboards/index.ts";
import { Context } from "../types/index.ts";
import {UserModel} from "../../server/models.ts"
export const router = new Router<Context>((ctx) => ctx.session.sbazarStep);
const promo = router.route("promo");

promo.on("message:text", async (ctx:Context) => {  
  if (ctx.msg.text==='отмена') {
    await ctx.reply(`Действие отменено`);
	await ctx.reply(" Выберите действие ",{reply_markup:mainMenu });
	ctx.session.sbazarStep = "idle";
    return;
  }
  if (ctx.msg.text==='promo1') {
		try {
			const chatId = ctx.chat.id.toString();
			const user = await UserModel.findOne({where:{chatId:chatId}})
			user.userBalance +=10;
			user.save();
		} catch (e) {
			console.log(e);
			ctx.replyWithHTML(e)
		}
		ctx.reply('*Успешно*', {reply_markup:mainMenu});
	ctx.session.sbazarStep = "idle";
    return;
  }

});

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
		await ctx.reply("*Неверно, повторите попытку*");
		return;
	}

	ctx.session.publishDate = publishDate;
	await ctx.reply("Готово");
	await ctx.replyWithHTML(
		"<b>🔎 Запуск поиска объявлений</b>\n\n📃 <b>Введите через запятую намера категорий для парсинга</b>\n\n Пример : https://wwwsbazarcz/30-elektro-pocitace => номер 30",
		{ reply_markup: cancel }	 
	);
	ctx.session.sbazarStep = "getUrls";
	
});



const getUrls = router.route("getUrls");
getUrls.on("message:text", async (ctx:Context) => {
	const publishDate = ctx.session.publishDate;
	if (publishDate === undefined) {
		await ctx.reply("предыдущий фильтр не определен");
		ctx.session.sbazarStep = "publishDate";
		return;
	}
	/**
    * !четвертая омтена
    */
	 if ( ctx.msg.text ==='отмена'){
		await ctx.reply(`Действие отменено`);
		await ctx.reply(
			"*🔎 Запуск поиска объявлений*\n\n📃 *Введите минимальную дату публикации товара `дней назад`*\n\n Пример : 3");
		ctx.session.sbazarStep = "publishDate";
		return;
	}
	const urls = ctx.msg.text.split(',')
		for ( var i=0;i <urls.length;i++ ){
			console.log(urls[i]);
			 const found =allowedCategories.includes(urls[i])
			if (found){
				console.log("Все заебись");
			}
			else {
				console.log("eror");
				await ctx.reply("*Неверно, повторите попытку*");
				return;
			}
		};
		ctx.session.urls = urls;
		
		await ctx.reply(
		`*Фильтры:*\n\n\n📃Количество объявлений: ${ctx.session.countMaxAds}\n📅 Дата регистрации: ${ctx.session.registrationDate}\n🕜 Дата публикации:  ${ctx.session.publishDate}\n📤Количество для выдачи: ${ctx.session.countOutput}\nКатегории: :${ctx.session.urls}`,{ reply_markup: BeginParse }
	);
	
	ctx.session.sbazarStep = "startingSbazar";
	
});

const startingSbazar = router.route("startingSbazar");
startingSbazar.on("message:text", async (ctx:Context) => {
if (ctx.msg.text==='Начать парсинг'){
	const values = { productsCount: Number(ctx.session.countMaxAds), daysAgo: Number(ctx.session.publishDate), year: 2022-Number(ctx.session.registrationDate), count: ctx.session.countOutput};
	await parse(ctx, values, ctx.session.urls);
}
	if (ctx.msg.text ==='Изменить фильтры'){
			await ctx.reply(
				"*🔎 Запуск поиска объявлений*\n\n📃 *Введите максимально допустимое количество активных объявлений у продавца*\n\n Пример : 10",
			{ reply_markup: cancel }	 
		);
		ctx.session.sbazarStep = "countMaxAds";
		return;
	}
});


router.otherwise(async (ctx) => ctx.answerCallbackQuery("Ошибка"));
