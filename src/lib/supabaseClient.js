import { createClient } from "@supabase/supabase-js";
import { hasSupabaseEnv } from "./runtime";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = hasSupabaseEnv ? createClient(supabaseUrl, supabaseAnonKey) : null;
