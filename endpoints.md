# Endpoints da API PDV

Referencia dos 17 endpoints registrados em `src/routes.ts`. A API nao possui prefixo global. Nos exemplos, `http://localhost:3333` e usado como base e `$TOKEN` representa o JWT retornado por `POST /session`.

## Convencoes

### Autenticacao

As rotas protegidas exigem:

```http
Authorization: Bearer $TOKEN
```

Rotas administrativas tambem exigem que o usuario autenticado tenha `role: "ADMIN"`.

### Erros

Falhas de validacao retornam `400`:

```json
{
  "error": "Validation error",
  "details": [{ "field": "name", "message": "..." }]
}
```

Erros de regra de negocio sao convertidos pelo handler global em `400`:

```json
{ "error": "mensagem do erro" }
```

Sem token, a resposta e `401` com `Token nao fornecido`. Token invalido ou expirado retorna `401` com `Token invalido!`.

> Os exemplos de resposta usam UUIDs e datas ilustrativos. Os nomes e os campos refletem o retorno efetivo dos controllers/services.

## Usuarios e sessao

### POST `/users`

Cria um usuario publico. Nao exige autenticacao.

**Body JSON**

| Campo      | Tipo   | Obrigatorio | Regra                  |
| ---------- | ------ | ----------- | ---------------------- |
| `name`     | string | sim         | Minimo de 3 caracteres |
| `email`    | string | sim         | E-mail valido          |
| `password` | string | sim         | Minimo de 6 caracteres |

**Exemplo**

```bash
curl -X POST http://localhost:3333/users ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Maria Silva\",\"email\":\"maria@example.com\",\"password\":\"senha123\"}"
```

**Resposta `200`**

```json
{
  "id": "a1b2c3d4-e5f6-47a8-9012-abcdef123456",
  "name": "Maria Silva",
  "email": "maria@example.com",
  "role": "STAFF",
  "createdAt": "2026-08-23T12:00:00.000Z"
}
```

A senha e armazenada com hash bcrypt e nunca e retornada. E-mail repetido gera `400` com `user email already exists`.

### POST `/session`

Autentica um usuario e cria um JWT valido por 30 dias. Nao exige autenticacao.

**Body JSON**

```json
{
  "email": "maria@example.com",
  "password": "senha123"
}
```

**Exemplo**

```bash
curl -X POST http://localhost:3333/session ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"maria@example.com\",\"password\":\"senha123\"}"
```

**Resposta `200`**

```json
{
  "id": "a1b2c3d4-e5f6-47a8-9012-abcdef123456",
  "name": "Maria Silva",
  "role": "STAFF",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

E-mail inexistente ou senha incorreta retorna `400` com `E-mail e senha sao obrigatorios!`.

### GET `/me`

Retorna o usuario identificado pelo JWT.

**Exemplo**

```bash
curl http://localhost:3333/me -H "Authorization: Bearer $TOKEN"
```

**Resposta `200`**

```json
{
  "id": "a1b2c3d4-e5f6-47a8-9012-abcdef123456",
  "name": "Maria Silva",
  "email": "maria@example.com",
  "createdAt": "2026-08-23T12:00:00.000Z",
  "role": "STAFF"
}
```

## Categorias

### POST `/category`

Cria categoria. Exige usuario autenticado com perfil `ADMIN`.

**Body JSON**

```json
{ "name": "Bebidas" }
```

**Exemplo**

```bash
curl -X POST http://localhost:3333/category ^
  -H "Authorization: Bearer $TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Bebidas\"}"
```

**Resposta `201`**

```json
{
  "id": "cat-uuid",
  "name": "Bebidas",
  "createdAt": "2026-08-23T12:10:00.000Z"
}
```

O nome deve ter ao menos 3 caracteres. Nome repetido retorna `400` com `Categoria ja existe`.

### GET `/categories`

Lista categorias para qualquer usuario autenticado, ordenadas por `createdAt` decrescente.

```bash
curl http://localhost:3333/categories -H "Authorization: Bearer $TOKEN"
```

**Resposta `200`**

```json
[
  {
    "id": "cat-uuid",
    "name": "Bebidas",
    "createdAt": "2026-08-23T12:10:00.000Z"
  }
]
```

## Produtos

### POST `/product`

Cria produto. Exige `ADMIN` e `multipart/form-data`. O campo do arquivo deve ser `file`.

| Campo         | Tipo                     | Obrigatorio | Regra                              |
| ------------- | ------------------------ | ----------- | ---------------------------------- |
| `name`        | texto                    | sim         | Minimo de 1 caractere              |
| `price`       | numero ou texto numerico | sim         | Valor minimo 1; salvo como inteiro |
| `description` | texto                    | sim         | Minimo de 1 caractere              |
| `category_id` | string                   | sim         | Categoria existente                |
| `file`        | imagem                   | sim         | JPEG, JPG ou PNG, ate 4 MiB        |

**Exemplo**

```bash
curl -X POST http://localhost:3333/product ^
  -H "Authorization: Bearer $TOKEN" ^
  -F "name=Suco de laranja" ^
  -F "price=12" ^
  -F "description=Suco natural" ^
  -F "category_id=cat-uuid" ^
  -F "file=@./suco.png"
```

**Resposta `200`**

```json
{
  "id": "prod-uuid",
  "name": "Suco de laranja",
  "price": 12,
  "description": "Suco natural",
  "category_id": "cat-uuid",
  "banner": "https://res.cloudinary.com/demo/image/upload/v123/products/suco.png",
  "createdAt": "2026-08-23T12:20:00.000Z"
}
```

A imagem e enviada para a pasta `products` do Cloudinary. Categoria inexistente, nome repetido ou erro no upload retornam `400`.

### GET `/products`

Lista produtos autenticados. Por padrao lista apenas produtos ativos (`disabled = false`). O filtro aceita `disabled=true` para listar produtos arquivados; qualquer outro valor continua resultando em `false`.

```bash
curl "http://localhost:3333/products?disabled=true" ^
  -H "Authorization: Bearer $TOKEN"
```

**Resposta `200`**

```json
[
  {
    "id": "prod-uuid",
    "name": "Suco de laranja",
    "price": 12,
    "description": "Suco natural",
    "category": {
      "id": "cat-uuid",
      "name": "Bebidas",
      "createdAt": "2026-08-23T12:10:00.000Z",
      "updatedAt": "2026-08-23T12:10:00.000Z"
    },
    "banner": "https://res.cloudinary.com/demo/image/upload/v123/products/suco.png",
    "disabled": false,
    "createdAt": "2026-08-23T12:20:00.000Z"
  }
]
```

Os resultados sao ordenados por `createdAt` decrescente.

### DELETE `/product/:id`

Arquiva logicamente um produto. Exige `ADMIN`; nao remove o registro do banco e define `disabled = true`.

```bash
curl -X DELETE http://localhost:3333/product/prod-uuid ^
  -H "Authorization: Bearer $TOKEN"
```

**Resposta `200`**

```json
{ "message": "Produto deletado/arquivado com sucesso!" }
```

### GET `/category/:category_id/products`

Lista produtos ativos de uma categoria para qualquer usuario autenticado. A categoria e lida do parametro de rota.

```bash
curl http://localhost:3333/category/cat-uuid/products ^
  -H "Authorization: Bearer $TOKEN"
```

**Resposta `200`**

```json
[
  {
    "id": "prod-uuid",
    "name": "Suco de laranja",
    "price": 12,
    "description": "Suco natural",
    "banner": "https://res.cloudinary.com/demo/image/upload/v123/products/suco.png",
    "disabled": false,
    "category_id": "cat-uuid",
    "category": {
      "id": "cat-uuid",
      "name": "Bebidas",
      "createdAt": "2026-08-23T12:10:00.000Z",
      "updatedAt": "2026-08-23T12:10:00.000Z"
    }
  }
]
```

Os resultados sao ordenados por `createdAt` crescente. Categoria inexistente retorna `400` com `Categoria nao encontrada!`.

## Pedidos

### POST `/order`

Cria pedido. Exige `ADMIN`. A mesa deve ser um numero maior ou igual a 1 e o nome nao pode ser vazio. O pedido inicia com `draft: true` e `status: false`.

**Body JSON**

```json
{
  "table": 7,
  "name": "Mesa 7"
}
```

**Exemplo**

```bash
curl -X POST http://localhost:3333/order ^
  -H "Authorization: Bearer $TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"table\":7,\"name\":\"Mesa 7\"}"
```

**Resposta `201`**

```json
{
  "id": "order-uuid",
  "table": 7,
  "status": false,
  "draft": true,
  "name": "Mesa 7",
  "createdAt": "2026-08-23T12:30:00.000Z",
  "updatedAt": "2026-08-23T12:30:00.000Z"
}
```

A tabela possui indice unico no banco; tabela ja utilizada gera erro do banco convertido em `400`.

### GET `/orders`

Lista pedidos autenticados. O service filtra por `draft`: somente o valor textual `"true"` lista rascunhos; qualquer outro valor lista pedidos enviados para producao.

**Estado atual importante:** o controller le `draft` de `req.body`, embora a rota seja `GET` e nao tenha schema de validacao. O exemplo abaixo reproduz esse comportamento atual.

```bash
curl -X GET http://localhost:3333/orders ^
  -H "Authorization: Bearer $TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"draft\":\"true\"}"
```

**Resposta `200`**

```json
[
  {
    "id": "order-uuid",
    "name": "Mesa 7",
    "table": 7,
    "createdAt": "2026-08-23T12:30:00.000Z",
    "draft": true,
    "status": false,
    "items": [
      {
        "id": "item-uuid",
        "amount": 2,
        "product": {
          "id": "prod-uuid",
          "name": "Suco de laranja",
          "description": "Suco natural",
          "banner": "https://res.cloudinary.com/demo/image/upload/v123/products/suco.png"
        }
      }
    ]
  }
]
```

### POST `/order/add/:order_id/:product_id`

Adiciona item ao pedido. Exige `ADMIN`. O service verifica pedido e produto e copia o preco atual do produto para o item.

**Body JSON atual**

```json
{ "amount": 2 }
```

**Exemplo conforme a implementacao atual**

```bash
curl -X POST http://localhost:3333/order/add/order-uuid/prod-uuid ^
  -H "Authorization: Bearer $TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"amount\":2,\"order_id\":\"order-uuid\",\"product_id\":\"prod-uuid\"}"
```

**Resposta `201`**

```json
{
  "id": "item-uuid",
  "amount": 2,
  "createdAt": "2026-08-23T12:35:00.000Z",
  "product": {
    "id": "prod-uuid",
    "name": "Suco de laranja",
    "price": 12,
    "description": "Suco natural",
    "banner": "https://res.cloudinary.com/demo/image/upload/v123/products/suco.png",
    "disabled": false,
    "category_id": "cat-uuid",
    "createdAt": "2026-08-23T12:20:00.000Z",
    "updatedAt": "2026-08-23T12:20:00.000Z"
  },
  "order": {
    "id": "order-uuid",
    "table": 7,
    "status": false,
    "draft": true,
    "name": "Mesa 7",
    "createdAt": "2026-08-23T12:30:00.000Z",
    "updatedAt": "2026-08-23T12:35:00.000Z"
  }
}
```

**Inconsistencia atual:** a schema valida `order_id` e `product_id` em `params`, mas o controller le esses dois campos do `body`. Para passar pela validacao, eles devem ser enviados tambem no body, como no exemplo.

### DELETE `/order/remove/:item_id`

Remove um item. Exige `ADMIN`.

**Exemplo conforme a implementacao atual**

```bash
curl -X DELETE http://localhost:3333/order/remove/item-uuid ^
  -H "Authorization: Bearer $TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"item_id\":\"item-uuid\"}"
```

**Resposta `200`**

Retorna o registro removido, com `id`, `amount`, `price`, `order_id`, `product_id`, `createdAt` e `updatedAt`.

**Inconsistencia atual:** a rota usa `:item_id`, mas o controller le `item_id` do body. Sem esse campo no body, retorna `400` com `ID do item e obrigatorio`.

### GET `/order/detail/:order_id`

Retorna um pedido e seus itens para usuario autenticado.

**Exemplo conforme a implementacao atual**

```bash
curl -X GET http://localhost:3333/order/detail/order-uuid ^
  -H "Authorization: Bearer $TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"order_id\":\"order-uuid\"}"
```

**Resposta `200`**

```json
{
  "id": "order-uuid",
  "table": 7,
  "status": false,
  "draft": true,
  "name": "Mesa 7",
  "createdAt": "2026-08-23T12:30:00.000Z",
  "items": [
    {
      "id": "item-uuid",
      "amount": 2,
      "price": 12,
      "order_id": "order-uuid",
      "product_id": "prod-uuid",
      "createdAt": "2026-08-23T12:35:00.000Z",
      "updatedAt": "2026-08-23T12:35:00.000Z"
    }
  ]
}
```

**Inconsistencia atual:** a schema valida `order_id` em `params`, mas o controller le o valor do body. O exemplo envia o campo nos dois lugares, embora a URL ja contenha o ID.

### PUT `/order/send/:order_id`

Envia um pedido em rascunho para producao, alterando `draft` para `false`. Exige autenticacao, mas nao exige `ADMIN`.

```bash
curl -X PUT http://localhost:3333/order/send/order-uuid ^
  -H "Authorization: Bearer $TOKEN"
```

**Resposta `200`**

Retorna o pedido atualizado, com `draft: false`. Se o pedido nao existir ou ja tiver sido enviado, retorna `400` com `Pedido nao encontrado ou ja foi enviado para a producao!`.

### PUT `/order/finish/:order_id`

Finaliza pedido enviado para producao, alterando `status` para `true`. Exige autenticacao, mas nao exige `ADMIN`.

```bash
curl -X PUT http://localhost:3333/order/finish/order-uuid ^
  -H "Authorization: Bearer $TOKEN"
```

**Resposta `200`**

Retorna o pedido atualizado, com `status: true`. Pedido ainda em rascunho ou ja finalizado retorna `400` com `Esse pedido ja foi finalizado ou ainda nao foi enviado para a producao!`.

### DELETE `/order/delete/:order_id`

Exclui fisicamente um pedido. Exige autenticacao, mas nao exige `ADMIN`. Os itens relacionados sao excluidos em cascata conforme o schema Prisma atual.

```bash
curl -X DELETE http://localhost:3333/order/delete/order-uuid ^
  -H "Authorization: Bearer $TOKEN"
```

**Resposta `200`**

Retorna o pedido excluido, com os campos `id`, `table`, `status`, `draft`, `name`, `createdAt` e `updatedAt`. Pedido inexistente retorna `400` com `Esse pedido nao existe ou ja foi excluido!`.

## Matriz de acesso

| Metodo | Endpoint                           | Auth | ADMIN |
| ------ | ---------------------------------- | ---- | ----- |
| POST   | `/users`                           | nao  | nao   |
| POST   | `/session`                         | nao  | nao   |
| GET    | `/me`                              | sim  | nao   |
| POST   | `/category`                        | sim  | sim   |
| GET    | `/categories`                      | sim  | nao   |
| POST   | `/product`                         | sim  | sim   |
| GET    | `/products`                        | sim  | nao   |
| DELETE | `/product/:id`                     | sim  | sim   |
| GET    | `/category/:category_id/products`  | sim  | nao   |
| POST   | `/order`                           | sim  | sim   |
| GET    | `/orders`                          | sim  | nao   |
| POST   | `/order/add/:order_id/:product_id` | sim  | sim   |
| DELETE | `/order/remove/:item_id`           | sim  | sim   |
| GET    | `/order/detail/:order_id`          | sim  | nao   |
| PUT    | `/order/send/:order_id`            | sim  | nao   |
| PUT    | `/order/finish/:order_id`          | sim  | nao   |
| DELETE | `/order/delete/:order_id`          | sim  | nao   |

## Observacoes para alinhamento futuro

- Corrigir controllers de adicionar, remover e detalhar pedido para ler os IDs de `req.params`, ou remover esses IDs das URLs e schemas de params.
- Alterar `GET /orders` para ler `req.query.draft`, seguindo o padrao HTTP mais esperado para filtros.
- Alterar a schema de produtos por categoria para validar `params.category_id`, pois a rota usa parametro de caminho.
- Criar migration de alinhamento para `items.price` e `items.product_id` antes de executar os fluxos de itens em uma base criada pela migration inicial.
