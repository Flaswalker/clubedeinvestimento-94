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
    users!inner(email, nome, celular)
  `)
  .order('data', { ascending: false })

if (error) {
  console.error('Erro ao buscar saques:', error)
  return { error: 'Falha ao carregar saques' }
}

console.log('Saques encontrados:', saques) // Debug importante
