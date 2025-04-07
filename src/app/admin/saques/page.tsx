// src/app/admin/saques/page.tsx
import { SaquesTable } from './_components/SaquesTable'

export default async function SaquesPage() {
  // Busca via API route ou diretamente do Supabase
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saques`, {
    cache: 'no-store' // Garante dados sempre atualizados
  })
  
  if (!res.ok) {
    throw new Error('Falha ao carregar solicitações')
  }

  const saques = await res.json()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Solicitações de Saque</h1>
      <p className="text-muted-foreground">Gerenciar transferências de clientes</p>
      
      <SaquesTable initialData={saques} />
    </div>
  )
}
