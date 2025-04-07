// src/app/admin/saques/_components/SaquesTable.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Copy, MoreVertical } from 'lucide-react'
import { toast } from 'sonner'

type Saque = {
  id: string
  valor: number
  data: string
  status: 'pendente' | 'pago'
  pix: string
  email: string
  users: {
    name: string | null
    celular: string | null
  } | null
}

export function SaquesTable({ initialData }: { initialData: Saque[] }) {
  const [data, setData] = useState<Saque[]>(initialData)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const channel = supabase
      .channel('realtime saques')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'SolicitarSaque'
      }, () => {
        fetchSaques()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchSaques = async () => {
    setLoading(true)
    const { data: saques, error } = await supabase
      .from('SolicitarSaque')
      .select(`
        id, valor, data, status, pix, email,
        users(name, celular)
      `)
      .order('data', { ascending: false })
    
    if (!error && saques) setData(saques)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: 'pago' | 'pendente') => {
    const { error } = await supabase
      .from('SolicitarSaque')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar status')
    } else {
      toast.success(`Status atualizado para ${status}`)
      fetchSaques()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.info('Chave PIX copiada!')
  }

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[180px]">Cliente</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Chave PIX</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((saque) => (
              <TableRow key={saque.id}>
                <TableCell>
                  <div className="font-medium">
                    {saque.users?.name || 'Cliente não encontrado'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {saque.id}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {saque.users?.celular || 'Não informado'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {saque.email}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {saque.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                  <div className="text-xs text-muted-foreground">
                    {new Date(saque.data).toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-mono text-sm truncate max-w-[120px] inline-block">
                            {saque.pix || 'Não informado'}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-[300px] break-all">{saque.pix}</p>
                        </TooltipContent>
                      </Tooltip>
                      {saque.pix && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(saque.pix)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={saque.status === 'pago' ? 'default' : 'outline'}
                    className={saque.status === 'pendente' ? 'bg-amber-100 text-amber-800' : ''}
                  >
                    {saque.status === 'pago' ? 'Pago' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateStatus(saque.id, 'pago')}>
                        Marcar como Pago
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(saque.id, 'pendente')}>
                        Reverter para Pendente
                      </DropdownMenuItem>
                      {saque.pix && (
                        <DropdownMenuItem onClick={() => copyToClipboard(saque.pix)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar PIX
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
