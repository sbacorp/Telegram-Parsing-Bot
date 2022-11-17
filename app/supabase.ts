import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import "https://deno.land/x/dotenv/load.ts";

export const connection = createClient(Deno.env.get("SB_LINK"),Deno.env.get("SB_ANON_KEY"))
