import {
	Keyboard,
} from "https://deno.land/x/grammy@v1.12.0/mod.ts";

export const BeginParse = new Keyboard()
    .text("Изменить фильтры")
	.text("Начать парсинг ")
	.resized()
	.oneTime()