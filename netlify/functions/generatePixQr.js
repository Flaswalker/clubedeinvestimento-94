const axios = require('axios');

exports.handler = async (event) => {
  // 1. Configuração básica de CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST'
  };

  // 2. Validação do método
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    // 3. Parse seguro do body
    let data;
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'JSON inválido' })
      };
    }

    // 4. Validação dos campos
    if (!data?.cpf || !data?.valor) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'CPF e valor são obrigatórios' })
      };
    }

    // 5. Chamada ao Mercado Pago
    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        payment_method_id: 'pix',
        transaction_amount: parseFloat(data.valor),
        payer: {
          email: 'pagador@exemplo.com',
          identification: {
            type: 'CPF',
            number: data.cpf.replace(/\D/g, '')
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

    // 6. Resposta formatada
    const pixData = response.data.point_of_interaction?.transaction_data;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        qr_code: pixData?.qr_code,
        qr_code_base64: pixData?.qr_code_base64,
        copy_paste: pixData?.qr_code
      })
    };

  } catch (error) {
    // 7. Tratamento de erros detalhado
    console.error('ERRO:', error.response?.data || error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro ao gerar PIX',
        details: error.response?.data || error.message
      })
    };
  }
};
