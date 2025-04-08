// Versão simplificada e testada
const axios = require('axios');

exports.handler = async (event) => {
  try {
    // Validação básica
    if (!event.body) {
      throw new Error('Dados não fornecidos');
    }
    
    const { cpf, valor } = JSON.parse(event.body);
    
    // Chamada ao Mercado Pago
    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        payment_method_id: 'pix',
        transaction_amount: Number(valor),
        payer: {
          email: 'cliente@exemplo.com',
          identification: { type: 'CPF', number: cpf.replace(/\D/g, '') }
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        qr_code: response.data.point_of_interaction.transaction_data.qr_code
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erro ao gerar PIX',
        details: error.message
      })
    };
  }
};
