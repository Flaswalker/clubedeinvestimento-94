// services/DatabaseService.ts
static async getUserPixTransactions(userId: string) {
  const { data, error } = await supabase
    .from('pix_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
