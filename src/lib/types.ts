
export interface User {
  name: string;
  email: string;
  celular: string;
  isAdmin?: boolean;
}

export interface Investment {
  id: string;
  userEmail: string;
  amount: number;
  period: number; // in months
  startDate: string;
  endDate: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: User, password: string) => Promise<void>;
  logout: () => void;
  changeAdminCredentials: (
    currentEmail: string, 
    newEmail: string, 
    newName: string, 
    newCelular: string, 
    newPassword: string
  ) => Promise<boolean>;
}

export interface InvestmentFormData {
  userEmail: string;
  amount: number;
  period: number;
}

<!-- forgot_password.html -->
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Esqueci a Senha</title>
    <!-- Incluir arquivos CSS -->
</head>
<body>
    <div class="container">
        <h2>Esqueci a Senha</h2>
        <form action="/forgot_password" method="POST">
            <div class="form-group">
                <label for="email">Endereço de E-mail:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <button type="submit">Redefinir Senha</button>
        </form>
        <hr>
        <a href="/login">Voltar para o Login</a>
    </div>
    <!-- Incluir arquivos JS -->
</body>
</html>
