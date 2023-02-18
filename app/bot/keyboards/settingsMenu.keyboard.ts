import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import { Context } from "../types/index.ts";

export const settingsMenu = new Menu("mainSettingsMenu")
	.text("🔽 Лог товара", (ctx: Context) => {
		ctx.answerCallbackQuery("⚠️ Неактивная кнопка⚠️");
	})
	.row()
	.text(
		(ctx: Context) =>
			ctx.session.showOwnerName === true ? "✅ Продавец" : "❌ Продавец",
		(ctx: Context) => {
			ctx.session.showOwnerName = !ctx.session.showOwnerName;
			ctx.menu.update();
		}
	)
	.text(
		(ctx: Context) => (ctx.session.showPrice === true ? "✅ Цена" : "❌ Цена"),
		(ctx: Context) => {
			ctx.session.showPrice = !ctx.session.showPrice;
			ctx.menu.update();
		}
	)
	.row()
	.text(
		(ctx: Context) =>
			ctx.session.showTitle === true ? "✅ Название" : "❌ Название",
		(ctx: Context) => {
			ctx.session.showTitle = !ctx.session.showTitle;
			ctx.menu.update();
		}
	)
	.row()
	.text("🔽  Модификации", (ctx: Context) => {
		ctx.answerCallbackQuery("⚠️ Неактивная кнопка⚠️");
	})
	.row()
	// .text(
	// 	(ctx: Context) =>
	// 		ctx.session.onlyWithPhone === true ? "✅ Только с номерами" : "❌ Только с номерами",
	// 	(ctx: Context) => {
	// 		ctx.session.onlyWithPhone = !ctx.session.onlyWithPhone;
	// 		ctx.menu.update();
	// 	}
	// )
	// .row()
	// .text(
	// 	(ctx: Context) =>
	// 		ctx.session.onlyWithWA === true ? "✅ Продавцы с WA" : "❌ Продавцы с WA",
	// 	(ctx: Context) => {
	// 		ctx.session.onlyWithWA = !ctx.session.onlyWithWA;
	// 		ctx.menu.update();
	// 	}
	// )
	// .row()
	.submenu("📤Кол-во для выдачи", "countOutputMenu")

	export const countOutputMenu = new Menu("countOutputMenu")
	.text("5", async(ctx: Context) => {
		ctx.session.countOutput = 5;
		await ctx.answerCallbackQuery("✅Готово");
	})
	.text("10", async(ctx: Context) => {
		ctx.session.countOutput = 10;
		await ctx.answerCallbackQuery("✅Готово");
	})
	.row()
	.text("15", async(ctx: Context) => {
		ctx.session.countOutput = 15;
		await ctx.answerCallbackQuery("✅Готово");
	})
	.text("20", async(ctx: Context) => {
		ctx.session.countOutput = 20;
		await ctx.answerCallbackQuery("✅Готово");
	})
	.row()
	.text("30",async(ctx:Context) => {
		ctx.session.countOutput = 30;
		await ctx.answerCallbackQuery("✅Готово");
	})
	.text("50",async(ctx:Context) => {
		ctx.session.countOutput = 50;
		await ctx.answerCallbackQuery("✅Готово");
	})
	.row()
	.back("◀️ Назад");