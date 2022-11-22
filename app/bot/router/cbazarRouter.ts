import { Router } from "https://deno.land/x/grammy_router@v2.0.0/router.ts";
import { Context } from "../types/index.ts";

export const router = new Router<Context>((ctx) => ctx.session.sbazarStep);


const countMaxAds = router.route("countMaxAds");
countMaxAds.on("message:text", async (ctx) => {
  const countMaxAds = parseInt(ctx.msg.text);
  if (isNaN(countMaxAds) || countMaxAds < 1) {
    await ctx.reply("Неверно, повторите попытку!");
    return;
  }
  ctx.session.countMaxAds = countMaxAds;
  ctx.session.sbazarStep = "registrationDate";
  await ctx.reply("Готово");
  await ctx.reply("<b>🔎 Запуск поиска объявлений</b>\n\n📃 <b>Введите минимальную дату регистрации продавца</b>\n\n Пример : 2020")
  ctx.session.sbazarStep = "registrationDate";
});
const registrationDate = router.route("registrationDate");
registrationDate.on("message:text", async (ctx) => {
  const countMaxAds = ctx.session.countMaxAds;
  if (countMaxAds === undefined) {
    await ctx.reply("предыдущий фильтр не определен");
    ctx.session.sbazarStep = "countMaxAds";
    return;
  }

  const registrationDate = parseInt(ctx.msg.text);
  if (isNaN(registrationDate) || registrationDate >2022 ||registrationDate <2000 ) {
    await ctx.reply("Неверный год\n повторите попытку");
    return;
  }
  ctx.session.registrationDate = registrationDate;
  await ctx.reply("Готово");
  await ctx.reply("<b>🔎 Запуск поиска объявлений</b>\n\n📃 <b>Введите минимальную дату публикации товара</b>\n\n Пример : 11-11-2022")
  ctx.session.sbazarStep = "publishDate";
});

const publishDate = router.route("publishDate");
publishDate.on("message:text", async (ctx) => {
  const registrationDate = ctx.session.registrationDate;

  if (registrationDate === undefined) {
    await ctx.reply("предыдущий фильтр не определен");
    ctx.session.sbazarStep = "registrationDate";
    return;
  }

  const publishDate = parseInt(ctx.msg.text);
  console.log(publishDate);
  
  if (isNaN(registrationDate) || publishDate ===2) {
    await ctx.reply("Неверная дата\n повторите попытку");
    return;
  }
  ctx.session.publishDate = publishDate;
  await ctx.reply(`<b>🔎 Фильтры:</b>\n\n\n📃Кол-во объявлений: ${ctx.session.countMaxAds}\n📅 Дата регистрации: ${ctx.session.registrationDate}\n🕜 Дата публикации:  ${ctx.session.publishDate}\n\n\n`)
  ctx.session.sbazarStep = "idle";
});
router.otherwise(async (ctx) =>  ctx.answerCallbackQuery('Ошибка'));
