
# Guia de Importação de Dados para o Supabase

Este guia fornece instruções passo a passo para configurar corretamente as tabelas no Supabase e importar os dados dos arquivos CSV.

## 1. Criação das Tabelas

Acesse o SQL Editor no Supabase e execute o seguinte script SQL para criar as tabelas necessárias:

```sql
-- Create users table
CREATE TABLE users (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  celular TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
CREATE TABLE investments (
  id UUID PRIMARY KEY,
  user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  period INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create passwords table
CREATE TABLE passwords (
  email TEXT PRIMARY KEY REFERENCES users(email) ON DELETE CASCADE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_investments_user_email ON investments(user_email);
CREATE INDEX idx_users_cpf ON users(cpf);
```

## 2. Importação dos Dados CSV

### Passo 1: Importação da tabela Users

1. No painel do Supabase, clique em "Table Editor"
2. Selecione a tabela "users"
3. Clique no botão "Import Data" (geralmente localizado acima da tabela)
4. Selecione o arquivo `users.csv`
5. Certifique-se de que o mapeamento das colunas esteja correto:
   - name → name
   - email → email
   - celular → celular
   - cpf → cpf
   - is_admin → is_admin
   - is_verified → is_verified
6. Clique em "Import"

### Passo 2: Importação da tabela Passwords

1. Volte ao "Table Editor"
2. Selecione a tabela "passwords"
3. Clique no botão "Import Data"
4. Selecione o arquivo `passwords.csv`
5. Verifique o mapeamento das colunas:
   - email → email
   - password → password
6. Clique em "Import"

### Passo 3: Importação da tabela Investments

1. Volte ao "Table Editor"
2. Selecione a tabela "investments"
3. Clique no botão "Import Data"
4. Selecione o arquivo `investments.csv`
5. Verifique o mapeamento das colunas:
   - id → id
   - user_email → user_email
   - amount → amount
   - period → period
   - start_date → start_date
   - end_date → end_date
6. Clique em "Import"

## 3. Verificação da Importação

Para verificar se os dados foram importados corretamente, você pode executar as seguintes consultas SQL no SQL Editor:

```sql
-- Verificar usuários
SELECT * FROM users;

-- Verificar senhas
SELECT * FROM passwords;

-- Verificar investimentos
SELECT * FROM investments;
```

## 4. Configuração de Políticas de Segurança (RLS)

Para garantir a segurança dos dados, configure as políticas de Row Level Security:

```sql
-- Habilitar RLS para todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Política para usuários (apenas admin pode ver todos os usuários)
CREATE POLICY "Usuários podem ver seus próprios dados" ON users
  FOR SELECT USING (auth.uid()::text = email OR 
                   EXISTS (SELECT 1 FROM users WHERE email = auth.uid()::text AND is_admin = true));

-- Política para investimentos (usuários só podem ver seus próprios investimentos)
CREATE POLICY "Usuários podem ver seus próprios investimentos" ON investments
  FOR SELECT USING (user_email = auth.uid()::text OR 
                   EXISTS (SELECT 1 FROM users WHERE email = auth.uid()::text AND is_admin = true));

-- Política para senhas (apenas o próprio usuário e admin podem ver)
CREATE POLICY "Proteger senhas" ON passwords
  FOR SELECT USING (email = auth.uid()::text OR 
                   EXISTS (SELECT 1 FROM users WHERE email = auth.uid()::text AND is_admin = true));
```

## 5. Teste de Conexão

Após a configuração, teste a conexão do seu aplicativo com o Supabase utilizando as credenciais do usuário admin:

- Email: admin@invistaeganhe.com
- Senha: admin123

## Dicas de Solução de Problemas

Se encontrar problemas durante a importação:

1. Verifique se o formato dos dados CSV corresponde exatamente ao formato esperado
2. Certifique-se de que as tabelas foram criadas na ordem correta (primeiro 'users', depois 'investments' e 'passwords')
3. Verifique se não há valores duplicados para campos marcados como UNIQUE
4. Para problemas de referência, certifique-se de que as entradas na tabela 'users' existem antes de importar dados que fazem referência a elas
