const axios = require('axios');

exports.handler = async (event) => {
  // 1. Validação do método HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
    };
  }

  try {
    // 2. Parse dos dados recebidos
    const { cpf, valor } = JSON.parse(event.body);
    
    if (!cpf || !valor) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'CPF e valor são obrigatórios' })
      };
    }

    // 3. Chamada à API do Mercado Pago
    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        payment_method_id: 'pix',
        transaction_amount: parseFloat(valor),
        description: 'Pagamento via PIX',
        payer: {
          email: 'pagador@email.com', // Pode ser dinâmico se necessário
          first_name: 'Cliente',      // Opcional
          identification: {
            type: 'CPF',
            number: cpf.replace(/\D/g, '') // Remove caracteres não numéricos
          }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 4. Extrai dados do QR Code PIX
    const pixData = response.data.point_of_interaction.transaction_data;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        qr_code: pixData.qr_code,
        qr_code_base64: pixData.qr_code_base64,
        pix_copy_paste: pixData.qr_code // Código para copiar/colar
      })
    };

  } catch (error) {
    // 5. Tratamento detalhado de erros
    console.error('Erro na geração do PIX:', error.response?.data || error.message);
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: 'Falha ao gerar QR Code PIX',
        details: error.response?.data || error.message
      })
    };
  }
};
