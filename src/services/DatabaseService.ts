import { User, Investment, WithdrawalRequest } from '@/lib/types';
import { supabase } from '@/lib/supabase';

class DatabaseService {
  // User methods
  async saveUser(user: User): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          name: user.name,
          email: user.email,
          celular: user.celular,
          cpf: user.cpf,
          is_admin: user.isAdmin || false,
          is_verified: user.isVerified || false
        });
      
      if (error) throw error;
      
      // Update localStorage for currentUser (for compatibility)
      if (typeof window !== 'undefined') {
        localStorage.setItem('banko-current-user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error saving user to Supabase:', error);
      throw error;
    }
  }

  async getUser(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        name: data.name,
        email: data.email,
        celular: data.celular,
        cpf: data.cpf,
        isAdmin: data.is_admin,
        isVerified: data.is_verified
      };
    } catch (error) {
      console.error('Error getting user from Supabase:', error);
      return null;
    }
  }

  async getUserByCpf(cpf: string): Promise<User | null> {
    if (!cpf) return null;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('cpf', cpf)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        name: data.name,
        email: data.email,
        celular: data.celular,
        cpf: data.cpf,
        isAdmin: data.is_admin,
        isVerified: data.is_verified
      };
    } catch (error) {
      console.error('Error getting user by CPF from Supabase:', error);
      return null;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) throw error;
      
      return data.map(user => ({
        name: user.name,
        email: user.email,
        celular: user.celular,
        cpf: user.cpf,
        isAdmin: user.is_admin,
        isVerified: user.is_verified
      }));
    } catch (error) {
      console.error('Error getting users from Supabase:', error);
      return [];
    }
  }

  async updateUser(email: string, updatedUser: Partial<User>): Promise<boolean> {
    try {
      const updateData: Record<string, any> = {};
      
      if (updatedUser.name) updateData.name = updatedUser.name;
      if (updatedUser.email) updateData.email = updatedUser.email;
      if (updatedUser.celular) updateData.celular = updatedUser.celular;
      if (updatedUser.cpf) updateData.cpf = updatedUser.cpf;
      if (updatedUser.isAdmin !== undefined) updateData.is_admin = updatedUser.isAdmin;
      if (updatedUser.isVerified !== undefined) updateData.is_verified = updatedUser.isVerified;
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('email', email);
      
      if (error) throw error;
      
      // Update currentUser in localStorage if it's the current user
      if (typeof window !== 'undefined') {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.email === email) {
          this.setCurrentUser({
            ...currentUser,
            ...updatedUser
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user in Supabase:', error);
      return false;
    }
  }

  async deleteUser(email: string): Promise<boolean> {
    try {
      // Delete associated investments first
      await supabase
        .from('investments')
        .delete()
        .eq('user_email', email);
      
      // Delete user password
      await supabase
        .from('passwords')
        .delete()
        .eq('email', email);
      
      // Delete the user
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('email', email);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting user from Supabase:', error);
      return false;
    }
  }

  // Password methods
  async savePassword(email: string, password: string): Promise<void> {
    try {
      // Check if password already exists
      const { data } = await supabase
        .from('passwords')
        .select('*')
        .eq('email', email);
      
      if (data && data.length > 0) {
        // Update existing password
        const { error } = await supabase
          .from('passwords')
          .update({ password })
          .eq('email', email);
        
        if (error) throw error;
      } else {
        // Insert new password
        const { error } = await supabase
          .from('passwords')
          .insert({ email, password });
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving password to Supabase:', error);
      throw error;
    }
  }

  async getUserPassword(email: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('password')
        .eq('email', email)
        .single();
      
      if (error) throw error;
      
      return data?.password || null;
    } catch (error) {
      console.error('Error getting password from Supabase:', error);
      return null;
    }
  }

  // Investment methods
  async saveInvestment(investment: Investment): Promise<void> {
    try {
      const { error } = await supabase
        .from('investments')
        .insert({
          id: investment.id,
          user_email: investment.userEmail,
          amount: investment.amount,
          period: investment.period,
          start_date: investment.startDate,
          end_date: investment.endDate
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving investment to Supabase:', error);
      throw error;
    }
  }

  async getInvestments(): Promise<Investment[]> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*');
      
      if (error) throw error;
      
      return data.map(inv => ({
        id: inv.id,
        userEmail: inv.user_email,
        amount: inv.amount,
        period: inv.period,
        startDate: inv.start_date,
        endDate: inv.end_date
      }));
    } catch (error) {
      console.error('Error getting investments from Supabase:', error);
      return [];
    }
  }

  async getUserInvestments(email: string): Promise<Investment[]> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_email', email);
      
      if (error) throw error;
      
      return data.map(inv => ({
        id: inv.id,
        userEmail: inv.user_email,
        amount: inv.amount,
        period: inv.period,
        startDate: inv.start_date,
        endDate: inv.end_date
      }));
    } catch (error) {
      console.error('Error getting user investments from Supabase:', error);
      return [];
    }
  }

  async deleteInvestment(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting investment from Supabase:', error);
      return false;
    }
  }

  // Withdrawal request methods
  async getWithdrawalRequests(): Promise<WithdrawalRequest[]> {
    try {
      const { data, error } = await supabase
        .from('SolicitarSaque')
        .select('*');
      
      if (error) throw error;
      
      return data.map(withdrawal => ({
        id: withdrawal.id,
        email: withdrawal.email,
        valor: withdrawal.valor,
        data: withdrawal.data,
        status: withdrawal.status,
        pix: withdrawal.pix
      }));
    } catch (error) {
      console.error('Error getting withdrawal requests from Supabase:', error);
      return [];
    }
  }

  async updateWithdrawalStatus(id: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('SolicitarSaque')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating withdrawal status in Supabase:', error);
      return false;
    }
  }

  // Session management (local storage)
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const user = localStorage.getItem('banko-current-user');
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: User | null): void {
    if (typeof window === 'undefined') return;
    
    if (user) {
      localStorage.setItem('banko-current-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('banko-current-user');
    }
  }
}

// Export as a singleton
export default new DatabaseService();
