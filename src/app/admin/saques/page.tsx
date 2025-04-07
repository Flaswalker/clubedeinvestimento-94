// src/app/admin/saques/page.tsx

const { data: saques, error } = await supabase
  .from('SolicitarSaque')
  .select(`
    id,
    valor,
    data,
    status,
    pix,  // Added PIX field
    users:users!inner(
      nome,
      celular
    )
  `)
  .order('data', { ascending: false })
