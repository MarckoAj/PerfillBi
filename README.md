# Perfill BI Integration (GLPI)

Esta API é um middleware seguro entre o **GLPI** e ferramentas de **Business Intelligence** (Power BI) ou Dashboards customizados.

## 🚀 Tecnologias
- **Node.js** (Express)
- **MySQL** (Banco de dados da aplicação)
- **Jest** (Testes de integração)

## 📦 Estrutura
- `src/controllers`: Lógica de rotas e respostas HTTP.
- `src/services`: Regras de negócio e orquestração de dados.
- `src/repositories`: Acesso direto ao banco de dados.
- `src/mappers`: Padronização de dados GLPI -> BI.
- `src/integrations`: Clientes para API externa do GLPI.

## ⚙️ Configuração (Render / Local)
Certifique-se de configurar as seguintes variáveis de ambiente:
- `PORT`: Porta da aplicação (padrão 3000).
- `GLPI_BASE_URL`: URL da sua instância GLPI.
- `GLPI_APIKEY`: Token de API do usuário GLPI.
- `DB_URL`: String de conexão MySQL (ex: mysql://user:pass@host:port/db).
- `API_AUTH_TOKEN`: Token estático para proteção das rotas de BI.
- `DASHBOARD_USER` / `DASHBOARD_PASS`: Credenciais para o painel visual.

## 🛠️ Comandos
- `npm install`: Instala as dependências.
- `npm start`: Inicia o servidor em produção.
- `npm test`: Executa a suíte de testes.

## 🚀 Deploy no Render
1. Crie um novo **Web Service**.
2. Conecte seu repositório GitHub.
3. **Runtime**: Node
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Adicione as variáveis de ambiente em **Environment**.
