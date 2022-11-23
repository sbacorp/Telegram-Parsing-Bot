import {
	Keyboard,
} from "https://deno.land/x/grammy@v1.12.0/mod.ts";

export const cancel = new Keyboard()
	.text("отмена")
	.resized()
	.oneTime()
