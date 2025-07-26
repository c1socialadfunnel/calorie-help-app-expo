import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://limlwtqlxrymgdhpzazk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpbWx3dHFseHJ5bWdkaHB6YXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDQ3MTQsImV4cCI6MjA2OTAyMDcxNH0.5kHwYXPlu5ErRBhEGbZZ81YmK_xBTWpgQkMZZZRBIoU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
