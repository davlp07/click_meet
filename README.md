# ClickMeet 🗓️

O **ClickMeet** é uma solução moderna e intuitiva de gerenciamento e agendamento de salas de reunião corporativas. Desenvolvida focando na alta usabilidade (UX), a plataforma elimina o atrito de reservas de espaços de trabalho, oferecendo visibilidade em tempo real sobre a disponibilidade de salas, controle reativo dos compromissos e uma interface fluida que evita conflitos organizacionais.

Este projeto foi construído utilizando as melhores práticas de desenvolvimento, enfatizando a separação de responsabilidades no backend (padrão MVC/REST) e modularização componentizada no frontend (Vue 3 com Composition API), aplicando rigorosamente o princípio **DRY (Don't Repeat Yourself)** para regras de negócios críticas.

---

## 🚀 Funcionalidades Principais

- **Autenticação Simples (Mock de Login):** Sistema de login simulado para identificação do usuário e controle de permissões de acesso.
- **Dashboard de Salas e Ocupação:** Listagem das três salas disponíveis para agendamento, com feedback visual dos horários ocupados e uso de cores para diferenciar rapidamente os seus agendamentos das reservas de outros colegas.
- **Agendamento Intuitivo:** Interface focada em UX que permite criar reservas de forma rápida, selecionando a sala, a data e o intervalo de horário (início e término).
- **Motor de Validações:** Mecanismo centralizado que impede conflitos de agenda (bloqueia o agendamento se a sala já estiver reservada no horário desejado) e não permite marcações em datas no passado.
- **Calendário Interativo Integrado:** Visualização dinâmica dos agendamentos em formato de calendário (padrão *Master-Detail*). O usuário clica na data e a lista de reuniões é filtrada instantaneamente.
- **Gestão de Reuniões e Cancelamento:** Listagem das reuniões ativas com possibilidade de edição e cancelamento (garantindo que apenas o criador possa cancelar sua própria reserva). As alterações atualizam a tela reativamente, sem precisar recarregar a página.
- **Código Limpo, Vue 3 e Quasar:** Implementação estruturada baseada em componentes reutilizáveis, boas práticas de organização e feedbacks visuais modernos (usando `Toasts` amigáveis em vez de `alerts` nativos do navegador).
- **API REST Organizada:** Backend estruturado com Node.js e Express, com rotas bem definidas e comunicação limpa com o banco de dados.

---

## 🛠️ Tecnologias Utilizadas

A stack de tecnologias do **ClickMeet** foi selecionada para garantir escalabilidade, leveza e facilidade de manutenção local:

### Frontend
- **Vue 3 (Composition API):** Framework reativo de alta performance.
- **Quasar Framework:** Ecossistema baseado no Material Design para criação de interfaces consistentes e responsivas.
- **Axios:** Cliente HTTP para comunicação assíncrona com a API REST.

### Backend
- **Node.js:** Ambiente de execução Javascript assíncrono direcionado a eventos.
- **Express.js:** Framework minimalista para criação das rotas e endpoints REST.
- **SQLite:** Banco de dados relacional embarcado de rápida configuração local e excelente performance de leitura.

---

## ⚙️ Como Rodar o Projeto Localmente

Siga o passo a passo abaixo para clonar e executar o ambiente completo de desenvolvimento na sua máquina.

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (Versão 22.22 ou superior obrigatória)
- Git
- NPM (Instalado automaticamente junto com o Node)

---

### Passo 1: Clonar o Repositório

Abra o seu terminal e baixe o código-fonte executando:
   ```bash
   git clone https://github.com/davlp07/click_meet.git
   cd click_meet
   ```

### Passo 2: Configuração do Backend (Servidor API)

1. Navegue até o diretório do backend da aplicação:
   ```bash
   cd backend
   ```

2. Instale todas as dependências necessárias listadas no package.json:
   ```bash
   npm install
   ```

3. Inicie o servidor backend e o banco de dados:
   ```bash
   node src/server.js
   ```

O servidor backend será iniciado por padrão na porta 3000 (http://localhost:3000).

### Passo 3: Configuração do Frontend (Interface Quasar)

1. Abra uma nova aba no seu terminal e navegue para o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências da interface gráfica:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento local do Quasar/Vite:
   ```bash
   npm run dev
   # OU, caso tenha o Quasar CLI instalado globalmente:
   quasar dev
   ```

## 📁 Estrutura do Código

A organização do código-fonte segue uma arquitetura limpa, com isolamento claro de escopo e responsabilidades entre cliente e servidor:

```text
click_meet/
├── backend/                         # Servidor da aplicação (Node.js + Express)
│   ├── src/
│   │   ├── controllers/             # Regras de negócio e comunicação com o banco
│   │   │   ├── agendamentoController.js
│   │   │   ├── authController.js
│   │   │   └── salasController.js
│   │   ├── database/                # Configuração e conexão com o banco SQLite
│   │   │   └── db.js
│   │   ├── routes/                  # Definição dos endpoints da API REST
│   │   │   ├── agendamentoRts.js
│   │   │   ├── authRts.js
│   │   │   └── salaRts.js
│   │   └── server.js                # Arquivo de entrada e inicialização do Express
│   ├── database.sqlite              # Banco de dados relacional embarcado
│   └── package.json                 # Dependências e scripts do backend
│
├── frontend/                        # Interface de usuário (Vue 3 + Quasar)
│   ├── public/                      # Assets estáticos (ícones e favicon)
│   ├── src/
│   │   ├── components/              # Componentes de UI modulares e reaproveitáveis
│   │   │   ├── CalendarPanel.vue    # Calendário interativo de seleção (Master)
│   │   │   ├── ModalCancelar.vue    # Modal isolado para exclusão de agendamentos
│   │   │   ├── ModalEditar.vue      # Formulário de edição de reservas encapsulado
│   │   │   └── NavBar.vue           # Barra de navegação global
│   │   ├── css/                     # Estilização e variáveis do Quasar (SCSS)
│   │   ├── layouts/                 # Estruturas base de páginas (MainLayout)
│   │   ├── pages/                   # Telas principais da aplicação (Views)
│   │   │   ├── DashboardPage.vue    # Página inicial com um dashboard das salas de reunião
│   │   │   ├── LoginPage.vue        # Página de login
│   │   │   ├── MyAppointmentsPage.vue # Painel de gestão da agenda com calendário
│   │   │   └── SchedulePage.vue       # Formulário de agendamento de novas salas
│   │   ├── router/                  # Gerenciamento de rotas e proteção de rotas
│   │   ├── stores/                  # Gerenciamento de estado global (Pinia)
│   │   ├── utils/                   # Lógicas de negócio compartilhadas
│   │   │   └── validacoes.js        # Motor centralizado de checagem de horários
│   │   └── App.vue                  # Componente raiz
│   ├── quasar.config.js             # Configurações do ecossistema Quasar/Vite
│   └── package.json                 # Dependências e scripts do frontend
│
└── README.md                        # Documentação principal do projeto
   
```

### 🧑‍💻 Autor

Desenvolvido por **Davi Lopes** — Desenvolvedor de Software Frontend/Backend
- LinkedIn: [https://www.linkedin.com/in/davi-lopes-b452822a6/](https://www.linkedin.com/in/davi-lopes-b452822a6/)
- GitHub: [https://github.com/davlp07](https://github.com/davlp07)
