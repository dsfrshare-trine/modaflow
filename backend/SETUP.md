# 🚀 Setup Rápido - ModaFlow Backend

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## Instalação em 5 passos

### 1️⃣ Instalar dependências
```bash
cd backend
npm install
```

### 2️⃣ Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave da API Gemini:
```env
GEMINI_API_KEY=sua-chave-aqui
```

Para obter a chave Gemini:
- Acesse: https://makersuite.google.com/app/apikey
- Crie uma nova API key
- Cole no arquivo `.env`

### 3️⃣ Inicializar banco de dados
```bash
npm run db:push
```

### 4️⃣ Popular com dados de exemplo
```bash
npm run db:seed
```

### 5️⃣ Iniciar servidor
```bash
npm run dev
```

O servidor estará rodando em: **http://localhost:3001**

## ✅ Testar a API

### Health Check
```bash
curl http://localhost:3001/health
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@modaflow.com",
    "password": "admin123"
  }'
```

### Listar Tenants
```bash
curl http://localhost:3001/api/tenants
```

### Listar Produtos
```bash
curl http://localhost:3001/api/products
```

## 🔑 Credenciais de Teste

- **Admin:** admin@modaflow.com / admin123
- **Lojista 1:** lojista@elegance.com / lojista123
- **Lojista 2:** lojista@urbanthreads.com / lojista123

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento com hot reload
npm run dev

# Visualizar banco de dados
npm run db:studio

# Build para produção
npm run build

# Rodar em produção
npm start
```

## 📊 Prisma Studio

Para visualizar e editar dados do banco:
```bash
npm run db:studio
```

Abrirá em: http://localhost:5555

## 🐛 Troubleshooting

### Erro: "GEMINI_API_KEY is not set"
- Verifique se o arquivo `.env` existe
- Confirme que a variável `GEMINI_API_KEY` está definida

### Erro: "Port 3001 already in use"
- Altere a porta no arquivo `.env`: `PORT=3002`
- Ou mate o processo usando a porta 3001

### Banco de dados não inicializa
```bash
# Deletar banco e recriar
rm prisma/dev.db
npm run db:push
npm run db:seed
```

## 📚 Próximos Passos

1. Explore a documentação completa em `README.md`
2. Teste os endpoints com Postman ou Insomnia
3. Integre com o frontend React
4. Customize os tenants e produtos conforme necessário

## 🔗 Recursos

- [Documentação Prisma](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Gemini AI API](https://ai.google.dev/docs)
