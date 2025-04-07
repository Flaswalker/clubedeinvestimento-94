// src/app/admin/saques/page.tsx
const { data: saques, error } = await supabase
  .from('SolicitarSaque')
  .select(`
    id,
    valor,
    data,
    status,
    pix,
    email,
    users:email (  // Relacionamento via campo email
      nome,
      celular
    )
  `)
  .order('data', { ascending: false })
