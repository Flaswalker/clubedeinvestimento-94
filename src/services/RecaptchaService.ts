
/**
 * Serviço para validação do reCAPTCHA
 * 
 * Em um ambiente de produção real, esta validação seria feita em um servidor backend
 * Este arquivo é apenas uma simulação para fins de demonstração
 */

// Chave secreta do reCAPTCHA (em produção, nunca exponha esta chave no frontend)
const RECAPTCHA_SECRET_KEY = "6LcEW-oqAAAAANEi3_6DOx97WFnr2EMGX6Y842dk";

/**
 * Simula a verificação do token reCAPTCHA com a API do Google
 * Em um ambiente real, isto seria implementado no servidor backend
 */
export const verifyRecaptchaToken = async (token: string): Promise<{ success: boolean; message?: string }> => {
  try {
    // Em um ambiente real, você enviaria a solicitação abaixo a partir do seu backend:
    // const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`, {
    //   method: 'POST'
    // });
    // const data = await response.json();
    // return data;
    
    // Como esta é uma simulação client-side, vamos fingir que verificamos o token
    console.log(`Simulando verificação do token reCAPTCHA (início: ${token.substring(0, 10)}...)`);
    console.log(`Chave secreta seria usada para validação: ${RECAPTCHA_SECRET_KEY.substring(0, 5)}...`);
    
    // Simulando atraso de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Para fins de demonstração, consideramos qualquer token não vazio como válido
    return { 
      success: !!token, 
      message: token ? "Verificação bem-sucedida" : "Token inválido" 
    };
  } catch (error) {
    console.error("Erro ao verificar token reCAPTCHA:", error);
    return { 
      success: false, 
      message: "Erro na verificação do reCAPTCHA" 
    };
  }
};
