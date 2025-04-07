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
    users!inner(
      name,
      celular
    )
  `)
  .order('data', { ascending: false })

console.log('Dados retornados:', saques) // Verifique no console do navegador
