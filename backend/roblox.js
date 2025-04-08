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
async function alterarIdade(cookie, birthYear = 2000) {
  try {
    const csrf = await pegarToken(cookie);

    const resposta = await fetch('https://accountsettings.roblox.com/v1/birthdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `.ROBLOSECURITY=${cookie}`,
        'X-CSRF-Token': csrf,
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        birthMonth: 1,
        birthDay: 1,
        birthYear
      })
    });

    const data = await resposta.json();

    if (resposta.status !== 200) {
      let mensagem = 'Erro desconhecido.';

      if (data.errors && data.errors.length > 0) {
        mensagem = data.errors[0].message || 'Erro retornado, mas sem mensagem.';
      } else if (resposta.status === 401 || resposta.status === 403) {
        mensagem = 'Cookie inválido ou sessão expirada.';
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
