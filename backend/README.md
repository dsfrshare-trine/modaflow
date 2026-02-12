# ModaFlow Backend API

Backend REST API para o ModaFlow - Plataforma Multi-tenant de E-commerce de Moda.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (desenvolvimento)
- **JWT** - Autenticação
- **Gemini AI** - Geração de conteúdo com IA
- **Zod** - Validação de schemas

## 📦 Instalação

```bash
cd backend
npm install
```

## ⚙️ Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key-here
CORS_ORIGIN=http://localhost:5173
```

3. Inicialize o banco de dados:
```bash
npm run db:push
```

4. Popule o banco com dados de exemplo:
```bash
npm run db:seed
```

## 🏃 Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Autenticação

#### POST `/api/auth/register`
Registrar novo usuário.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "name": "Nome do Usuário",
  "role": "CUSTOMER",
  "tenantId": "uuid-opcional"
}
```

#### POST `/api/auth/login`
Login de usuário.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Nome",
      "role": "CUSTOMER"
    },
    "token": "jwt-token"
  }
}
```

#### GET `/api/auth/profile`
Obter perfil do usuário autenticado.

**Headers:** `Authorization: Bearer {token}`

### Tenants (Lojas)

#### GET `/api/tenants`
Listar todos os tenants ativos.

#### GET `/api/tenants/:slug`
Obter tenant por slug (inclui produtos).

#### POST `/api/tenants`
Criar novo tenant (requer autenticação ADMIN).

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "name": "Nome da Loja",
  "slug": "nome-loja",
  "logoUrl": "https://...",
  "primaryColor": "#6366f1",
  "categories": ["Categoria1", "Categoria2"],
  "menuItems": ["Menu1", "Menu2"],
  "checkoutMode": "WHATSAPP",
  "whatsapp": "5511999999999",
  "heroTitle": "Título Hero",
  "heroImageUrl": "https://..."
}
```

#### PUT `/api/tenants/:id`
Atualizar tenant (requer autenticação ADMIN ou LOJISTA do tenant).

#### DELETE `/api/tenants/:id`
Desativar tenant (requer autenticação ADMIN).

### Produtos

#### GET `/api/products`
Listar todos os produtos.

**Query params:**
- `category` - Filtrar por categoria
- `minPrice` - Preço mínimo
- `maxPrice` - Preço máximo
- `search` - Buscar por nome/descrição

#### GET `/api/products/tenant/:tenantId`
Listar produtos de um tenant específico.

#### GET `/api/products/:id`
Obter produto por ID.

#### POST `/api/products`
Criar novo produto (requer autenticação ADMIN ou LOJISTA).

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "tenantId": "uuid",
  "name": "Nome do Produto",
  "description": "Descrição detalhada",
  "price": 99.99,
  "category": "Categoria",
  "images": ["https://...", "https://..."],
  "sizes": ["S", "M", "L"],
  "stock": 100,
  "minQuantity": 10
}
```

#### PUT `/api/products/:id`
Atualizar produto (requer autenticação ADMIN ou LOJISTA do tenant).

#### DELETE `/api/products/:id`
Desativar produto (requer autenticação ADMIN ou LOJISTA do tenant).

### Pedidos

#### GET `/api/orders`
Listar todos os pedidos (requer autenticação ADMIN).

#### GET `/api/orders/tenant/:tenantId`
Listar pedidos de um tenant (requer autenticação ADMIN ou LOJISTA do tenant).

#### GET `/api/orders/:id`
Obter pedido por ID (requer autenticação).

#### POST `/api/orders`
Criar novo pedido.

**Body:**
```json
{
  "tenantId": "uuid",
  "customerName": "Nome do Cliente",
  "customerEmail": "cliente@example.com",
  "customerPhone": "+55 11 99999-9999",
  "items": [
    {
      "productId": "uuid",
      "quantity": 10,
      "price": 99.99
    }
  ]
}
```

#### PATCH `/api/orders/:id/status`
Atualizar status do pedido (requer autenticação ADMIN ou LOJISTA).

**Body:**
```json
{
  "status": "PAID"
}
```

Status disponíveis: `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### IA (Gemini)

#### POST `/api/ai/product-description`
Gerar descrição de produto com IA (requer autenticação ADMIN ou LOJISTA).

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "productName": "Vestido de Seda",
  "category": "Vestidos",
  "brandName": "Elegance Fashion"
}
```

#### POST `/api/ai/seo-keywords`
Gerar palavras-chave SEO (requer autenticação ADMIN ou LOJISTA).

**Body:**
```json
{
  "productName": "Vestido de Seda"
}
```

#### POST `/api/ai/category-description`
Gerar descrição de categoria (requer autenticação ADMIN ou LOJISTA).

**Body:**
```json
{
  "categoryName": "Vestidos",
  "brandName": "Elegance Fashion"
}
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token no header:

```
Authorization: Bearer {seu-token-jwt}
```

## 👥 Roles (Papéis)

- **ADMIN** - Acesso total ao sistema
- **LOJISTA** - Gerencia seu próprio tenant
- **CUSTOMER** - Cliente final (visualização de pedidos próprios)

## 🧪 Credenciais de Teste

Após executar o seed:

- **Admin:** admin@modaflow.com / admin123
- **Lojista 1:** lojista@elegance.com / lojista123
- **Lojista 2:** lojista@urbanthreads.com / lojista123

## 📊 Banco de Dados

Para visualizar o banco de dados:

```bash
npm run db:studio
```

Isso abrirá o Prisma Studio em `http://localhost:5555`

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia servidor em modo desenvolvimento
- `npm run build` - Compila TypeScript para JavaScript
- `npm start` - Inicia servidor em produção
- `npm run db:push` - Sincroniza schema do Prisma com o banco
- `npm run db:studio` - Abre Prisma Studio
- `npm run db:seed` - Popula banco com dados de exemplo

## 📝 Estrutura do Projeto

```
backend/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── config/
│   │   └── database.ts        # Configuração do Prisma
│   ├── controllers/           # Controladores das rotas
│   ├── middleware/            # Middlewares (auth, errors)
│   ├── routes/                # Definição de rotas
│   ├── services/              # Serviços (Gemini AI)
│   ├── database/
│   │   └── seed.ts            # Seed do banco
│   └── server.ts              # Servidor Express
├── .env.example               # Exemplo de variáveis de ambiente
├── package.json
└── tsconfig.json
```

## 🚀 Deploy

Para produção, considere:

1. Usar PostgreSQL ou MySQL ao invés de SQLite
2. Configurar variáveis de ambiente seguras
3. Habilitar HTTPS
4. Configurar rate limiting
5. Adicionar logs estruturados
6. Implementar monitoramento

## 📄 Licença

MIT
