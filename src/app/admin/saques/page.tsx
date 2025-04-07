// src/app/admin/saques/page.tsx
const { data: saques, error } = await supabase
  .from('SolicitarSaque')
  .select(`
    id,
    valor,
    data,
    status,
    pix,  // Adicione esta linha
    email,  // Adicione esta linha
    users:users!inner(
      nome,
      celular
    )
  `)
  .order('data', { ascending: false })
