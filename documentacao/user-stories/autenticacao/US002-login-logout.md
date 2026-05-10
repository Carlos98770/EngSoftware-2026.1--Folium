# US002 - Login e logout

## Prioridade
Alta

## História

Como usuário cadastrado,
quero entrar e sair da minha conta com segurança,
para que meus dados e ações fiquem protegidos.

---

## Critérios de aceitação

- Login com email e senha retorna token JWT
- Credenciais inválidas retornam mensagem genérica sem expor qual campo está errado
- Logout encerra a sessão e redireciona para a tela de login

---

## Regras de negócio

- Tokens JWT devem possuir expiração
- Rotas privadas exigem autenticação
- Logout invalida sessão local do cliente

---

## Fluxo principal

1. Usuário acessa login
2. Informa email e senha
3. Sistema valida credenciais
4. Sistema retorna JWT
5. Usuário acessa áreas protegidas

---

## Fluxos alternativos

### Credenciais inválidas

1. Usuário informa dados incorretos
2. Sistema retorna erro genérico
3. Usuário permanece na tela de login

---

## Status

Pendente

#### Ultima Atualização : 09/05/2026