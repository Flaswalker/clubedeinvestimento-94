import { supabase } from './supabase'; // Ajuste conforme sua estrutura

export const DatabaseService = {
  // Método para criar transação PIX
  async createPixTransaction(userId: string, amount: number) {
    const { data, error } = await supabase
      .from('pix_transactions')
      .insert([
        {
          user_id: userId,
          amount,
          status: 'pending',
          expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao criar transação PIX:', error);
      throw error;
    }

    return data[0];
  },

  // Método para atualizar transação com QR Code
  async updatePixWithQrCode(transactionId: string, qrData: {
    qr_code: string;
    qr_code_image: string;
    transaction_id: string;
  }) {
    const { data, error } = await supabase
      .from('pix_transactions')
      .update(qrData)
      .eq('id', transactionId)
      .select();

    if (error) {
      console.error('Erro ao atualizar PIX:', error);
      throw error;
    }

    return data[0];
  },

  // Outros métodos do banco de dados...
  async getUserInvestments(email: string) {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_email', email);

    if (error) throw error;
    return data;
  }
};
