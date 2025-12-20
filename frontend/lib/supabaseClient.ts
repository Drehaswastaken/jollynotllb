
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Fallback for build time or missing credentials
// We must provide a valid-looking URL to prevent createClient from throwing, even if it won't work.
const safeUrl = supabaseUrl || "https://placeholder.supabase.co";
const safeKey = supabaseAnonKey || "placeholder-key";

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') console.warn("Supabase credentials missing! Authentication will not work.");
}

export const isConfigured = !!supabaseUrl && !!supabaseAnonKey;
export const supabase = createClient(safeUrl, safeKey);
