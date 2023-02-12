import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import {UserModel} from '../../server/models.ts'
import {Context} from "../types/index.ts"
import { cancel } from "./index.ts";
export const personalAccountMenu = new Menu("personalAccountMenu")
	.submenu("💳 Пополнить баланс", "payments")
	.row()
	.text("🎫 Активировать промокод", async (ctx:Context) => {
		ctx.reply("*Введите промокод*", { reply_markup: cancel });
		console.log(ctx.chat.id);
		ctx.session.sbazarStep = 'promo'

	});