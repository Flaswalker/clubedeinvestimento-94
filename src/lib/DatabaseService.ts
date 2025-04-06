import { supabase } from "@/lib/supabase"; // Ajuste o caminho conforme necessário

export default class DatabaseService {
  // Método para obter investimentos do usuário
  static async getUserInvestments(email: string) {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_email', email);

    if (error) throw error;
    return data;
  }

  // Método para criar transações PIX
  static async createPixTransaction(transactionData: {
    user_id: string;
    amount: number;
    description?: string;
  }) {
    const { data, error } = await supabase
      .from('pix_transactions')
      .insert([{
        ...transactionData,
        status: 'pending',
        expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }])
      .select();

    if (error) throw error;
    return data[0];
  }

  // Método para atualizar transação PIX com QR code
  static async updatePixTransaction(id: string, updateData: {
    qr_code?: string;
    qr_code_image?: string;
    transaction_id?: string;
    status?: string;
  }) {
    const { data, error } = await supabase
      .from('pix_transactions')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }

  // Método para obter transações PIX do usuário
  static async getUserPixTransactions(userId: string) {
    const { data, error } = await supabase
      .from('pix_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}
