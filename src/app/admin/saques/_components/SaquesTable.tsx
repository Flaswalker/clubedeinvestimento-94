// src/app/admin/saques/_components/SaquesTable.tsx
'use client'

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
import { Copy, MoreVertical } from 'lucide-react' // Usando Lucide (já instalado)
import { toast } from 'sonner' // Usando Sonner (já instalado)

type Saque = {
  id: string
  valor: number
  data: string
  status: 'pendente' | 'pago'
  pix: string
  email: string
  users: {
    nome: string
    celular: string
  }
}

export function SaquesTable({ data }: { data: Saque[] }) {
  const router = useRouter()

  const updateStatus = async (id: string, status: 'pago' | 'pendente') => {
    const { error } = await supabase
      .from('SolicitarSaque')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar status')
    } else {
      toast.success(`Status atualizado para ${status}`)
      router.refresh() // Atualização mais suave que window.location.reload()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.info('Chave PIX copiada!')
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
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
                {/* Coluna Cliente */}
                <TableCell>
                  <div className="font-medium">{saque.users.nome}</div>
                  <div className="text-xs text-muted-foreground">ID: {saque.id}</div>
                </TableCell>

                {/* Coluna Contato */}
                <TableCell>
                  <div className="text-sm">{saque.users.celular}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                    {saque.email}
                  </div>
                </TableCell>

                {/* Coluna Valor */}
                <TableCell className="text-right font-medium">
                  {saque.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                  <div className="text-xs text-muted-foreground">
                    {new Date(saque.data).toLocaleDateString('pt-BR')}
                  </div>
                </TableCell>

                {/* Coluna PIX */}
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

                {/* Coluna Status */}
                <TableCell>
                  <Badge 
                    variant={saque.status === 'pago' ? 'default' : 'outline'}
                    className={saque.status === 'pendente' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400' : ''}
                  >
                    {saque.status === 'pago' ? 'Pago' : 'Pendente'}
                  </Badge>
                </TableCell>

                {/* Coluna Ações */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
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
