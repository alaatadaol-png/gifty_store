import { createClient } from '@supabase/supabase-js';
import { appParams } from '@/lib/app-params';

export const supabase = createClient(
  appParams.supabaseUrl,
  appParams.supabaseAnonKey
);