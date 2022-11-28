import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import "https://deno.land/x/dotenv/load.ts";

export const connection = createClient(
	"https://xvxxeliluchyhwncvncg.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmbHdheWRseXZvcWVhcmh2Z252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU4ODQwMjcsImV4cCI6MTk4MTQ2MDAyN30.m1Bm3JXIkzMVhFTxMlHFp59fpUMGN9Gp_tvHp43iEnA"
);
