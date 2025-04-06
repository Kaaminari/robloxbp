const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { alterarIdade } = require('./roblox');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve tudo que está na pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Força o servidor a carregar index.html na rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Se o usuário acessar /pagina2, envia pagina2.html
app.get('/pagina2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pagina2.html'));
});

// Endpoint para alterar a idade
app.post('/alterar-idade', async (req, res) => {
  const { cookie } = req.body;

  if (!cookie) {
    return res.status(400).json({ error: 'Cookie é obrigatório.' });
  }

  try {
    const resultado = await alterarIdade(cookie);
    res.json(resultado);
  } catch (erro) {
    console.error(erro);
   res.status(500).json({ 
  error: '❌ Ocorreu um erro ao tentar alterar a idade.',
  detalhe: erro.message
 });
  } // ← chave adicionada aqui
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
