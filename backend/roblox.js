async function pegarToken(cookie) {
  const resposta = await fetch('https://auth.roblox.com/v2/logout', {
    method: 'POST',
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'User-Agent': 'Mozilla/5.0'
    }
  });

  const csrf = resposta.headers.get('x-csrf-token');

  if (!csrf) {
    throw new Error('CSRF token não encontrado. Cookie pode estar inválido.');
  }

  return csrf;
}


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
      if (data.errors && data.errors.length > 0) {
        throw new Error(`Erro Roblox: ${data.errors[0].message || 'mensagem vazia'}`);
      } else {
        throw new Error(`Erro desconhecido. Código HTTP: ${resposta.status}`);
      }
    }

    return data;
  } catch (err) {
    throw new Error(`Erro ao alterar idade: ${err.message}`);
  }
}

module.exports = { alterarIdade };
