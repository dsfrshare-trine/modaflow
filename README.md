<div align="center">

# 🛍️ ModaFlow

### Plataforma Multi-Tenant de E-commerce de Moda com IA

*Transforme seu negócio de moda com uma solução completa de vendas B2B/B2C*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 🎥 Demonstração

> **Veja o ModaFlow em ação!** Uma plataforma completa de e-commerce multi-tenant com recursos avançados de IA.

https://github.com/user-attachments/assets/demo-modaflow-video.mp4

*💡 Recursos mostrados: Gestão multi-tenant, catálogo de produtos, checkout inteligente, painel administrativo e geração de conteúdo com IA.*

---

## ✨ Principais Recursos

### 🏢 **Multi-Tenancy Completo**
- Múltiplas lojas independentes em uma única plataforma
- Personalização total de marca (cores, logo, menu)
- Gestão isolada de produtos, pedidos e clientes por tenant

### 🤖 **Inteligência Artificial Integrada**
- Geração automática de descrições de produtos com Gemini AI
- Otimização de SEO com keywords inteligentes
- Descrições de categorias personalizadas

### 💼 **Vendas B2B Otimizadas**
- Quantidade mínima de pedido por produto
- Checkout via WhatsApp ou PIX
- Gestão de pedidos em lote
- Painel administrativo completo

### 📊 **Dashboard Analítico**
- Métricas de vendas em tempo real
- Análise de produtos mais vendidos
- Acompanhamento de receita (confirmada e pendente)
- Filtros por período (semana, mês, ano)

### 🎨 **Interface Moderna**
- Design responsivo e elegante
- Experiência de usuário otimizada
- Componentes reutilizáveis
- Animações suaves e profissionais

### 🔐 **Autenticação & Autorização**
- Sistema JWT completo
- Controle de acesso por roles (Admin, Lojista, Cliente)
- Proteção de rotas e recursos

---

## 🏗️ Arquitetura

```
ModaFlow/
├── 📱 Frontend (React + TypeScript + Vite)
│   ├── Componentes reutilizáveis
│   ├── Gestão de estado local
│   ├── Integração com API REST
│   └── UI/UX moderna com Tailwind CSS
│
└── 🔧 Backend (Node.js + Express + Prisma)
    ├── API RESTful completa
    ├── Autenticação JWT
    ├── Banco de dados SQLite/PostgreSQL
    ├── Integração Gemini AI
    └── Validação com Zod
```

---

## 🚀 Início Rápido

### **Pré-requisitos**
- Node.js 18+ instalado
- npm ou yarn
- Chave API do Gemini (opcional, para recursos de IA)

### **1️⃣ Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/modaflow.git
cd modaflow
```

### **2️⃣ Configure o Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edite o .env e adicione sua GEMINI_API_KEY (opcional)
npm run db:push
npm run db:seed
npm run dev
```

✅ Backend rodando em: **http://localhost:3001**

### **3️⃣ Configure o Frontend**
```bash
cd ..
npm install
npm run dev
```

✅ Frontend rodando em: **http://localhost:3000**

---

## 🎯 Funcionalidades Detalhadas

### **Para Administradores**
- ✅ Criar e gerenciar múltiplos tenants
- ✅ Visualizar todas as vendas da plataforma
- ✅ Gerenciar usuários e permissões
- ✅ Acesso total ao sistema

### **Para Lojistas**
- ✅ Personalizar aparência da loja
- ✅ Adicionar/editar produtos com IA
- ✅ Gerenciar pedidos e status
- ✅ Visualizar dashboard de vendas
- ✅ Configurar métodos de checkout

### **Para Clientes**
- ✅ Navegar catálogo de produtos
- ✅ Adicionar ao carrinho (respeitando mínimos)
- ✅ Checkout via WhatsApp ou PIX
- ✅ Acompanhar pedidos

---

## 🔑 Credenciais de Teste

Após executar o seed, use estas credenciais:

| Tipo | Email | Senha |
|------|-------|-------|
| **Admin** | admin@modaflow.com | admin123 |
| **Lojista 1** | lojista@elegance.com | lojista123 |
| **Lojista 2** | lojista@urbanthreads.com | lojista123 |

---

## 📚 Documentação da API

### **Endpoints Principais**

#### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário

#### Tenants
- `GET /api/tenants` - Listar lojas
- `GET /api/tenants/:slug` - Buscar por slug
- `POST /api/tenants` - Criar loja (Admin)
- `PUT /api/tenants/:id` - Atualizar loja

#### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/tenant/:tenantId` - Produtos por loja
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto

#### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `PATCH /api/orders/:id/status` - Atualizar status

#### IA (Gemini)
- `POST /api/ai/product-description` - Gerar descrição
- `POST /api/ai/seo-keywords` - Gerar keywords
- `POST /api/ai/category-description` - Gerar descrição de categoria

📖 **Documentação completa:** [Backend README](./backend/README.md)

---

## 🛠️ Stack Tecnológica

### **Frontend**
- ⚛️ React 19 - Biblioteca UI
- 🔷 TypeScript - Tipagem estática
- ⚡ Vite - Build tool ultrarrápido
- 📊 Recharts - Gráficos e visualizações
- 🎨 Tailwind CSS - Estilização (conceitual)

### **Backend**
- 🟢 Node.js - Runtime JavaScript
- 🚂 Express - Framework web
- 🔷 TypeScript - Tipagem estática
- 🗄️ Prisma - ORM moderno
- 💾 SQLite/PostgreSQL - Banco de dados
- 🔐 JWT - Autenticação
- ✅ Zod - Validação de schemas
- 🤖 Gemini AI - Inteligência artificial

---

## 📦 Scripts Disponíveis

### **Frontend**
```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

### **Backend**
```bash
npm run dev        # Inicia servidor com hot reload
npm run build      # Compila TypeScript
npm start          # Inicia servidor em produção
npm run db:push    # Sincroniza schema do Prisma
npm run db:seed    # Popula banco com dados de exemplo
npm run db:studio  # Abre Prisma Studio
```

---

## 🎨 Capturas de Tela

### Storefront
*Interface elegante para clientes navegarem e comprarem produtos*

### Painel Administrativo
*Dashboard completo com métricas e gestão de produtos*

### Gestão de Pedidos
*Acompanhamento em tempo real de todos os pedidos*

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🌟 Próximas Features

- [ ] Upload de imagens para produtos
- [ ] Sistema de cupons e descontos
- [ ] Integração com gateways de pagamento
- [ ] Notificações em tempo real
- [ ] Relatórios exportáveis (PDF/Excel)
- [ ] App mobile (React Native)
- [ ] Sistema de avaliações de produtos
- [ ] Chat de suporte integrado

---

## 💬 Suporte

Encontrou um bug ou tem uma sugestão? 

- 🐛 [Abra uma issue](https://github.com/seu-usuario/modaflow/issues)
- 💡 [Inicie uma discussão](https://github.com/seu-usuario/modaflow/discussions)

---

<div align="center">

**Feito com ❤️ para revolucionar o e-commerce de moda**

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>
