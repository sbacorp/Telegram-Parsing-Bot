import { Conversation,Context} from "../types/index.ts";

export async function cbazar(conversation: Conversation, ctx: Context) {
  const movies: string[] = [];
  await ctx.reply("<b>🔎 Запуск поиска объявлений</b>\n\n📃 <b>Введите максимально допустимое количество активных объявлений у продавца</b>\n\n Пример : 10", {parse_mode:"HTML"});
  const countMaxAds = await conversation.form.number();
//   if(countMaxAds){
// 	await ctx.reply("<b> Введите коректное значение </b>")
// 	 const countMaxAds=await conversation.form.number();
//   }
  movies.push("Mаксимально  количество активных объявлений у продавца:"+" "+countMaxAds);
  await ctx.reply("🔎<b> Запуск поиска объявлений</b>\n\n 📅<b> Введите минимальную дату регистрации продавца</b>\n\n <b>— Пример: 2020</b>",{parse_mode:"HTML"});
  const countMinReg = await conversation.form.number();

//   if(countMinReg>2022 ){
// 	await ctx.reply("<b> Введите коректное значение </b>")
	
//   }
   movies.push("Дата регистрации продавца:"+" "+countMinReg);


  await ctx.reply("🔎<b> Запуск поиска объявлений</b>\n\n 🕜<b>  Введите минимальную дату публикации товара на сайте</b>\n\n <b>— Пример: 01-01-2020</b>",{parse_mode:"HTML"});
  const countMinPublic=await conversation.form.number();
  movies.push("Дата публикации товара на сайте:"+" "+countMinPublic);
  await ctx.reply(movies.map((m, i) => `${i + 1}. ${m}`).join("\n"));

   return;

}