// Função para pegar o token CSRF
async function pegarToken(cookie) {
  const resposta = await fetch('https://accountsettings.roblox.com/v1/birthdate', {
    method: 'POST',
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'Content-Type': 'application/json'
    },
    body: '{}' // força erro controlado que retorna o token
  });

  const csrfToken = resposta.headers.get('x-csrf-token');

  if (!csrfToken) {
    throw new Error('❌ Não foi possível obter o token CSRF.');
  }

  return csrfToken;
}

// Verifica se o cookie é válido
async function verificarUsuario(cookie) {
  const resposta = await fetch('https://users.roblox.com/v1/users/authenticated', {
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });

  const json = await resposta.json();
  console.log('🧠 Dados do usuário autenticado:', json);
}

// Verifica se o email está verificado
async function verificarEmail(cookie) {
  const resposta = await fetch('https://accountsettings.roblox.com/v1/email', {
    method: 'GET',
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });

  const dados = await resposta.json();
  console.log('📧 Verificação de email:', dados);
  return dados.verified === true;
}

// Altera a idade
async function alterarIdade(cookie, birthYear = 2014) {
  try {
    const emailVerificado = await verificarEmail(cookie);
    if (!emailVerificado) {
      throw new Error('❌ A conta não possui e-mail verificado.');
    }

    const csrf = await pegarToken(cookie);
    console.log('🔑 Token CSRF:', csrf);

    const corpo = {
      birthMonth: 1,
      birthDay: 1,
      birthYear: birthYear
    };

    const resposta = await fetch('https://accountsettings.roblox.com/v1/birthdate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `.ROBLOSECURITY=${cookie}`,
        'X-CSRF-Token': csrf,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify(corpo)
    });

    const texto = await resposta.text();
    console.log('🔍 Resposta da API:', texto);

    let data;
    try {
      data = JSON.parse(texto);
    } catch {
      data = {};
    }

    if (!resposta.ok) {
      let mensagem = `Erro desconhecido (${resposta.status})`;

      if (data.errors && data.errors.length > 0) {
        mensagem = data.errors.map(e => `Erro ${e.code}: ${e.message || 'sem mensagem'}`).join(' | ');
      } else if ([401, 403].includes(resposta.status)) {
        mensagem = '⚠️ Cookie inválido ou sessão expirada.';
      }

      throw new Error(mensagem);
    }

    return { sucesso: true, mensagem: '✅ Idade alterada com sucesso!' };
  } catch (err) {
    throw err;
  }
}

// Diagnóstico rápido
(async () => {
  const cookie = process.env.ROBLOX_COOKIE;

  if (!cookie) {
    console.error('❗ Defina o cookie em process.env.ROBLOX_COOKIE para testar.');
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

// Exporta
module.exports = {
  alterarIdade
};
