import { Menu } from "https://deno.land/x/grammy_menu@v1.1.2/mod.ts";
import { Context } from "../types/index.ts";

export const marketsMenu = new Menu("marketsMenuMain")
	.text("🇨🇿 sbazar.cz", async (ctx: Context) => {
		await ctx.conversation.enter("cbazar");
	})
	.text("🇭🇺 jofagos.hu", async (ctx: Context) => {
		await ctx.conversation.enter("jofagos");
	});
