# US003 - Descoberta e empréstimo de livro

## Prioridade
Alta

## História

Como usuário cadastrado,
quero navegar pelo catálogo filtrando por gênero e solicitar um empréstimo.

---

## Critérios de aceitação

- Usuário filtra livros por gênero e navega por páginas
- Livros indisponíveis não exibem botão de empréstimo
- Usuário define a data de devolução ao solicitar
- Empréstimo aparece imediatamente em "Meus empréstimos"

---

## Regras de negócio

- Um livro só pode ser emprestado se houver estoque disponível
- Data de devolução deve ser futura
- Usuário não pode ultrapassar limite máximo de empréstimos

---

## Fluxo principal

1. Usuário acessa catálogo
2. Filtra livros
3. Seleciona livro
4. Define data de devolução
5. Confirma empréstimo
6. Sistema registra empréstimo
7. Livro aparece em "Meus empréstimos"

---

## Fluxos alternativos

### Livro indisponível

1. Sistema detecta ausência de estoque
2. Botão de empréstimo não é exibido

---

## Status

Pendente

#### Ultima Atualização : 09/05/2026