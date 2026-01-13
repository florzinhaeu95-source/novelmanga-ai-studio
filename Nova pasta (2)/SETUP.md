# NovelManga AI Studio - Setup Guide

## 📦 Instalação das Dependências

Após baixar ou clonar o projeto, siga estes passos:

### 1. Instalar Node.js
Se ainda não tiver o Node.js instalado:
- Baixe em: https://nodejs.org
- Versão recomendada: 18.x ou superior

### 2. Instalar Dependências do Projeto

No terminal, dentro da pasta do projeto, execute:

```bash
npm install
```

Isso irá instalar todas as dependências listadas no package.json:
- next (14.0.4)
- react (18.2.0)
- react-dom (18.2.0)
- framer-motion (10.16.16)
- lucide-react (0.294.0)
- jszip (3.10.1)
- jspdf (2.5.1)
- html2canvas (1.4.1)
- next-pwa (5.6.0)
- tailwindcss (3.4.0)
- typescript (5.3.3)

### 3. Executar em Desenvolvimento

```bash
npm run dev
```

Abra http://localhost:3000 no navegador.

### 4. Build de Produção

Para criar a versão otimizada:

```bash
npm run build
npm start
```

## 🚀 Deploy Rápido

Para hospedar gratuitamente:

### Opção 1: Vercel (Recomendado)

1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

### Opção 2: Netlify

1. Instale o Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Faça login:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

## 📱 Testar PWA Localmente

Para testar o PWA em produção local:

1. Build do projeto:
```bash
npm run build
```

2. Iniciar servidor de produção:
```bash
npm start
```

3. Abrir no navegador:
```
http://localhost:3000
```

4. No Chrome, abra as DevTools (F12):
   - Vá em "Application" → "Manifest"
   - Verifique se o manifest está carregado
   - Vá em "Service Workers"
   - Verifique se está registrado

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção local
npm start

# Linting
npm run lint

# Limpar cache
rm -rf .next
npm run build
```

## 📝 Estrutura de Arquivos

```
novelmanga-ai-studio/
├── app/                    # Páginas e rotas Next.js
│   ├── dashboard/         # Todas as páginas do dashboard
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Página de login
│   └── providers.tsx      # Providers (tema, etc)
├── lib/                   # Utilitários
│   └── storage.ts         # Gerenciamento localStorage
├── types/                 # TypeScript types
│   └── index.ts
├── public/                # Arquivos estáticos
│   ├── manifest.json      # PWA manifest
│   ├── icon-*.png         # Ícones PWA
│   ├── offline.html       # Página offline
│   └── favicon.ico
├── next.config.js         # Configuração Next.js + PWA
├── tailwind.config.js     # Configuração Tailwind
├── tsconfig.json          # Configuração TypeScript
├── package.json           # Dependências
└── README.md             # Documentação
```

## 🎯 Primeiro Uso

1. Acesse o app (local ou hospedado)
2. Faça login com a senha: **23041993**
3. Explore o dashboard
4. Crie personagens
5. Converta uma novel
6. Edite as cenas
7. Exporte seu projeto!

## 🐛 Troubleshooting

### Erro: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro de build
```bash
rm -rf .next
npm run build
```

### Port 3000 já em uso
```bash
# Use outra porta
PORT=3001 npm run dev
```

### PWA não funciona em dev
O PWA só funciona em produção (build). Use:
```bash
npm run build
npm start
```

## 📚 Documentação Adicional

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [PWA Guide](https://web.dev/progressive-web-apps/)

## 💡 Dicas

1. **Desenvolvimento**: Use `npm run dev` para hot-reload
2. **PWA**: Teste apenas após build (`npm run build && npm start`)
3. **Mobile**: Use Chrome DevTools → Device Mode para simular mobile
4. **Cache**: Limpe `.next/` se tiver problemas estranhos
5. **TypeScript**: Todos os tipos estão em `types/index.ts`

## 🎉 Pronto!

Seu ambiente está configurado e pronto para uso!

Se tiver dúvidas, consulte o README.md principal.

---

**Desenvolvido com ❤️ para criadores de manhwa/webtoon**
