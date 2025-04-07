// src/app/admin/saques/page.tsx
// No topo da página (server-side)

import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function AdminSaquesPage() {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redireciona se não for admin
  if (!user?.email?.endsWith('@seuadmin.com')) {
    redirect('/login');
  }

import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Usando shadcn/ui (opcional)

export default async function AdminSaquesPage() {
  // Busca todas as solicitações de saque
  const { data: saques, error } = await supabase
    .from('SolicitarSaque')
    .select('*')
    .order('data', { ascending: false }); // Mais recentes primeiro

  if (error) {
    return <div>Erro ao carregar saques: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Solicitações de Saque</h1>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor (R$)</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {saques.map((saque) => (
              <TableRow key={saque.id}>
                <TableCell className="font-medium">{saque.id}</TableCell>
                <TableCell>{saque.email}</TableCell>
                <TableCell>
                  {new Date(saque.data).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  {saque.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </TableCell>
                <TableCell>
                  <button className="text-blue-600 hover:underline">
                    Marcar como pago
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
}
