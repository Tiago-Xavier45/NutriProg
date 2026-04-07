# 🥗 NutriProg

**NutriProg** é uma aplicação web focada em nutrição e acompanhamento alimentar, construída com Laravel 13 + React 19 via Inertia.js, oferecendo uma experiência de SPA (Single Page Application) moderna sem a complexidade tradicional de APIs separadas.

---

## 🚀 Stack Tecnológica

### Backend
| Tecnologia | Versão |
|---|---|
| PHP | ^8.3 |
| Laravel Framework | ^13.0 |
| Inertia.js (Laravel) | ^3.0 |
| Laravel Fortify | ^1.34 |
| Laravel Wayfinder | ^0.1 |
| Laravel Tinker | ^3.0 |

### Frontend
| Tecnologia | Versão |
|---|---|
| React | 19 |
| TypeScript | — |
| Tailwind CSS | v4 |
| Vite | — |
| @inertiajs/react | ^3.0 |

### Ferramentas de Desenvolvimento
- **Pest** v4 — framework de testes
- **Laravel Pint** — formatador de código PHP
- **Laravel Sail** — ambiente Docker
- **ESLint** v9 + **Prettier** v3 — linting e formatação de frontend

---

## 📋 Pré-requisitos

- PHP >= 8.3
- Composer
- Node.js >= 20
- NPM
- SQLite (padrão) ou MySQL/PostgreSQL

---

## ⚙️ Instalação

### Setup automático (recomendado)

```bash
# Clone o repositório
git clone https://github.com/Tiago-Xavier45/NutriProg.git
cd NutriProg

# Execute o script de setup completo
composer run setup
```

O comando acima executa automaticamente:
1. `composer install`
2. Copia `.env.example` para `.env`
3. Gera a chave da aplicação
4. Executa as migrations
5. `npm install`
6. `npm run build`

### Setup manual

```bash
# 1. Instale as dependências PHP
composer install

# 2. Configure o ambiente
cp .env.example .env
php artisan key:generate

# 3. Configure o banco de dados no .env e execute as migrations
php artisan migrate

# 4. Instale as dependências JavaScript
npm install

# 5. Compile os assets
npm run build
```

---

## ▶️ Executando o Projeto

```bash
# Inicia todos os serviços simultaneamente (servidor, queue e Vite)
composer run dev
```

Este comando sobe:
- `php artisan serve` — servidor Laravel
- `php artisan queue:listen` — worker de filas
- `npm run dev` — compilador Vite (hot reload)

Acesse em: **http://localhost:8000**

---

## 🧪 Testes

```bash
# Executa todos os testes
composer run test

# Ou diretamente com Artisan (modo compacto)
php artisan test --compact

# Filtrar por nome de teste
php artisan test --compact --filter=NomeDoTeste
```

---

## 🔍 Qualidade de Código

```bash
# Formatar PHP com Pint
composer run lint

# Verificar formatação (sem alterar arquivos)
composer run lint:check

# Verificar tudo (CI)
composer run ci:check
```

---

## 📁 Estrutura de Diretórios

```
NutriProg/
├── app/                  # Lógica da aplicação (Controllers, Models, etc.)
├── bootstrap/            # Inicialização do framework
├── config/               # Arquivos de configuração
├── database/             # Migrations, Factories e Seeders
├── public/               # Assets públicos
├── resources/
│   └── js/
│       └── pages/        # Páginas React (Inertia)
├── routes/               # Definição de rotas
├── storage/              # Arquivos gerados pela aplicação
├── tests/                # Testes automatizados (Pest)
└── .env.example          # Exemplo de configuração de ambiente
```

---

## 🔐 Autenticação

A autenticação é gerenciada pelo **Laravel Fortify**, com suporte a:
- Login e registro de usuários
- Redefinição de senha
- Verificação de e-mail
- Autenticação de dois fatores (2FA)

---

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Certifique-se de que os testes passam: `composer run test`
4. Abra um Pull Request

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
