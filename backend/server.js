const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Rota para a alteração de idade
app.post('/alterar-idade', (req, res) => {
  const { cookie, password } = req.body;

  if (!cookie || !password) {
    return res.status(400).json({ error: 'Cookie e senha são obrigatórios.' });
  }

  // Lógica fictícia de validação
  const idadeAlterada = Math.random() > 0.5 ? '13' : '-13';  // Exemplo simples

  res.json({ idadeAlterada: idadeAlterada });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
