// Função para pegar o token CSRF
async function pegarToken(cookie) {
  const resposta = await fetch('https://auth.roblox.com/v2/logout', {
    method: 'POST',
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const csrfToken = resposta.headers.get('x-csrf-token');

  if (!csrfToken) {
    throw new Error('Não foi possível obter o token CSRF.');
  }

  return csrfToken;
}

// Função para alterar a idade
async function alterarIdade(cookie, birthYear = 2014) {
  try {
    const csrf = await pegarToken(cookie);
    console.log('🔑 CSRF Token:', csrf);

    const corpo = {
      birthMonth: 1,
      birthDay: 1,
      birthYear
    };

    console.log('📤 Corpo da requisição que será enviado:', corpo);

    const resposta = await fetch('https://accountsettings.roblox.com/v1/birthdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `.ROBLOSECURITY=${cookie}`,
        'X-CSRF-Token': csrf,
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify(corpo)
    });

    const texto = await resposta.text(); // pega a resposta crua
    console.log('🔍 Resposta completa da API:', texto);

    let data;
    try {
      data = JSON.parse(texto);
    } catch {
      data = {}; // evita erro se não for JSON
    }

    if (resposta.status !== 200) {
      let mensagem = 'Erro desconhecido.';

      if (data.errors && data.errors.length > 0) {
        console.log('❌ Detalhes do erro:', data.errors);
        mensagem = data.errors.map(e => `Erro ${e.code}: ${e.message || 'sem mensagem'}`).join(' | ');
      } else if (resposta.status === 401 || resposta.status === 403) {
        mensagem = 'Cookie inválido ou sessão expirada.';
      } else {
        console.log('❌ Resposta inesperada:', data);
      }

      throw new Error(mensagem);
    }

    return { sucesso: true, mensagem: '✅ Idade alterada com sucesso!' };
  } catch (err) {
    throw err;
  }
}
// Exportando as funções
module.exports = {
  alterarIdade
};
