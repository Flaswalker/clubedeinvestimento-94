// src/app/admin/saques/page.tsx
import { createClient } from '@/lib/supabase/server'
import { SaquesTable } from './_components/SaquesTable'

export default async function SaquesPage() {
  const supabase = createClient()

  const { data: saques, error } = await supabase
    .from('SolicitarSaque')
    .select(`
      id,
      valor,
      data,
      status,
      pix,
      email,
      users:users!inner(
        name,
        celular
      )
    `)
    .order('data', { ascending: false })

  if (error) {
    console.error('Erro ao buscar saques:', error)
    return (
      <div className="p-8 text-red-500">
        Erro ao carregar solicitações: {error.message}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Solicitações de Saque</h1>
      <SaquesTable initialData={saques || []} />
    </div>
  )
}
