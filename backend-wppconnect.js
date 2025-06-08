// backend-wppconnect.js
const express = require('express');
const cors = require('cors');
const { create } = require('@wppconnect-team/wppconnect');

const app = express();
app.use(cors());
app.use(express.json());

let wppClient = null;
let lastQr = null;

// Inicializa o WPPConnect e gera QR Code
async function startWpp() {
  if (wppClient) return wppClient;
  wppClient = await create({
    session: 'app-session',
    catchQR: (qrCode) => {
      lastQr = qrCode;
      console.log('QR Code atualizado');
    },
    statusFind: (statusSession, session) => {
      console.log('Status da sessão:', statusSession);
    }
  });
  return wppClient;
}

// Endpoint para obter o QR Code
app.get('/wppconnect/qrcode', async (req, res) => {
  await startWpp();
  if (lastQr) {
    res.json({ qrcode: lastQr });
  } else {
    res.status(202).json({ message: 'Aguardando QR Code...' });
  }
});

// Endpoint para enviar mensagem
app.post('/wppconnect/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) return res.status(400).json({ error: 'Telefone e mensagem obrigatórios.' });
  const client = await startWpp();
  try {
    await client.sendText(phone + '@c.us', message);
    res.json({ sent: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para status da sessão
app.get('/wppconnect/status', async (req, res) => {
  if (!wppClient) return res.json({ status: 'not_initialized' });
  const status = await wppClient.getConnectionState();
  res.json({ status });
});

const PORT = 3001;
app.listen(PORT, () => console.log('Backend WPPConnect rodando na porta', PORT));
