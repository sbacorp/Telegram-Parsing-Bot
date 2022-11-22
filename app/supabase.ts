import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import "https://deno.land/x/dotenv/load.ts";
import { SupabaseAdapter } from "https://deno.land/x/grammy_storage_supabase@v0.1.0/mod.ts";

export const connection = createClient(Deno.env.get("SB_LINK"),Deno.env.get("SB_ANON_KEY"))
