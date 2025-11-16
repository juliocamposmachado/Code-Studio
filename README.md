# Code Studio com Gemini API

Uma aplicação web interativa que permite aos usuários gerar e pré-visualizar websites em tempo real conversando com a IA do Gemini, em um ambiente que simula o VS Code.

## ✨ Funcionalidades

- **Geração de Código com IA:** Utilize a API do Gemini para criar e modificar código HTML, CSS e JavaScript.
- **Interface similar ao VS Code:** Experiência de desenvolvimento familiar com Barra de Atividade, Painel Lateral, Editor e Barra de Status.
- **Pré-visualização ao Vivo:** Veja as alterações do seu site instantaneamente sem precisar recarregar a página.
- **Explorador de Arquivos:** Gerencie os arquivos do projeto (`index.html`, `style.css`, `script.js`).
- **Importador de Repositórios do GitHub:** Carregue e edite projetos de qualquer repositório público do GitHub.
- **Suporte a Temas:** Alterne entre os modos claro (Light) e escuro (Dark).
- **Persistência de Dados:** O estado do seu projeto é salvo localmente no seu navegador usando `localStorage`.

## 🚀 Tecnologias Utilizadas

- **Frontend:** [React](https://reactjs.org/) com [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **IA Generativa:** [Google Gemini API](https://ai.google.dev/gemini-api) (`@google/genai`)
- **Destaque de Sintaxe:** [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter o seguinte software instalado:

- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## ⚙️ Instalação e Configuração Local

Siga os passos abaixo para executar o projeto em sua máquina local.

**1. Clone o Repositório**

```bash
git clone https://github.com/seu-usuario/code-studio-gemini.git
cd code-studio-gemini
```

**2. Instale as Dependências**

Use npm ou yarn para instalar os pacotes necessários:

```bash
npm install
```
ou
```bash
yarn install
```

**3. Execute a Aplicação**

A chave da API do Gemini é injetada automaticamente pelo ambiente de desenvolvimento. Você não precisa configurar um arquivo `.env`.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou na porta que o Vite indicar).

## 🎮 Como Usar

1.  Abra a aplicação no seu navegador.
2.  No painel lateral **Explorer**, selecione um arquivo para editar (`index.html`, `style.css` ou `script.js`).
3.  Vá para a aba **AI Assistant** (ícone de brilhos ✨).
4.  No chat, digite um comando para modificar o código. Por exemplo, com `style.css` aberto, peça: `"mude a cor do botão para verde"`.
5.  O código no editor será atualizado automaticamente pela IA.
6.  Clique na aba **Live Preview** no editor para ver o resultado da sua alteração em tempo real.
7.  Para trabalhar em outros projetos, use a função **Import from GitHub** para carregar um repositório público.

## 📂 Estrutura do Projeto

```
/
├── public/                # Arquivos estáticos
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   ├── services/          # Lógica de API (Gemini, GitHub)
│   ├── App.tsx            # Componente principal da aplicação
│   ├── main.tsx           # Ponto de entrada da aplicação
│   └── types.ts           # Definições de tipos TypeScript
├── index.html             # Template HTML principal
├── package.json           # Dependências e scripts do projeto
└── vite.config.ts         # Configuração do Vite
```