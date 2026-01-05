import { createClient } from '@supabase/supabase-js'

// Estos datos los sacas de tu panel de Supabase
const supabaseUrl = 'https://hhapopvdhddkpwpdubqi.supabase.co'
const supabaseAnonKey = 'sb_publishable_FvSC-I_XrGetjQ1XvAIUYg_T00VRXBj'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)