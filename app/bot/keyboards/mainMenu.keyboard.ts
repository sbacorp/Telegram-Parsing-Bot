import {
	Keyboard,
} from "https://deno.land/x/grammy@v1.12.0/mod.ts";

export const mainMenu = new Keyboard()
	.text("🔎 Начать поиск")
	.row()
	.text("🔐 Личный кабинет")
	.text("⚙️ Настройки")
	.row()
	.text("📝 Помощь")
	.resized();