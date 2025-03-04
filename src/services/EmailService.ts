
const EmailService = {
  sendVerificationEmail: async (email: string, code: string, name: string) => {
    // In a real app, this would send an actual email
    // For this demo, we'll just log to console
    console.log(`
      To: ${email}
      Subject: Verifique seu endereço de e-mail
      
      Olá ${name},
      
      Obrigado por se cadastrar! Para completar seu registro, use o código abaixo:
      
      ${code}
      
      Este código é válido por 24 horas.
      
      Atenciosamente,
      Equipe de Suporte
    `);
    
    return true;
  },
  
  sendWelcomeEmail: async (email: string, name: string) => {
    // In a real app, this would send an actual email
    console.log(`
      To: ${email}
      Subject: Bem-vindo!
      
      Olá ${name},
      
      Seu e-mail foi verificado com sucesso. Bem-vindo à nossa plataforma!
      
      Atenciosamente,
      Equipe de Suporte
    `);
    
    return true;
  }
};

export default EmailService;
