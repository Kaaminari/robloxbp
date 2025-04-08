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

async function verificarUsuario(cookie) {
  const resposta = await fetch('https://users.roblox.com/v1/users/authenticated', {
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const json = await resposta.json();
  console.log('🧠 Dados do usuário autenticado:', json);
}

// Função para verificar se o e-mail está verificado
async function verificarEmail(cookie) {
  const resposta = await fetch('https://accountsettings.roblox.com/v1/email', {
    method: 'GET',
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const dados = await resposta.json();
  console.log('📧 Verificação de email:', dados);

  return dados.verified === true;
}

// Função para alterar a idade
async function alterarIdade(cookie, birthYear = 2014) {
  try {
    const emailVerificado = await verificarEmail(cookie);

    if (!emailVerificado) {
      throw new Error('❌ A conta não possui e-mail verificado. Verifique um e-mail antes de continuar.');
    }

    const csrf = await pegarToken(cookie);
    console.log('🔑 CSRF Token:', csrf);

    const corpo = {
    {
  "birthMonth": 1,
  "birthDay": 1,
  "birthYear": 2014
}

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

// Diagnóstico automático (caso deseje testar direto por aqui)
(async () => {
  const cookie = process.env.ROBLOX_COOKIE; // ou defina manualmente: 'seu_cookie_aqui'

  if (!cookie) {
    console.error('❗ Defina o cookie em process.env.ROBLOX_COOKIE para executar o diagnóstico.');
    return;
  }

  console.log('📡 Iniciando diagnóstico...');

  try {
    await verificarUsuario(cookie);
    await verificarEmail(cookie);
  } catch (err) {
    console.error('Erro durante o diagnóstico:', err.message);
  }
})();

// Exportando as funções
module.exports = {
  alterarIdade
};
