// app/api/saques/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Desativa cache

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Query otimizada com todos os campos necessários
    const { data, error } = await supabase
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
      console.error('Erro Supabase:', error)
      return NextResponse.json(
        { error: 'Falha ao buscar solicitações' },
        { status: 500 }
      )
    }

    // Verifica se há dados
    if (!data || data.length === 0) {
      return NextResponse.json([], { status: 200 })
    }

    // Formata os dados para garantir consistência
    const formattedData = data.map((saque) => ({
      id: saque.id,
      valor: saque.valor,
      data: saque.data,
      status: saque.status,
      pix: saque.pix,
      email: saque.email,
      users: saque.users ? {
        name: saque.users.name || null,
        celular: saque.users.celular || null
      } : null
    }))

    return NextResponse.json(formattedData)

  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
