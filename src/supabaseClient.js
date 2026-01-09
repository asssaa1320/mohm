import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rgaysqgcfvxgcnkubymz.supabase.co'
const supabaseKey = 'sb_publishable_ZEbh2lSgLQXl6xtg7AIfBg_3A0AUBwL'

export const supabase = createClient(supabaseUrl, supabaseKey)
