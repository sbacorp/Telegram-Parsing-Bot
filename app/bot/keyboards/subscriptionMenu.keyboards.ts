import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import {Context} from "../types/index.ts"
import { marketsMenu } from "./index.ts";
import {UserModel} from "../../server/models.ts"
 export const subscriptionMenu = new Menu ("subscriptionMenu")
.text("Купить на 1 день [ 4$ = 240p ]",
async (ctx: Context) => {
	const chatId = ctx.chat.id.toString();
	const user = await UserModel.findOne({where:{chatId:chatId}})
	if (Number(user.userBalance) >=Number(ctx.session.subOneDays)){
		user.userBalance -=ctx.session.subOneDays;
		user.save();
		ctx.session.subActive=true;
		await ctx.reply("Успешно", {reply_markup:marketsMenu});
		ctx.session.sbazarStep = "countMaxAds"
		
	}
	else{
		await ctx.reply("Недостаточно средств, пополните баланс");
		ctx.session.sbazarStep = "idle"
	}
}
)
.row()
.text("Купить на 3 день [ 6$ = 360p ]",
async (ctx: Context) => {
	const chatId = ctx.chat.id.toString();
	const user = await UserModel.findOne({where:{chatId:chatId}})
	if (Number(user.userBalance) >=Number(ctx.session.subThreeDays)){
		user.userBalance -=ctx.session.subThreeDays;
		user.save();
		ctx.session.subActive=true;
		await ctx.reply("Успешно", {reply_markup:marketsMenu});
		ctx.session.sbazarStep = "countMaxAds"
	}
	else{
		await ctx.reply("Недостаточно средств, пополните баланс");
		ctx.session.sbazarStep = "idle"
	}
})
.row()
.text("Купить на 7 день [ 13$ = 599p ]",
async (ctx: Context) => {
	const chatId = ctx.chat.id.toString();
	const user = await UserModel.findOne({where:{chatId:chatId}})
	if (Number(user.userBalance) >=Number(ctx.session.subSevenDays)){
		user.userBalance -=ctx.session.subSevenDays;
		user.save();
		ctx.session.subActive=true;
		await ctx.reply("Успешно", {reply_markup:marketsMenu});
		ctx.session.sbazarStep = "countMaxAds"
	}
	else{
		await ctx.reply("Недостаточно средств, пополните баланс");
		ctx.session.sbazarStep = "idle"
	}
})
.row()
.text("Купить на 31 день [ 50$ = 3000p ]",
async (ctx: Context) => {
	const chatId = ctx.chat.id.toString();
	const user = await UserModel.findOne({where:{chatId:chatId}})
	if (user.userBalance >=ctx.session.subMonth){
		user.userBalance -=ctx.session.subMonth;
		user.save();
		ctx.session.subActive=true;
		await ctx.reply("Успешно", {reply_markup:marketsMenu});
		ctx.session.sbazarStep = "countMaxAds"
	}
	else{
		await ctx.reply("Недостаточно средств, пополните баланс");
		ctx.session.sbazarStep = "idle"
	}
})
.row()
.text("◀️ Назад",
async (ctx: Context) => {
	await ctx.reply(await ctx.reply("*Выберите площадку :*", {
		reply_markup: marketsMenu,
		disable_web_page_preview: true,
	}))
});
