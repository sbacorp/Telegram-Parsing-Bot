import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import { UserModel } from "../../server/models.ts";

export const paymentsMenu = new Menu("payments")
    .text("Временно недоступно, получите промокод у админа")
	.row()
	.text("💳 qiwi/карта")
	.row()
	.text("💎 CryptoBot")
	.row()
	.back("◀️ Назад");