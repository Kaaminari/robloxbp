const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { alterarIdade } = require('./roblox'); // Importa a função

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/alterar-idade', async (req, res) => {
  const { cookie } = req.body;

  if (!cookie) {
    return res.status(400).json({ error: 'Cookie é obrigatório.' });
  }

  try {
    const resultado = await alterarIdade(cookie); // Chama a função real
    res.json(resultado); // Retorna o resultado real da API do Roblox
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ error: 'Erro ao alterar idade.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
