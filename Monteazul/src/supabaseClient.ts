import { createClient } from '@supabase/supabase-js'

// Preferir variables de entorno de Vite (VITE_SUPABASE_*) y usar fallback para desarrollo
const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL
	? import.meta.env.VITE_SUPABASE_URL
	: 'https://hhapopvdhddkpwpdubqi.supabase.co';

const supabaseAnonKey = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY
	? import.meta.env.VITE_SUPABASE_ANON_KEY
	: 'sb_publishable_FvSC-I_XrGetjQ1XvAIUYg_T00VRXBj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)