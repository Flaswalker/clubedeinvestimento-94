
const EmailService = {
  sendWelcomeEmail: async (email: string, name: string) => {
    // In a real app, this would send an actual email
    console.log(`
      To: ${email}
      Subject: Bem-vindo!
      
      Olá ${name},
      
      Bem-vindo à nossa plataforma!
      
      Atenciosamente,
      Equipe de Suporte
    `);
    
    return true;
  }
};

export default EmailService;
