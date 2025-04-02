
# Instruções para importação de dados no Supabase

Para importar os dados dos arquivos CSV para o Supabase, siga estas etapas:

## 1. Configuração das tabelas

Execute o SQL contido no arquivo `supabase_schema.sql` no SQL Editor do Supabase para criar as tabelas necessárias:

- `users`: Tabela de usuários
- `investments`: Tabela de investimentos
- `passwords`: Tabela de senhas

## 2. Importação de dados CSV

Para cada arquivo CSV, use a funcionalidade de importação do Supabase:

1. Acesse o painel do Supabase
2. Navegue até a seção "Table Editor"
3. Selecione a tabela correspondente (users, investments ou passwords)
4. Clique no botão "Import data"
5. Selecione o arquivo CSV correspondente
6. Mapeie as colunas do CSV para as colunas da tabela
7. Clique em "Import"

### Mapeamento de colunas

Certifique-se de mapear corretamente as colunas do CSV para as colunas das tabelas:

#### users.csv:
- name → name
- email → email
- celular → celular
- cpf → cpf
- is_admin → is_admin
- is_verified → is_verified

#### investments.csv:
- id → id
- user_email → user_email
- amount → amount
- period → period
- start_date → start_date
- end_date → end_date

#### passwords.csv:
- email → email
- password → password

## 3. Validação

Após a importação, execute algumas consultas SQL para verificar se os dados foram importados corretamente:

```sql
-- Verificar usuários
SELECT * FROM users;

-- Verificar investimentos
SELECT * FROM investments;

-- Verificar senhas
SELECT * FROM passwords;
```

## 4. Configuração de Row Level Security (RLS)

Para maior segurança, configure políticas de RLS para as tabelas:

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

Nota: Estas são apenas políticas básicas. Em um ambiente de produção, você pode querer configurar políticas mais detalhadas.
