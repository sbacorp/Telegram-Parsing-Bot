import { Context as DefaultContext,SessionFlavor } from "https://deno.land/x/grammy@v1.11.2/mod.ts";
import type { ParseModeContext } from "https://deno.land/x/grammy_parse_mode@1.5.0/mod.ts";
import {
	type Conversation as DefaultConversation,
	type ConversationFlavor
} from "https://deno.land/x/grammy_conversations@v1.0.3/mod.ts";
import {
	EmojiFlavor
  } from "https://deno.land/x/grammy_emoji@v1.1.2/mod.ts";

import { SessionData } from "./session.ts";

export type Context =  DefaultContext & SessionFlavor<SessionData> & ConversationFlavor & ParseModeContext
export type Conversation = DefaultConversation<Context>;