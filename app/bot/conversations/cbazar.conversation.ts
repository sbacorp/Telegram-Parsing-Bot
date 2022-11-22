import { Conversation, Context } from "../types/index.ts";

let hui = false;
export async function cbazar(conversation: Conversation, ctx: Context) {
  await ctx.reply(
		"<b>🔎 Запуск поиска объявлений</b>\n\n📃 <b>Введите максимально допустимое количество активных объявлений у продавца</b>\n\n Пример : 10",
		{ parse_mode: "HTML" }
	);
	while (!hui) {
		const ok = await waitForNumber(conversation, ctx);
		if (ok) {
			await ctx.reply("Все правильно ");
			hui = true;
      return;
		} else {
			await ctx.reply("Введите коректное значение ");
		}
	}
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
