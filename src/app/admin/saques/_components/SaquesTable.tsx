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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setData(initialData)
    setLoading(false)
  }, [initialData])

  useEffect(() => {
    const channel = supabase
      .channel('realtime-saques')
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
    try {
      setLoading(true)
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
      
      if (error) throw error
      
      setData(saques || [])
      setError(null)
    } catch (err) {
      console.error('Erro ao buscar saques:', err)
      setError('Falha ao carregar solicitações')
      toast.error('Erro ao atualizar dados')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: 'pago' | 'pendente') => {
    try {
      const { error } = await supabase
        .from('SolicitarSaque')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      toast.success(`Status atualizado para ${status}`)
      fetchSaques()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Chave PIX copiada!')
  }

  if (loading) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p>Carregando solicitações...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={fetchSaques}
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p>Nenhuma solicitação de saque encontrada</p>
        <p className="text-sm text-muted-foreground mt-2">
          Quando existirem solicitações, elas aparecerão aqui automaticamente
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table className="w-full border-collapse">
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
              <TableRow key={saque.id} className="hover:bg-muted/50">
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
                  <div className="text-xs text-muted-foreground truncate max-w-[160px]">
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
                    className={
                      saque.status === 'pendente' 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' 
                        : ''
                    }
                  >
                    {saque.status === 'pago' ? 'Pago' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
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
