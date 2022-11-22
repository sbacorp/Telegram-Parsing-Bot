import { Conversation, Context } from "../types/index.ts";


export async function cbazar(conversation: Conversation, ctx: Context) {
  while (ctx.session.step ==='1') {
		await ctx.reply(
			"<b>🔎 Запуск поиска объявлений</b>\n\n📃 <b>Введите максимально допустимое количество активных объявлений у продавца</b>\n\n Пример : 10",
			{ parse_mode: "HTML" }
		);
		const ok = await waitForNumber(conversation, ctx);
		if (ok) {
			await ctx.reply("Все правильно ");
			ctx.session.step = "2"
			console.log(ctx.session.step);
		} else {
			await ctx.reply("Введите коректное значение");
		}
	}
	while (ctx.session.step ==='2') {
		await ctx.reply(
			"<b>🔎 2 Запуск поиска объявлений</b>\n\n📃 <b>Введите максимально допустимое количество активных объявлений у продавца</b>\n\n Пример : 10",
			{ parse_mode: "HTML" }
		);
		const ok = await waitForNumber(conversation, ctx);
		if (ok) {
			await ctx.reply("Все правильно ");
			ctx.session.step ='3'
    
		} else {
			await ctx.reply("Введите коректное значение ");
		}
	}
  return ;
}

async function waitForNumber(conversation: Conversation, ctx: Context) {
	const countMaxAds = await conversation.wait();
	const prov = parseInt(countMaxAds.message.text);
	console.log(prov);

	//  if (prov.valueOf()===NaN){
	//   await ctx.reply("Введите коректное значение ");
	//   const newConst =await conversation.wait();
	//  }
	//  else {
	//   await ctx.reply("Все четко" )
	//  }
	return !Number.isNaN(prov.valueOf());
}
