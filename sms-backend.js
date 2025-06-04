const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Endpoint para envio de SMS
app.post('/enviar-sms', async (req, res) => {
  const { number, msg } = req.body;
  if (!number || !msg) {
    return res.status(400).json({ status: 'error', mensagem: 'Número e mensagem são obrigatórios.' });
  }
  try {
    const response = await fetch('https://api.smsdev.com.br/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: '3W5N6J3Z68OWTNJV8OMKX9KFVQ362IAGV36CQTCRDBLXVYOYFGE3AMKZM8U82DF1CU8JGVMMZ8HS89EB7HAD4VGIC0LS6STP5UGBUBLEOWWIVZBTQ5M78WKOUUCNNGB5',
        type: 9,
        number,
        msg
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ status: 'error', mensagem: 'Erro ao enviar SMS', erro: err.message });
  }
});

app.listen(3000, () => {
  console.log('Backend de SMS rodando em http://localhost:3000');
});
