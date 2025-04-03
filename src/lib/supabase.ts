
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jsutxgkdzokeecdhkhmy.supabase.co';
const supabaseKey = '';

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
