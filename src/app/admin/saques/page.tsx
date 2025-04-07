// src/app/admin/saques/page.tsx
import { SaquesTable } from './_components/SaquesTable'

export default async function SaquesPage() {
  let saques = []
  let error = null

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saques`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`)
    }
    
    saques = await res.json()
  } catch (err) {
    console.error('Falha ao carregar saques:', err)
    error = err.message
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Solicitações de Saque</h1>
      
      {error ? (
        <div className="text-red-500 p-4 border rounded-lg bg-red-50">
          Erro ao carregar dados: {error}
        </div>
      ) : (
        <SaquesTable initialData={saques} />
      )}
    </div>
  )
}
