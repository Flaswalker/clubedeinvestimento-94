import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jsutxgkdzokeecdhkhmy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdXR4Z2tkem9rZWVjZGhraG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTk2NTAsImV4cCI6MjA1NjI3NTY1MH0.Y8lGe4o4cWNR28j3ed8exQ8Et8jIW1CquCwo8Ywc3Uk';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Tables = {
  users: {
    name: string;
    email: string;
    celular: string;
    cpf: string;
    is_admin: boolean;
    is_verified: boolean;
  };
  investments: {
    id: string;
    user_email: string;
    amount: number;
    period: number;
    start_date: string;
    end_date: string;
  };
  passwords: {
    email: string;
    password: string;
  };
};
