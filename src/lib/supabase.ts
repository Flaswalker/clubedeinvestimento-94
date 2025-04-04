
import { createClient } from '@supabase/supabase-js';

// Utilizando constantes para os valores
const SUPABASE_URL = 'https://jsutxgkdzokeecdhkhmy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdXR4Z2tkem9rZWVjZGhraG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTk2NTAsImV4cCI6MjA1NjI3NTY1MH0.Y8lGe4o4cWNR28j3ed8exQ8Et8jIW1CquCwo8Ywc3Uk';

// Criando e exportando o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
