# NovelManga AI Studio

Um Progressive Web App (PWA) completo para converter novels em manhwa/webtoon usando IA generativa.

## 🎨 Funcionalidades

### 🔐 Autenticação
- Tela de login com senha (23041993)
- Autenticação salva no localStorage
- Acesso restrito e seguro

### 📊 Dashboard
- Visão geral de todos os projetos
- Contador de limites mensais:
  - Imagens geradas (420/500)
  - Personagens criados (16/20)
  - Projetos ativos (3/5)
- Cards com thumbnails dos projetos
- Design mobile-first responsivo

### 👤 Criador de Personagens
- Formulário completo para criar personagens:
  - Nome
  - Descrição física detalhada
  - Roupas e estilo
  - Personalidade
- Upload de imagem de referência
- Geração de personagem com IA (simulado)
- Galeria em grid de todos os personagens
- Preview dos personagens criados

### 📖 Conversor Novel → Manhwa
- Área de texto grande para colar novels
- Seletor de personagens (chips/tags)
- Configurações avançadas:
  - Estilo: Manhwa/Manga/Webtoon
  - Formato: Quadrinhos (páginas) ou Scroll Vertical
  - Paleta de cores (5 opções)
- Divisão automática de texto em cenas
- Detecção de diálogos

### ✏️ Editor de Cenas
- Visualização em modo carousel ou scroll
- Navegação entre cenas (prev/next)
- Para cada cena:
  - Imagem gerada
  - Texto descritivo
  - Diálogo
  - Botões: Editar, Regenerar, Deletar
- Editor individual com:
  - Ajuste de prompt
  - Seleção de ângulo
  - Seleção de expressão
  - Regeneração de imagem
- Reordenação por drag-and-drop
- Preview nos dois modos

### 📤 Exportação
- Preview final em ambos os modos
- Opções de exportação:
  - Salvar como imagens (ZIP)
  - Gerar PDF
  - Compartilhar online (link)
- Salvar projeto automaticamente

## 🎯 Tecnologias

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animações)
- **Lucide React** (ícones)
- **PWA** (manifest.json, service worker)
- **LocalStorage** (persistência de dados)

## 📱 Progressive Web App

Este projeto é um PWA completo com:
- ✅ Manifest configurado
- ✅ Service Worker
- ✅ Instalável na tela inicial
- ✅ Funciona offline
- ✅ Ícones otimizados (192x192, 512x512)
- ✅ Splash screen
- ✅ Tema configurado

## 🚀 Como Usar

### Instalação Local

1. **Clone o repositório**
```bash
git clone <repo-url>
cd novelmanga-ai-studio
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

5. **Faça login com a senha**: `23041993`

### Instalação como PWA

1. Acesse o app no navegador (Chrome/Edge recomendado)
2. Clique no ícone de "Instalar" na barra de endereços
3. Ou no menu: "Instalar NovelManga AI Studio"
4. O app será adicionado à sua tela inicial/área de trabalho

## 📖 Guia de Uso

### 1. Primeiro Acesso
- Faça login com a senha: `23041993`
- Você será direcionado ao Dashboard

### 2. Criar Personagens
- Vá em "Personagens" (menu inferior)
- Clique em "Novo"
- Preencha os dados do personagem
- Clique em "Gerar Personagem com IA"
- Aguarde a geração (simulada - 3 segundos)

### 3. Converter Novel em Manhwa
- Vá em "Converter" (menu inferior)
- Dê um título ao projeto
- Cole o texto da sua novel
- Selecione os personagens que aparecem na história
- Configure estilo, formato e paleta de cores
- Clique em "Converter em Manhwa"
- Aguarde o processamento (simulado - 4 segundos)

### 4. Editar Cenas
- Após a conversão, você será levado ao Editor
- Use os botões de navegação para ver as cenas
- Edite cada cena individualmente
- Regenere imagens específicas
- Delete cenas indesejadas
- Reordene arrastando (modo scroll)

### 5. Exportar Projeto
- No Editor, clique em "Exportar"
- Escolha entre:
  - ZIP de imagens
  - PDF
  - Compartilhamento online
- Aguarde o processamento

## 🎨 Design

- **Mobile-first**: Otimizado para dispositivos móveis
- **Tema escuro/claro**: Toggle no header
- **Material Design 3**: Interface moderna
- **Animações suaves**: Framer Motion
- **Bottom navigation**: Navegação otimizada para mobile
- **Gestos**: Swipe, drag-and-drop
- **Cards modernos**: Visual atraente
- **Progress bars**: Feedback visual de limites

## 💾 Armazenamento

Todos os dados são salvos localmente no navegador usando localStorage:
- Projetos criados
- Personagens
- Limites mensais
- Configurações
- Estado de autenticação

**Importante**: Limpar o cache do navegador irá apagar todos os dados!

## 🔒 Segurança

- Senha de acesso: `23041993`
- Todos os dados ficam apenas no dispositivo
- Nenhuma informação é enviada para servidores externos
- Uso 100% local e offline

## 🎯 Limites Mensais

O sistema simula limites mensais de uso:
- **Imagens**: 500/mês (começa em 420 como exemplo)
- **Personagens**: 20/mês (começa em 16 como exemplo)
- **Projetos ativos**: 5 simultâneos (começa em 3 como exemplo)

Reset automático no dia 1º de cada mês.

## 🛠️ Desenvolvimento

### Estrutura de Pastas

```
novelmanga-ai-studio/
├── app/
│   ├── dashboard/
│   │   ├── characters/        # Criador de personagens
│   │   ├── converter/         # Conversor novel → manhwa
│   │   ├── editor/[id]/       # Editor de cenas
│   │   ├── export/[id]/       # Exportação
│   │   ├── new-project/       # Novo projeto
│   │   ├── settings/          # Configurações
│   │   └── page.tsx           # Dashboard principal
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx               # Login
│   └── providers.tsx
├── lib/
│   └── storage.ts             # Funções de localStorage
├── types/
│   └── index.ts               # TypeScript types
├── public/
│   ├── manifest.json
│   ├── icon-192.svg
│   ├── icon-512.svg
│   └── offline.html
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

### Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm start        # Servidor de produção
npm run lint     # Linting
```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Via GitHub**:
   - Conecte o repositório no Vercel
   - Deploy automático

2. **Via CLI**:
```bash
npm install -g vercel
vercel
```

### Netlify

1. Conecte o repositório no Netlify
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`

## 🎨 Personalização

### Cores
Edite `tailwind.config.js` para mudar as cores primárias.

### Senha
Altere a constante `CORRECT_PASSWORD` em `app/page.tsx`.

### Limites
Ajuste os valores padrão em `lib/storage.ts` na função `getDefaultState()`.

## 🐛 Troubleshooting

### Dados perdidos
Se você perdeu seus dados, verifique se:
- Não limpou o cache do navegador
- Está usando o mesmo navegador
- Não está em modo anônimo/privado

### PWA não instala
- Use Chrome ou Edge (melhor suporte)
- Verifique se está em HTTPS (ou localhost)
- Limpe o cache e tente novamente

### Imagens não carregam
- Verifique sua conexão com internet
- Os placeholders usam placehold.co - verifique se não está bloqueado

## 📝 Notas Importantes

1. **Simulação de IA**: Este app simula a geração de imagens com placeholders. Para integração real com IA, você precisaria de APIs de geração de imagens.

2. **Armazenamento Local**: Todos os dados ficam no navegador. Para produção real, considere usar um backend com banco de dados.

3. **Exportação**: A exportação de ZIP e PDF está simulada. Para implementação real, use as bibliotecas JSZip e jsPDF.

4. **Uso Pessoal**: Este app foi projetado para uso pessoal com senha única.

## 📄 Licença

Este projeto é de uso pessoal.

## 🎉 Próximos Passos

Possíveis melhorias futuras:
- [ ] Integração real com APIs de IA (DALL-E, Stable Diffusion, etc.)
- [ ] Backend com banco de dados
- [ ] Autenticação multi-usuário
- [ ] Exportação real de ZIP/PDF
- [ ] Upload de novels em arquivo
- [ ] Edição avançada de imagens
- [ ] Compartilhamento real online
- [ ] Histórico de versões
- [ ] Colaboração em tempo real
