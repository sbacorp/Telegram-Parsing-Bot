import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import { Context } from "../types/index.ts";


export const settingsMenu = new Menu("mainSettingsMenu")
	.text("🔽 Лог товара", (ctx: Context) => {
		ctx.answerCallbackQuery("⚠️ Неактивная кнопка⚠️");
	})
	.row()
	.text(
		(ctx: Context) =>
			ctx.session.showPhoto === true ? "✅ Фото" : "❌ Фото",
		(ctx: Context) => {
			ctx.session.showPhoto = !ctx.session.showPhoto;
			ctx.menu.update();
		}
	)
	.text(
		(ctx: Context) =>
			ctx.session.showOwnerName === true ? "✅ Имя" : "❌ Имя",
		(ctx: Context) => {
			ctx.session.showOwnerName = !ctx.session.showOwnerName;
			ctx.menu.update();
		}
	)
	.text(
		(ctx: Context) =>
			ctx.session.showPrice === true ? "✅ Цена" : "❌ Цена",
		(ctx: Context) => {
			ctx.session.showPrice = !ctx.session.showPrice;
			ctx.menu.update();
		}
	)
	.row()
	.text(
		(ctx: Context) =>
			ctx.session.showLocation === true ? "✅ Локация" : "❌ Локация",
		(ctx: Context) => {
			ctx.session.showLocation = !ctx.session.showLocation;
			ctx.menu.update();
		}
	)
	.text(
		(ctx: Context) =>
			ctx.session.showDesc === true ? "✅ Описание" : "❌ Описание",
		(ctx: Context) => {
			ctx.session.showDesc = !ctx.session.showDesc;
			ctx.menu.update();
		}
	)
	.text(
		(ctx: Context) =>
			ctx.session.showTitle === true ? "✅ Название" : "❌ Название",
		(ctx: Context) => {
			ctx.session.showTitle = !ctx.session.showTitle;
			ctx.menu.update();
		}
	)
	.row()
	// .text("🔽 Отображене фильтров", (ctx: Context) => {
	// 	ctx.answerCallbackQuery("⚠️ Неактивная кнопка⚠️");
	// })
	// .row()
	// .text(
	// 	(ctx: Context) =>
	// 		ctx.session.showPublishTimeF === true
	// 			? "✅ Дата публикации"
	// 			: "❌ Дата публикации",
	// 	(ctx: Context) => {
	// 		ctx.session.showPublishTimeF = !ctx.session.showPublishTimeF;
	// 		ctx.menu.update();
	// 	}
	// )
	// .text(
	// 	(ctx: Context) =>
	// 		ctx.session.showRegistrationDateF === true
	// 			? "✅ Дата регистрации"
	// 			: "❌ Дата регистрации",
	// 	(ctx: Context) => {
	// 		ctx.session.showRegistrationDateF = !ctx.session.showRegistrationDateF;
	// 		ctx.menu.update();
	// 	}
	// )
	// .row()
	// .text(
	// 	(ctx: Context) =>
	// 		ctx.session.showViewsF === true
	// 			? "✅ Кол-во просмотров"
	// 			: "❌ Кол-во просмотров",
	// 	(ctx: Context) => {
	// 		ctx.session.showViewsF = !ctx.session.showViewsF;
	// 		ctx.menu.update();
	// 	}
	// )
	// .text(
	// 	(ctx: Context) =>
	// 		ctx.session.showCountItemsF === true
	// 			? "✅ Кол-во объявлений"
	// 			: "❌ Кол-во объявлений",
	// 	(ctx: Context) => {
	// 		ctx.session.showCountItemsF = !ctx.session.filters.showCountItemsF;
	// 		ctx.menu.update();
	// 	}
	// )
	// .row()
	.text("🔽  Модификации", (ctx: Context) => {
		ctx.answerCallbackQuery("⚠️ Неактивная кнопка⚠️");
	})
	.row()
	.text("Объявления с номерами", "isPhoneExists")
	.row()
	.text("Продавцы с WA", "checkWA")
	.row()
	.text("✅Только непросмотренные объявления", "isUnwathced")
	.row()
	.text("📤Кол-во для выдачи", "outputCount");
