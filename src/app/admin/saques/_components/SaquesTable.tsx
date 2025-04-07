'use client'

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

type Saque = {
  id: string
  valor: number
  data: string
  status: 'pendente' | 'pago'
  users: {
    nome: string
    celular: string
  }
}

export function SaquesTable({ data }: { data: Saque[] }) {
  const updateStatus = async (id: string, status: 'pago' | 'pendente') => {
    const { error } = await supabase
      .from('SolicitarSaque')
      .update({ status })
      .eq('id', id)

    if (!error) window.location.reload()
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[200px]">Cliente</TableHead>
              <TableHead>Dados da Solicitação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((saque) => (
              <TableRow key={saque.id}>
                {/* Coluna Cliente */}
                <TableCell>
                  <div className="font-medium">{saque.users.nome}</div>
                  <div className="text-sm text-gray-500">{saque.users.celular}</div>
                </TableCell>

                {/* Coluna Dados da Solicitação */}
                <TableCell>
                  <div className="text-sm">
                    {new Date(saque.data).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="font-medium">
                    {saque.valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </div>
                </TableCell>

                {/* Coluna Status */}
                <TableCell>
                  <Badge 
                    variant={saque.status === 'pago' ? 'default' : 'outline'}
                    className={saque.status === 'pendente' ? 'bg-amber-100 text-amber-800' : ''}
                  >
                    {saque.status === 'pago' ? 'Pago' : 'Pedido de saque pendente'}
                  </Badge>
                </TableCell>

                {/* Coluna Ações */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateStatus(saque.id, 'pago')}>
                        Marcar como Pago
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(saque.id, 'pendente')}>
                        Reverter para Pendente
                      </DropdownMenuItem>
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
