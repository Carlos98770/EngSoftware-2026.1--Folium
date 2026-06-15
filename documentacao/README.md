# 📚 Folium — Documentação Técnica do Projeto

## 📝 Apresentação do Projeto

Folium é um sistema de gestão de empréstimos de livros desenvolvido para facilitar o controle e a organização de acervos bibliotecários ou pessoais. A aplicação permite o cadastro de usuários, livros e o gerenciamento de empréstimos e devoluções, além de oferecer funcionalidades de busca e visualização de dados.

## 🚀 Instalação e Requisitos

Para rodar o projeto Folium localmente, você precisará ter os seguintes softwares instalados:

-   **Node.js**: `v18.x` ou superior
-   **npm** ou **Yarn**: Gerenciadores de pacote JavaScript
-   **Docker** e **Docker Compose**: Para a orquestração dos serviços de banco de dados e backend.

### Passos para Instalação:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/Folium.git
    cd Folium
    ```
2.  **Configuração do Ambiente:**
    Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` e preencha as variáveis de ambiente necessárias, como credenciais de banco de dados e chaves JWT.

    ```
    # Exemplo de .env
    DB_HOST=localhost
    DB_USER=user
    DB_PASSWORD=password
    DB_NAME=folium_db
    JWT_SECRET=sua_chave_secreta
    ```

3.  **Inicializar o projeto com Docker Compose:**
    ```bash
    docker-compose up --build -d
    ```
    Este comando irá construir as imagens Docker e iniciar os contêineres para o banco de dados (PostgreSQL) e o serviço de backend (Node.js/Express).



    A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

3.  **Acessar a Aplicação:**
    Abra seu navegador e acesse a URL fornecida. Você poderá se cadastrar, fazer login e começar a gerenciar seus livros e empréstimos.

## 📁 Estrutura do Projeto

O projeto Folium é dividido em duas partes principais: `client` (frontend) e `server` (backend), além de uma pasta `documentacao`.

```
Folium/
├── client/                 # Aplicação Frontend (React.js)
│   ├── public/             # Arquivos estáticos
│   ├── src/                # Código fonte do frontend
│   │   ├── assets/         # Imagens e outros recursos
│   │   ├── auth/           # Serviços de autenticação
│   │   ├── components/     # Componentes reutilizáveis da UI
│   │   ├── models/         # Definições de modelos de dados (interfaces TypeScript)
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── router/         # Configuração de rotas
│   │   └── services/       # Serviços de API para comunicação com o backend
│   └── ...                 # Outros arquivos de configuração do frontend (Vite, TSConfig, etc.)
├── server/                 # Aplicação Backend (Node.js, Express, Sequelize)
│   ├── src/                # Código fonte do backend
│   │   ├── app.js          # Configuração principal da aplicação Express
│   │   ├── server.js       # Ponto de entrada do servidor
│   │   ├── controllers/    # Lógica de negócio e manipulação de requisições
│   │   ├── database/       # Configuração do banco de dados e modelos (Sequelize)
│   │   ├── middlewares/    # Middlewares (autenticação, tratamento de erros, validação)
│   │   ├── models/         # Definição dos modelos de dados do Sequelize
│   │   ├── routes/         # Definição das rotas da API
│   │   ├── services/       # Lógica de serviço, abstração de acesso a dados
│   │   ├── tests/          # Testes de integração e unidade
│   │   └── validators/     # Validação de dados de entrada
│   └── ...                 # Outros arquivos de configuração do backend (package.json, jest.config.js, etc.)
├── documentacao/           # Documentação do projeto
│   ├── README.md           # Documentação técnica e de referência
│   ├── user-stories/       # Histórias de usuário detalhadas
│   └── testes/             # Estratégia de testes e resultados
├── docker-compose.yaml     # Definição dos serviços Docker
├── .env.example            # Exemplo de arquivo de variáveis de ambiente
├── .gitignore              # Arquivos e pastas a serem ignorados pelo Git
├── package.json            # Metadados e dependências do projeto (monorepo)
├── README.md               # README principal do projeto
└── ...
```

## 💻 Explicação dos Códigos e Informações do Repositório

### Backend (`server/`)

O backend é construído com Node.js e Express, utilizando Sequelize como ORM para interagir com o banco de dados PostgreSQL.

-   **`controllers/`**: Contém a lógica principal para processar as requisições HTTP, interagir com os serviços e enviar as respostas.
-   **`database/`**: Define a conexão com o banco de dados e as associações entre os modelos. O arquivo `Folium.sql` pode ser usado para recriar o esquema do banco de dados.
-   **`models/`**: Define os modelos de dados (e.g., `User`, `Livro`, `Emprestimo`) usando Sequelize, mapeando as tabelas do banco de dados.
-   **`routes/`**: Gerencia as rotas da API, direcionando as requisições para os controladores apropriados.
-   **`services/`**: Encapsula a lógica de negócio e as operações de acesso a dados, provendo uma camada de abstração para os controladores.
-   **`middlewares/`**: Funções executadas antes ou depois dos controladores, como autenticação (`auth.middleware.js`), tratamento de erros (`error.middleware.js`) e validação de dados (`validator.middleware.js`).

### Frontend (`client/`)

O frontend é uma aplicação React.js desenvolvida com TypeScript e Vite.

-   **`components/`**: Inclui componentes de UI reutilizáveis, como botões, cards de livros, formulários de login/registro e dashboards.
-   **`pages/`**: Define as diferentes visualizações da aplicação, como `LoginPage`, `MainPage`, `UserPage`, `AdminPage`, etc.
-   **`services/`**: Contém funções para fazer requisições HTTP ao backend, abstraindo a comunicação com a API.
-   **`router/`**: Configura as rotas do lado do cliente usando `react-router-dom`, incluindo rotas públicas e privadas (`PrivateRoute.tsx`).
-   **`models/`**: Interfaces TypeScript que definem a estrutura dos dados utilizados no frontend, garantindo a tipagem segura.

### Outros Recursos

-   **`docker-compose.yaml`**: Arquivo de configuração que define os serviços Docker (backend e banco de dados) e suas dependências, redes e volumes.
-   **`.github/workflows/ci.yml`**: Configuração de Integração Contínua usando GitHub Actions para automatizar testes e builds.

---

## 🔗 Navegação da Documentação

- 📖 [Histórias de Usuário](./user-stories/README.md) — Requisitos funcionais descritos como histórias de usuário, organizados por épico e prioridade.
- 🧪 [Testes](./testes/README.md) — Plano de testes, casos de teste e resultados de execução (backend e futuramente frontend).
- 🧑‍💻 [Equipe](#-equipe) — Informações sobre a equipe de desenvolvimento.
- ⚖️ [Licença](#-licença) — Detalhes da licença do projeto.

---

## 👥 Equipe

Projeto desenvolvido na disciplina de **Engenharia de Software — 2026.1**.

---

## 📄 Licença

Este projeto é de uso acadêmico.