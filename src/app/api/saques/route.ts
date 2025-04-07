import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

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
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json(data)
}
