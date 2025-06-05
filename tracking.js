// Arquivo: api/tracking.js
// Backend serverless para Vercel

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const { codigo } = req.query;
  if (!codigo) {
    res.status(400).json({ error: 'Código da carga/conhecimento é obrigatório' });
    return;
  }
  try {
    const url = `https://meionorteex.brudam.com.br/api/v1/tracking/${encodeURIComponent(codigo)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer 181da3596c41ffaaad3f7a4366da4154176f2835f22f368838',
        'x-usuario': 'a907e3277595056f534a9a5101fbcdf4',
        'x-senha': 'ebbe1410557edd4a708883fd4b135908987a5dbe5ed780b5b383b0c81dfaf56d',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).json({ error: 'Erro na API Brudam', details: text });
      return;
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao consultar tracking', details: err.message });
  }
}
