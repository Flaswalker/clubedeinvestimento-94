// src/app/admin/saques/_components/SaquesTable.tsx
'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  const updateStatus = async (id: string, newStatus: 'pago' | 'pendente') => {
    const { error } = await supabase
      .from('SolicitarSaque')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert('Erro ao atualizar status')
    } else {
      window.location.reload() // Atualiza a página
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Dados da Solicitação</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((saque) => (
          <TableRow key={saque.id}>
            {/* Coluna Cliente */}
            <TableCell>
              <div className="font-medium">{saque.users.nome}</div>
              <div className="text-sm text-muted-foreground">
                {saque.users.celular}
              </div>
            </TableCell>

            {/* Coluna Dados */}
            <TableCell>
              <div>
                {new Date(saque.data).toLocaleString('pt-BR')}
              </div>
              <div className="font-medium">
                {saque.valor.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
            </TableCell>

            {/* Coluna Status */}
            <TableCell>
              <Badge variant={saque.status === 'pago' ? 'default' : 'secondary'}>
                {saque.status === 'pago' ? 'Pago' : 'Pendente'}
              </Badge>
            </TableCell>

            {/* Coluna Ações */}
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => updateStatus(saque.id, 'pago')}>
                    Marcar como Pago
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus(saque.id, 'pendente')}>
                    Marcar como Pendente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
