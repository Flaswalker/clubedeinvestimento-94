
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
