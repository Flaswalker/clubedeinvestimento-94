
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Utilizando constantes para os valores
const SUPABASE_URL = 'https://jsutxgkdzokeecdhkhmy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdXR4Z2tkem9rZWVjZGhraG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTk2NTAsImV4cCI6MjA1NjI3NTY1MH0.Y8lGe4o4cWNR28j3ed8exQ8Et8jIW1CquCwo8Ywc3Uk';

// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
