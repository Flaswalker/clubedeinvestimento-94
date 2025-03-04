import React, { useState } from "react";
import { User, Investment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Edit, Trash, Save, X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import DatabaseService from "@/services/DatabaseService";

interface UserAccountsTableProps {
  users: User[];
  investments: Investment[];
}

const UserAccountsTable = ({ users, investments }: UserAccountsTableProps) => {
  const { updateUser, deleteUser, getUserPassword } = useAuth();
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    celular: string;
    password: string;
  }>({ name: "", email: "", celular: "", password: "" });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleEditClick = (user: User) => {
    const password = getUserPassword(user.email) || "";
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      celular: user.celular,
      password: password
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const success = await updateUser(editingUser.email, {
        name: editFormData.name,
        email: editFormData.email,
        celular: editFormData.celular
      });

      if (success) {
        toast({
          title: "Conta atualizada",
          description: "Os dados da conta foram atualizados com sucesso.",
        });
        setEditingUser(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar os dados da conta.",
      });
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const success = await deleteUser(userToDelete.email);
      if (success) {
        toast({
          title: "Conta excluída",
          description: "A conta foi excluída com sucesso.",
        });
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a conta.",
      });
    }
  };

  const togglePasswordVisibility = (email: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [email]: !prev[email]
    }));
  };

  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardHeader>
        <CardTitle>Contas de Usuários</CardTitle>
        <CardDescription>Gerencie todas as contas de usuários do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Senha</TableHead>
                <TableHead>Total Investido</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    Nenhuma conta de usuário encontrada
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const userInvestments = investments.filter(
                    inv => inv.userEmail === user.email
                  );
                  const userTotal = userInvestments.reduce(
                    (total, inv) => total + inv.amount, 0
                  );
                  
                  const isEditing = editingUser && editingUser.email === user.email;
                  const password = getUserPassword(user.email) || "";
                  const isPasswordVisible = showPasswords[user.email] || false;
                  
                  return (
                    <TableRow key={user.email} className="transition hover:bg-secondary/20">
                      <TableCell className="font-medium">
                        {isEditing ? (
                          <Input 
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                          />
                        ) : (
                          user.name
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input 
                            value={editFormData.email}
                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                          />
                        ) : (
                          user.email
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input 
                            value={editFormData.celular}
                            onChange={(e) => setEditFormData({...editFormData, celular: e.target.value})}
                          />
                        ) : (
                          user.celular
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input 
                            type="password"
                            value={editFormData.password}
                            onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center">
                            <span className="mr-2">{isPasswordVisible ? password : "••••••••"}</span>
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => togglePasswordVisibility(user.email)}
                            >
                              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(userTotal)}</TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={handleSaveEdit}>
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditClick(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(user)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Tem certeza que deseja excluir a conta de <strong>{userToDelete?.name}</strong>?
            <p className="text-destructive mt-2">Esta ação não pode ser desfeita.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserAccountsTable;
