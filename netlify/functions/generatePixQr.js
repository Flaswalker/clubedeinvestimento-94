const axios = require('axios');

exports.handler = async (event) => {
  const { cpf } = JSON.parse(event.body);

  try {
    const response = await axios.post('https://api.mercadopago.com/v1/payments', {
      payment_method_id: 'pix',
      transaction_amount: 10.00, // Altere o valor conforme necessário
      payer: { email: 'cliente@email.com', identification: { type: 'CPF', number: cpf } }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ qr_code: response.data.point_of_interaction.transaction_data.qr_code })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao gerar QR Code' })
    };
  }
};
