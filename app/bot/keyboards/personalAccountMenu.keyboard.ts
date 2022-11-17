import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";

export const personalAccountMenu = new Menu("personalAccountMenu")
	.submenu("💳 Пополнить баланс", "payments")
	.row()
	.text("🎫 Активировать промокод");