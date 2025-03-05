
/**
 * Utilitário para validação do reCAPTCHA
 */

// Chave do site reCAPTCHA (pública)
export const RECAPTCHA_SITE_KEY = "6LcEW-oqAAAAAC2lk7BRcQnzynka1B00DgE6D3si";

/**
 * Valida o token do reCAPTCHA no lado do servidor
 * Nota: Em um ambiente de produção real, esta validação deve ser feita no servidor
 * Esta é uma simulação client-side para demonstração
 */
export const validateRecaptchaToken = async (token: string | null): Promise<boolean> => {
  if (!token) return false;
  
  try {
    // Em um ambiente real, você enviaria este token para seu backend
    // e faria a validação usando a chave secreta
    // 
    // Exemplo simulado:
    // const response = await fetch('/api/validate-recaptcha', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token })
    // });
    // const data = await response.json();
    // return data.success;
    
    // Como não temos um backend real, vamos simular uma validação
    // Para fins de demonstração, consideramos qualquer token não-nulo como válido
    console.log("Validando token reCAPTCHA:", token.substring(0, 15) + "...");
    
    // Simulando pequeno atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error("Erro ao validar reCAPTCHA:", error);
    return false;
  }
};

/**
 * Inicializa o script reCAPTCHA na página
 */
export const initRecaptchaScript = (): (() => void) => {
  const script = document.createElement("script");
  script.src = "https://www.google.com/recaptcha/api.js";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  
  // Função de limpeza
  return () => {
    try {
      document.head.removeChild(script);
    } catch (e) {
      console.warn("Erro ao remover script reCAPTCHA:", e);
    }
  };
};
