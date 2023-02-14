import { serve } from "https://deno.land/std@0.154.0/http/server.ts";
import { bot } from "../bot/index.ts";
import { webhookCallback } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { sequelize } from "../server/db.ts";

const handleUpdate = webhookCallback(bot, "std/http");
serve(async (req) => {
  if (req.method == "POST") {
    const url = new URL(req.url);
    if (url.pathname.slice(1) == bot.token) {
      try {
        return await handleUpdate(req);
      } catch (err) {
        console.error(err);
        
      }
    }
  }
  return new Response();
});