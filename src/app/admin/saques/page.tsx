// src/app/admin/saques/page.tsx
const { data: saques, error } = await supabase
  .from('SolicitarSaque')
  .select(`
    id,
    valor,
    data,
    status,
    users:users!inner(
      nome,
      celular
    )
  `)
  .order('data', { ascending: false })
