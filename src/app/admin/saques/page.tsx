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

if (error) {
  console.error('Erro ao buscar saques:', error)
  throw new Error('Falha ao carregar solicitações de saque')
}
