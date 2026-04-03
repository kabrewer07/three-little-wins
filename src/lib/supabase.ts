import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Creates a new Supabase client instance for the whole app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)