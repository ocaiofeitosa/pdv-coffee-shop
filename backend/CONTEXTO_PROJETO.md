# Contexto do Projeto PDV

Este documento descreve o estado atual do backend do sistema de ponto de venda (PDV). Deve ser atualizado quando houver alteração de arquitetura, contrato de API, dependências, banco de dados ou regras de negócio.

## Visão geral

O projeto é uma API HTTP para gerenciamento de usuários, autenticação, categorias, produtos e pedidos. O backend usa Node.js com TypeScript, Express 5 e Prisma 7 para comunicação com um banco PostgreSQL. Imagens de produtos são recebidas via upload multipart e armazenadas no Cloudinary. O frontend está em `frontend/` e usa Next.js.

## Arquitetura

O fluxo principal da aplicação é:

```text
Cliente HTTP
  > Express Router
  > Middlewares (validação, autenticação e autorização)
  > Controller (recebe a requisição e extrai os dados HTTP)
  > Service (executa a regra de negócio e acessa o banco)
  > Prisma Client
  > PostgreSQL
```

No retorno, o fluxo ocorre no sentido inverso:

```text
PostgreSQL > Prisma Client > Service > Controller > resposta HTTP
```

### Responsabilidades

- **Rotas:** definem método, caminho e ordem dos middlewares e controllers.
- **Middlewares:** executam validação do request, autenticação por JWT e autorização por perfil.
- **Controllers:** representam a camada HTTP. Leem `req.body` ou dados da requisição, instanciam o service, chamam `execute` e definem a resposta.
- **Services:** concentram as regras de negócio e as operações de leitura e escrita no banco.
- **Prisma:** fornece o client tipado e traduz as operações para PostgreSQL.
- **Schemas:** definem os contratos de entrada usando Zod.
- **Servidor:** configura JSON, CORS, carregamento de variáveis de ambiente, rotas e tratamento global de erros.

## Stack e versões

As versões são as declaradas em `backend/package.json` por ranges `^`:

### Dependências de execução

| Biblioteca           | Versão declarada | Uso                                       |
| -------------------- | ---------------- | ----------------------------------------- |
| `@prisma/adapter-pg` | `^7.9.1`         | Adapter PostgreSQL do Prisma              |
| `@prisma/client`     | `^7.9.1`         | Client de acesso ao banco                 |
| `bcryptjs`           | `^3.0.3`         | Hash e comparação de senhas               |
| `cloudinary`         | `^2.10.0`        | Armazenamento de imagens de produtos      |
| `cors`               | `^2.8.6`         | Habilitação de CORS                       |
| `express`            | `^5.2.1`         | Servidor HTTP e roteamento                |
| `jsonwebtoken`       | `^9.0.3`         | Criação e validação de JWT                |
| `multer`             | `^2.2.0`         | Processamento de upload multipart         |
| `tsx`                | `^4.23.12`       | Execução do TypeScript em desenvolvimento |
| `zod`                | `^4.4.3`         | Validação dos dados de entrada            |

### Dependências de desenvolvimento

| Biblioteca            | Versão declarada | Uso                                   |
| --------------------- | ---------------- | ------------------------------------- |
| `@types/cors`         | `^2.8.19`        | Tipos do CORS                         |
| `@types/express`      | `^5.0.6`         | Tipos do Express                      |
| `@types/jsonwebtoken` | `^9.0.10`        | Tipos do JWT                          |
| `@types/multer`       | `^2.2.0`         | Tipos do Multer                       |
| `@types/node`         | `^26.2.0`        | Tipos do Node.js                      |
| `dotenv`              | `^17.4.2`        | Carregamento de variáveis de ambiente |
| `prisma`              | `^7.9.1`         | CLI, schema e migrations do Prisma    |
| `typescript`          | `^7.0.2`         | Compilação e tipagem                  |

### Configuração de execução

- O projeto usa módulos ES nativos (`"type": "module"`).
- O TypeScript usa `module: nodenext`, `target: esnext`, `strict: true` e `rootDir: ./src`.
- O script disponível é `npm run dev`, que executa `tsx watch src/server.ts`.
- A porta usa `process.env.port` e, caso não exista, `3333`. A variável está escrita em minúsculas no código.
- O Prisma usa `DATABASE_URL` para conectar ao PostgreSQL.
- O JWT usa `JWT_SECRET` para assinar e verificar tokens.
- O Cloudinary usa `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` e `CLOUDINARY_API_SECRET`.

## Organização de pastas

```text
backend/
├── prisma.config.ts              # Configuração do schema, migrations e DATABASE_URL
├── prisma/
│   ├── schema.prisma             # Modelagem declarativa do banco
│   └── migrations/               # Histórico de migrations
├── src/
│   ├── server.ts                 # Inicialização do Express
│   ├── routes.ts                 # Registro das 17 rotas
│   ├── @types/express/           # Extensão dos tipos de Request
│   ├── config/                   # Configurações do Multer e Cloudinary
│   ├── controllers/
│   │   ├── user/                 # Controllers de usuário e sessão
│   │   ├── category/             # Controllers de categoria
│   │   ├── product/              # Controllers de produto
│   │   └── order/                # Controllers de pedidos
│   ├── generated/prisma/         # Código gerado pelo Prisma
│   ├── middlewares/              # Validação, autenticação e autorização
│   ├── prisma/index.ts           # Instância compartilhada do Prisma Client
│   ├── schemas/                  # Schemas Zod dos requests
│   └── services/
│       ├── user/                 # Regras de usuário e autenticação
│       ├── category/             # Regras de categoria
│       ├── product/              # Regras de produto
│       └── order/                # Regras de pedidos
└── package.json                  # Dependências e scripts
```

## Endpoints atuais

Não existe prefixo global: as rotas são registradas diretamente em `src/routes.ts`. O catálogo completo, com exemplos de requests e responses, está em [endpoints.md](endpoints.md). Atualmente existem 17 endpoints: 3 de usuários/sessão, 2 de categorias, 4 de produtos e 8 de pedidos.

### Usuários e sessão

#### `POST /users`

Cria um usuário. Não exige autenticação.

Body:

```json
{
  "name": "Nome do usuário",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

Validações: `name` é texto com pelo menos 3 caracteres, `email` deve ser válido e `password` é texto com pelo menos 6 caracteres.

Retorna os dados públicos do usuário criado: `id`, `name`, `email`, `role` e `createdAt`. A senha é armazenada com hash bcrypt e não é retornada.

#### `POST /session`

Autentica um usuário. Não exige autenticação.

Body:

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

Retorna `id`, `name`, `role` e um JWT com validade de 30 dias. O token deve ser enviado nas rotas protegidas no formato:

```text
Authorization: Bearer <token>
```

#### `GET /me`

Retorna os dados do usuário identificado pelo token: `id`, `name`, `email`, `createdAt` e `role`.

Middlewares: `isAuthenticated`.

### Categorias

#### `POST /category`

Cria uma categoria. Exige usuário autenticado com perfil `ADMIN`.

Body:

```json
{
  "name": "Bebidas"
}
```

Validação: `name` é texto com pelo menos 3 caracteres. O nome é verificado antes da criação para evitar duplicidade.

Middlewares, na ordem: `isAuthenticated`, `isAdmin` e `validateSchema(createCategorySchema)`.

Retorna status `201` com `id`, `name` e `createdAt`.

#### `GET /categories`

Lista todas as categorias ordenadas pela data de criação, da mais recente para a mais antiga. Exige autenticação, mas não exige perfil de administrador.

Middlewares: `isAuthenticated`.

Retorna status `200` com uma lista contendo `id`, `name` e `createdAt`.

### Produtos

#### `POST /product`

Cria um produto. Exige usuário autenticado com perfil `ADMIN` e recebe `multipart/form-data`.

Campos do formulário:

| Campo         | Tipo                     | Obrigatório | Regra                                       |
| ------------- | ------------------------ | ----------- | ------------------------------------------- |
| `name`        | texto                    | Sim         | Pelo menos 1 caractere                      |
| `price`       | número ou texto numérico | Sim         | Convertido para número e maior ou igual a 1 |
| `description` | texto                    | Sim         | Pelo menos 1 caractere                      |
| `category_id` | texto                    | Sim         | Deve identificar uma categoria existente    |
| `file`        | imagem                   | Sim         | JPEG, JPG ou PNG, até 4 MB                  |

O Multer mantém o arquivo em memória. O service verifica se a categoria existe, impede produtos com o mesmo nome, envia a imagem para a pasta `products` do Cloudinary e salva a URL segura no campo `banner`.

Middlewares, na ordem: `isAuthenticated`, `isAdmin`, `upload.single('file')` e `validateSchema(createProductSchema)`.

Retorna os campos `id`, `name`, `price`, `description`, `category_id`, `banner` e `createdAt`.

### Pedidos

O backend também implementa criação e listagem de pedidos, inclusão e remoção de itens, consulta de detalhes, envio para produção, finalização e exclusão. Os pedidos começam com `draft: true` e `status: false`; enviar para produção muda `draft` para `false`, e finalizar muda `status` para `true`. A descrição de cada rota, campos, respostas e exemplos está em [endpoints.md](endpoints.md).

Rotas administrativas: `POST /order`, `POST /order/add/:order_id/:product_id` e `DELETE /order/remove/:item_id`. As demais rotas de pedidos exigem autenticação, mas não exigem perfil `ADMIN`.

## Middlewares

### `validateSchema`

Recebe um schema Zod e valida um objeto contendo `body`, `query` e `params` da requisição. Em caso de erro de validação, retorna `400`:

```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "name",
      "message": "..."
    }
  ]
}
```

Erros inesperados dentro da validação retornam `500`.

### `isAuthenticated`

Lê `Authorization`, separa o token pelo espaço e valida o JWT com `JWT_SECRET`. O `subject` (`sub`) do token é armazenado em `req.user_id` para uso posterior.

### `isAdmin`

Busca no banco o perfil do usuário identificado por `req.user_id` e permite a continuação somente quando `role === 'ADMIN'`.

### Multer (`uploadConfig`)

O upload usa `memoryStorage`, com limite de 4 MB por arquivo. O filtro aceita somente `image/jpeg`, `image/jpg` e `image/png`. Formatos não permitidos geram erro no middleware.

## Modelagem do banco de dados

O datasource é PostgreSQL. IDs são strings geradas por UUID. Os campos `createdAt` usam `now()` e `updatedAt` usam atualização automática do Prisma.

### Enum `Role`

- `STAFF`: perfil padrão.
- `ADMIN`: perfil com autorização administrativa.

### `User` (`users`)

| Campo       | Tipo       | Regras                           |
| ----------- | ---------- | -------------------------------- |
| `id`        | `String`   | Chave primária, UUID             |
| `name`      | `String`   | Obrigatório                      |
| `email`     | `String`   | Obrigatório e único              |
| `password`  | `String`   | Obrigatório, armazenado com hash |
| `role`      | `Role`     | Padrão `STAFF`                   |
| `createdAt` | `DateTime` | Data de criação                  |
| `updatedAt` | `DateTime` | Atualizado automaticamente       |

### `Category` (`categories`)

Possui `id`, `name`, `createdAt` e `updatedAt`. Uma categoria possui muitos produtos (`products`).

### `Product` (`products`)

Possui `id`, `name`, `price` inteiro, `description`, `banner`, `disabled` com padrão `false` e `category_id`. Cada produto pertence a uma categoria. O `banner` armazena a URL segura da imagem hospedada no Cloudinary. No schema Prisma atual, a relação não declara explicitamente `onDelete`.

### `Order` (`orders`)

Possui `id`, `table` inteiro, `status` com padrão `false`, `draft` com padrão `true`, `name` opcional, `items`, `createdAt` e `updatedAt`. Uma mesa possui índice único na migration atual.

### `Item` (`items`)

Possui `id`, `amount`, `order_id`, `product_id`, `order`, `product`, `createdAt` e `updatedAt`. Um item pertence a um pedido e a um produto. As relações usam exclusão em cascata.

### Relações

```text
Category 1 ---- N Product
Order    1 ---- N Item N ---- 1 Product
```

## Fluxos de negócio implementados

- Cadastro verifica e-mail existente, gera hash bcrypt com custo 8 e retorna somente campos públicos.
- Login compara a senha e gera JWT com `sub` igual ao ID do usuário e validade de 30 dias.
- Categorias são listadas por `createdAt` decrescente; produtos por `createdAt` decrescente.
- Produtos arquivados usam `disabled = true`; a exclusão de produto é lógica, não física.
- A listagem por categoria retorna somente produtos ativos e ordena por `createdAt` crescente.
- Ao adicionar item, o preço atual do produto é copiado para `Item.price`.
- A autorização administrativa consulta o papel diretamente no banco a cada requisição protegida por `isAdmin`.

## Tratamento de erros

O `server.ts` possui um handler global que transforma instâncias de `Error` em resposta `400` com `{ "error": "mensagem" }`. Erros não reconhecidos retornam `500` com `internal server error`.

Como controllers e services usam operações assíncronas sem `try/catch` em todos os pontos, a propagação de rejeições depende do comportamento do Express 5 e do handler global. As mensagens de erro são atualmente expostas diretamente na resposta quando são instâncias de `Error`.

## Pontos de atenção do estado atual

Estes pontos refletem o código existente e devem ser tratados antes de considerar todos os endpoints prontos para produção:

1. O arquivo `ListCategoryController.ts` contém uma classe chamada `DetailCategoryController`, embora a funcionalidade atual seja listagem. É uma inconsistência de nomenclatura, sem alterar o contrato da rota.
2. O schema Prisma de `Item` declara `product_id` e a relação com `Product`, mas a migration `20260818054159_create_tables` cria a tabela `items` sem a coluna `product_id` nem a foreign key correspondente. É necessário gerar/aplicar uma migration de alinhamento antes de usar essa relação.
3. A migration cria a foreign key de `products.category_id` com `ON DELETE CASCADE`, enquanto o schema Prisma atual não declara explicitamente `onDelete`. O schema e o histórico do banco devem ser alinhados conforme a regra desejada.
4. O arquivo de tipos do Express declara `user_id` e `category_id` como obrigatórios, embora `isAuthenticated` possa deixar `user_id` ausente até a validação e `category_id` não seja preenchido atualmente.
5. A variável de porta está sendo lida como `process.env.port`; por convenção, normalmente seria `PORT`. Qualquer mudança deve ser refletida no ambiente de execução e na documentação.
6. `GET /orders` lê `draft` de `req.body`, embora seja uma requisição GET. Sem `draft: "true"`, o service lista pedidos que não são rascunho.
7. As schemas de adicionar item, remover item e detalhar pedido validam parâmetros de rota, mas os controllers leem os IDs de `req.body`.
8. A schema de listagem por categoria valida `category_id` em `query`, mas a rota e o controller usam `params`.

## Comandos principais

Na pasta `backend`:

```bash
npm install
npm run dev
npx prisma generate
npx prisma migrate dev
```

Variáveis mínimas esperadas no ambiente:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
JWT_SECRET=uma-chave-secreta
CLOUDINARY_CLOUD_NAME=nome-da-conta
CLOUDINARY_API_KEY=chave-da-api
CLOUDINARY_API_SECRET=segredo-da-api
```
