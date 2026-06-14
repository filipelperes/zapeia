<div align="center">
  <a href="https://github.com/filipelperes/zapeia">
    <img src="public/favicon.svg" alt="Zapeia logo" width="80" />
  </a>
  <h1>Zapeia</h1>
  <p><strong>Visualizador de Conversas Exportadas do WhatsApp</strong></p>
  <p>
    <em>"Zap" + "passeia" — Navegue pelas suas conversas do Zap.</em>
  </p>
  <p>
    <a href="https://hub.docker.com/r/filipelperes/zapeia">
      <img src="https://img.shields.io/docker/v/filipelperes/zapeia?label=Docker%20Hub&logo=docker" alt="Docker Hub" />
    </a>
    <a href="https://github.com/filipelperes/zapeia/actions/workflows/docker-publish.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/filipelperes/zapeia/docker-publish.yml?branch=main&label=CI%2FCD&logo=githubactions" alt="CI/CD" />
    </a>
  </p>
  <br/>
</div>

---

## 🧭 Sobre

**Zapeia** é um visualizador web moderno e elegante para conversas exportadas do WhatsApp. Basta exportar a conversa pelo próprio WhatsApp, copiar o arquivo para o projeto, e o Zapeia renderiza tudo com uma interface fiel ao estilo do WhatsApp Web — formatação de texto, imagens, vídeos, áudios, contatos e muito mais.

O nome é um trocadilho entre **Zap** (apelido do WhatsApp) e **passeia** (navegar, explorar) — uma ferramenta para "passear" pelas conversas.

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🗨️ **Visualização de conversas** | Renderiza arquivos de exportação `.txt` do WhatsApp com formatação completa |
| 🎨 **Temas Claro/Escuro** | Alterna entre os modos claro e escuro com um clique |
| 🔍 **Pesquisa nas mensagens** | Busca instantânea por qualquer texto na conversa |
| 🖼️ **Mídia incorporada** | Exibe imagens, vídeos, áudios e contatos diretamente no chat |
| 🖱️ **Lightbox de imagens** | Clique em imagens para visualizar em tela cheia |
| 💬 **Bolhas de mensagem** | Estilo WhatsApp com bolhas próprias e de terceiros |
| 👤 **Identificação do usuário** | Configure seu nome para destacar suas mensagens |
| 📅 **Separadores de data** | Organização visual por dia |
| ✏️ **Texto formatado** | Suporte a negrito, itálico, riscado e monoespaçado do WhatsApp |
| 📱 **Responsivo** | Layout adaptável para desktop e mobile |
| ⚡ **Cache local** | Carregamento instantâneo em visitas repetidas |
| 🔄 **Auto-detecção** | Detecta automaticamente quando o arquivo de conversa é adicionado |
| 🐳 **Containerizado** | Docker multi-stage com Nginx — imagem de ~25MB pronta para deploy |

---

## 🏠 Self-Hosted — Guia de Configuração

O Zapeia foi feito para rodar localmente (self-hosted). Nenhuma conversa é incluída no repositório — você deve fornecer seus próprios arquivos de exportação.

### 1. Exporte a conversa do WhatsApp

No WhatsApp (mobile ou desktop):

1. Abra o grupo ou conversa desejada
2. Toque nos **três pontos** (⋮) → **Mais** → **Exportar conversa**
3. Escolha **Sem mídia** (o arquivo .txt)
4. O WhatsApp vai gerar um arquivo `.txt` com todo o histórico da conversa

> 💡 Se quiser exibir também as fotos, vídeos e áudios, escolha **Com mídia** na exportação — mas atenção: o arquivo .zip gerado pode ser grande. Você precisará extrair as mídias para a pasta correta (veja passo 3).

### 2. Coloque o arquivo no projeto

Copie o arquivo `.txt` exportado para a pasta `public/` do projeto:

```bash
# O arquivo DEVE se chamar chat.txt
cp /caminho/para/sua-conversa.txt public/chat.txt
```

### 3. (Opcional) Adicione as mídias

Se você exportou a conversa **com mídia**, extraia o `.zip` e copie todos os arquivos de mídia (imagens, vídeos, áudios, contatos) para `public/media/`:

```bash
# Extraia o zip e copie as mídias
unzip "_chat.txt.zip" -d /tmp/whatsapp-export
cp /tmp/whatsapp-export/media/* public/media/
```

O Zapeia reconhece automaticamente os seguintes tipos de mídia:

| Tipo | Extensões |
|---|---|
| 🖼️ Imagem | `.jpg`, `.jpeg`, `.png`, `.webp` |
| 🎬 Vídeo | `.mp4` |
| 🎵 Áudio | `.opus` |
| 👤 Contato | `.vcf` |

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Assim que o arquivo `public/chat.txt` for detectado, o Zapeia carregará automaticamente a conversa e exibirá as mensagens.

> 🔄 **Auto-detecção**: Se você ainda não copiou o `chat.txt`, o Zapeia exibirá uma tela de boas-vindas com instruções e ficará observando a pasta. Assim que o arquivo for adicionado, a conversa será carregada automaticamente — sem necessidade de recarregar a página.

### 5. Build de produção (para deploy)

Se quiser fazer deploy em um servidor estático:

```bash
npm run build
```

Copie o conteúdo da pasta `dist/` para seu servidor web. **Lembre-se de colocar o `chat.txt` e as mídias dentro do diretório servido**, nos mesmos caminhos esperados pelo app.

### 6. (Alternativa) Docker — self-hosted em 2 comandos

O Zapeia oferece suporte a Docker com build multi-stage. Tudo que você precisa é o Docker instalado.

```bash
# 1. Copie sua conversa para o diretório do projeto
cp /caminho/para/sua-conversa.txt ./chat.txt

# 2. (Opcional) Extraia e copie as mídias
unzip "_chat.txt.zip" -d /tmp/whatsapp-export
cp -r /tmp/whatsapp-export/media/* ./media/

# 3. Build + Start com Docker Compose
docker compose up -d

# 4. Acesse http://localhost:5174 🎉
```

> 🔄 **Auto-detecção**: O polling de 5s funciona normalmente com o bind mount. Basta substituir o `./chat.txt` no host que o Zapeia detecta automaticamente — sem rebuild, sem restart do container.

#### Build manual da imagem

```bash
docker build -t zapeia:latest .
docker run -d \
  --name zapeia \
  -p 5174:80 \
  -v ./chat.txt:/usr/share/nginx/html/chat.txt \
  -v ./media:/usr/share/nginx/html/media \
  zapeia:latest
```

#### Arquitetura do container

```
┌────────────────────────────────────────────┐
│          nginx:alpine (~25MB)              │
│                                            │
│  /usr/share/nginx/html/                    │
│  ├── index.html          (build do Vite)   │
│  ├── assets/             (JS + CSS com     │
│  │                        hash, cache 1y)  │
│  ├── chat.txt ← bind mount do usuário      │
│  └── media/   ← bind mount do usuário      │
└────────────────────────────────────────────┘
```

---

## 🤖 CI/CD — Publicação automática no Docker Hub

Sempre que houver um **push na branch `main`** ou a criação de uma **tag `v*`** (ex: `v0.2.0`), o GitHub Actions:

1. Faz checkout do repositório
2. Faz login no Docker Hub (via `DOCKER_USERNAME`/`DOCKER_PASSWORD`)
3. Extrai tags e labels automáticas (`latest`, `0.1.0`, `0.1`, etc.)
4. Builda e publica a imagem em **`filipelperes/zapeia`**

### Tags geradas automaticamente

| Evento | Tags |
|---|---|
| Push na `main` | `latest` |
| Tag `v0.2.0` | `0.2.0`, `0.2` |
| Tag `v1.0.0` | `1.0.0`, `1.0` |

> 💡 Também é possível disparar o workflow manualmente pelo GitHub UI na aba **Actions** → **Publish Docker image** → **Run workflow**.

### Configuração necessária (uma vez)

Adicione estes **segredos** no repositório em `Settings > Secrets and variables > Actions`:

| Nome | Valor |
|---|---|
| `DOCKER_USERNAME` | `filipelperes` |
| `DOCKER_PASSWORD` | Um [token de acesso](https://hub.docker.com/settings/security) do Docker Hub (não a senha da conta) |

---

## 🔧 A tela de boas-vindas (primeiro acesso)

Quando o Zapeia é aberto sem um `public/chat.txt` configurado, ele exibe uma tela intuitiva de boas-vindas que:

- Mostra o logo e o propósito do Zapeia
- Lista os 3 passos para configurar sua conversa
- Exibe um indicador animado que mostra que o app está monitorando a pasta
- Atualiza automaticamente assim que o arquivo `chat.txt` é detectado

Isso permite que você faça o deploy do Zapeia sem dados de exemplo e configure sua conversa depois, sem precisar de deploy ou rebuild.

---

## 🚀 Instalação

### Pré-requisitos

**Sem Docker:**
- Node.js >= 18
- npm, pnpm ou yarn

**Com Docker (alternativa):**
- [Docker](https://docs.docker.com/engine/install/) (qualquer versão recente)
- Docker Compose (já incluso no Docker Desktop)

```bash
git clone https://github.com/filipelperes/zapeia.git
cd zapeia
npm install
```

### Comandos úteis

| Comando | Descrição |
|---|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento com hot-reload |
| `npm run build` | Compila para produção em `dist/` |
| `npm run preview` | Serve a build de produção localmente |
| `npm test` | Executa testes em modo watch |
| `npm run test:run` | Executa testes uma vez |
| `npm run test:coverage` | Executa testes com cobertura |
| `npm run lint` | Verifica o código com ESLint |
| `docker compose up -d` | Build + start do container em background |
| `docker compose down` | Para e remove o container |
| `docker compose logs -f` | Acompanha os logs do container |
| `docker build -t zapeia .` | Build manual da imagem Docker |

---

## 📁 Estrutura do Projeto

```
src/
├── app/                      # Componente raiz da aplicação
│   └── index.tsx
├── features/                 # Módulos por domínio (Bulletproof React)
│   └── chat/                 # Feature principal: visualização do chat
│       ├── components/       #   Subcomponentes do chat
│       │   ├── ChatBubble/   #     Bolha de mensagem individual
│       │   ├── ChatHeader/   #     Cabeçalho com avatar, título e ações
│       │   ├── ChatLayout/   #     Layout principal do chat
│       │   ├── DateSeparator/#     Separador de data entre mensagens
│       │   ├── EmptyState/   #     Tela de boas-vindas (sem chat.txt)
│       │   ├── ErrorDisplay/ #     Tela de erro com retry
│       │   ├── ImageLightbox/#     Modal de imagem em tela cheia
│       │   ├── MediaContent/ #     Renderizador de mídia (img/video/audio/contact)
│       │   ├── MessageList/  #     Lista virtualizada de mensagens
│       │   ├── MessageTime/  #     Timestamp da mensagem
│       │   ├── SystemMessage/#     Mensagens de sistema (entrada/saída)
│       │   ├── ThemeToggle/  #     Botão de alternância de tema
│       │   └── UserMenu/     #     Menu de configuração do usuário
│       ├── hooks/            #   Hooks da feature
│       │   ├── useChatMessages.ts
│       │   ├── useSearch.ts
│       │   ├── useTheme.ts
│       │   └── useUserName.ts
│       ├── types/            #   Tipos específicos do domínio
│       └── __tests__/        #   Testes dos componentes e hooks
├── hooks/                    # Hooks globais reutilizáveis
├── types/                    # Tipos globais
├── utils/                    # Funções utilitárias puras
│   ├── chatCache.ts          #   Cache local (localStorage)
│   ├── formatDateString.ts   #   Formatação de datas
│   ├── formatWhatsAppText.tsx #  Renderização de formatação WhatsApp
│   ├── parsechat.ts          #   Parsing do arquivo de chat
│   └── renderMediaContent.tsx #  Renderização de mídia
├── index.css                 # Estilos globais e tema
├── main.tsx                  # Entry point
└── test-setup.ts             # Setup de testes

public/                       # Arquivos estáticos servidos pelo Vite
├── chat.txt                  # ⚠️ Sua conversa exportada (ignorada pelo git)
├── media/                    # ⚠️ Mídias da conversa (ignoradas pelo git)
│   └── .gitkeep
└── favicon.svg               # Ícone do Zapeia

## Docker                          # Containerização (opcional)
├── Dockerfile                 # Build multi-stage (Node → Nginx)
├── docker-compose.yml         # Orquestração com volumes + portas
├── nginx.conf                 # Configuração Nginx otimizada para SPA
└── .dockerignore              # Exclusões do contexto de build
```

### Arquitetura

O projeto segue o padrão **Atomic Design** combinado com **Bulletproof React**:

- **Atoms**: Componentes básicos e reutilizáveis
- **Molecules**: Combinações de átomos
- **Organisms**: Seções complexas da interface
- **Templates**: Layouts de página
- **Features**: Módulos autocontidos por domínio de negócio, cada um com seus próprios componentes, hooks, tipos e testes

---

## 🧪 Stack Tecnológica

| Tecnologia | Versão | Propósito |
|---|---|---|
| [React](https://react.dev/) | 19 | Biblioteca de interface |
| [TypeScript](https://www.typescriptlang.org/) | 6 | Tipagem estática |
| [Vite](https://vite.dev/) | 8 | Build tool e dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilização utilitária |
| [Vitest](https://vitest.dev/) | 4 | Testes unitários |
| [date-fns](https://date-fns.org/) | 4 | Manipulação de datas |
| [Testing Library](https://testing-library.com/) | — | Testes de componentes |
| [Docker](https://www.docker.com/) | — | Containerização multi-stage |
| [Nginx](https://nginx.org/) | Alpine | Servidor HTTP production-ready |

---

## 📄 Formato do Arquivo de Chat

O Zapeia lê arquivos de exportação do WhatsApp no formato padrão:

```
DD/MM/AA, HH:MM - Nome do Remetente: Mensagem aqui
DD/MM/AA, HH:MM - Nome do Remetente: <Media omitted>
DD/MM/AA, HH:MM - Nome criou o grupo "Nome do Grupo"
```

Suporta também linhas com múltiplos parágrafos e mensagens editadas (com o sufixo `<This message was edited>`).

---

## ☀️🌙 Temas

O Zapeia oferece dois temas visuais:

- **Claro** — Fundo bege com bolhas verdes (estilo WhatsApp clássico)
- **Escuro** — Fundo escuro com bolhas escuras (estilo WhatsApp Dark Mode)

O tema é persistido no `localStorage` e mantido entre sessões.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas alterações (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>
    Feito com ❤️ para transformar exportações do WhatsApp em uma experiência de navegação agradável.
  </p>
  <p>
    <strong>Zapeia</strong> — porque conversa boa merece ser revisitada.
  </p>
  <p>
    🙈 Conversas sensíveis não são versionadas. O repositório contém apenas o visualizador.
  </p>
</div>
