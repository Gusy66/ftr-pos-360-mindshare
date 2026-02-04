# Financy API

API GraphQL para gerenciamento de finanças (transações e categorias).

## Checklist (Back-end)

- [ ] O usuário pode criar uma conta e fazer login
- [ ] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [ ] Deve ser possível criar uma transação
- [ ] Deve ser possível deletar uma transação
- [ ] Deve ser possível editar uma transação
- [ ] Deve ser possível listar todas as transações
- [ ] Deve ser possível criar uma categoria
- [ ] Deve ser possível deletar uma categoria
- [ ] Deve ser possível editar uma categoria
- [ ] Deve ser possível listar todas as categorias

## Requisitos

- Node.js
- TypeScript
- GraphQL
- Prisma
- SQLite

## Como rodar

1. Instale as dependências:
   - `npm install`
2. Configure o `.env` com base no `.env.example`:
   - `JWT_SECRET=...`
   - `DATABASE_URL="file:./dev.db"`
3. Rode as migrações e gere o client:
   - `npm run migrate`
   - `npm run generate`
4. Inicie o servidor:
   - `npm run dev`

O endpoint GraphQL fica disponível em `http://localhost:4000/graphql`.

## Usuário de demonstração

Para popular o banco com dados fictícios:

- `npm run seed`

Credenciais:
- Email: `demo@financy.com`
- Senha: `demo123`

## Testes manuais (checklist)

- Cadastro e login
- CRUD de categorias
- CRUD de transações
- Filtros/busca por título e período
- Dashboard (gráficos e totais)
- Escopo por usuário (dados isolados)
