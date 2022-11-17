import {
	InlineKeyboard,
} from "https://deno.land/x/grammy@v1.12.0/mod.ts";


export const helpMenu = new InlineKeyboard()
	.url(
		"Пользовательское соглашение",
		"telegra.ph/Polzovatelskoe-soglashenie-11-10-3"
	)
	.row()
	.url("Администрация", "t.me/xParserAdmin");
