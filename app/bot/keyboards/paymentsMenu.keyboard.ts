import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";

export const paymentsMenu = new Menu("payments")
.text("💳 qiwi/карта")
.row()
.text("💎 CryptoBot")
.row()
.back("◀️ Назад");
