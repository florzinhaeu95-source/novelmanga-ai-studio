# NovelManga AI Studio - Deployment Instructions

## 🚀 Quick Deploy

Este projeto está pronto para ser hospedado gratuitamente no Vercel.

### Método 1: Deploy via Vercel Dashboard (Mais Fácil)

1. **Criar conta no Vercel** (se não tiver):
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Importar Projeto**:
   - Clique em "Add New Project"
   - Selecione o repositório do GitHub
   - Clique em "Import"

3. **Configurar Build** (já está configurado no next.config.js):
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Clique em "Deploy"

4. **Aguarde o Deploy**:
   - O Vercel irá instalar dependências e fazer o build
   - Em ~2-3 minutos seu app estará online!

5. **Acesse o Link**:
   - O Vercel fornecerá um link tipo: `seu-projeto.vercel.app`
   - Abra no celular e instale como PWA!

### Método 2: Deploy via CLI

1. **Instalar Vercel CLI**:
```bash
npm install -g vercel
```

2. **Fazer Login**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Para produção**:
```bash
vercel --prod
```

## 📱 Instalar como PWA

Após o deploy:

### No Android (Chrome):
1. Abra o link do Vercel no Chrome
2. Toque no menu (3 pontos)
3. Selecione "Instalar app" ou "Adicionar à tela inicial"
4. Pronto! Ícone do app na sua tela inicial

### No iPhone (Safari):
1. Abra o link do Vercel no Safari
2. Toque no botão Compartilhar
3. Role e toque em "Adicionar à Tela de Início"
4. Pronto! Ícone do app na sua tela inicial

### No Desktop (Chrome/Edge):
1. Abra o link no navegador
2. Clique no ícone de "Instalar" na barra de endereços
3. Ou vá em Menu → "Instalar NovelManga AI Studio"
4. O app será instalado como aplicativo nativo!

## 🔧 Configurações Adicionais

### Custom Domain (Opcional)
No painel do Vercel:
1. Vá em Settings → Domains
2. Adicione seu domínio personalizado
3. Configure o DNS conforme instruções

### Environment Variables (Se precisar no futuro)
No painel do Vercel:
1. Vá em Settings → Environment Variables
2. Adicione as variáveis necessárias

## ✅ Checklist Pós-Deploy

- [ ] App abrindo corretamente
- [ ] Login funcionando (senha: 23041993)
- [ ] Dashboard carregando
- [ ] Criar personagem funciona
- [ ] Converter novel funciona
- [ ] Editor funciona
- [ ] Exportação funciona
- [ ] PWA instalável
- [ ] Tema claro/escuro funciona
- [ ] Mobile responsivo

## 🎉 Pronto!

Seu NovelManga AI Studio está no ar!

Link será algo como:
**https://novelmanga-ai-studio.vercel.app**

Compartilhe com amigos (mas lembre-se da senha!)

---

## 🐛 Problemas Comuns

### Build Error
- Verifique se todas as dependências estão no package.json
- Rode `npm install` localmente primeiro
- Veja os logs no Vercel para detalhes

### PWA não instala
- Certifique-se que está acessando via HTTPS (Vercel já usa)
- Use Chrome ou Edge no desktop
- No mobile, use Chrome (Android) ou Safari (iOS)

### Imagens não carregam
- Os placeholders usam placehold.co
- Verifique se o site não está bloqueado

---

**Qualquer dúvida, consulte a documentação do Vercel:**
https://vercel.com/docs
