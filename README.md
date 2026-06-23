<div align="center">
  <a href="https://github.com/filipelperes/zapeia">
    <img src="public/favicon.svg" alt="Zapeia logo" width="80" />
  </a>
  <h1>Zapeia</h1>
  <p><strong>A Viewer for Exported WhatsApp Conversations</strong></p>
  <p>
    <em>"Zap" + "passeia" — Browse through your WhatsApp chats.</em>
  </p>
  <p>
    <a href="https://hub.docker.com/r/filipelperes/zapeia">
      <img src="https://img.shields.io/docker/v/filipelperes/zapeia?label=Docker%20Hub&logo=docker" alt="Docker Hub" />
    </a>
    <a href="https://github.com/filipelperes/zapeia/actions/workflows/docker-publish.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/filipelperes/zapeia/docker-publish.yml?branch=main&label=CI%2FCD&logo=githubactions" alt="CI/CD" />
    </a>
    <a href="https://hub.docker.com/r/filipelperes/zapeia">
      <img src="https://img.shields.io/docker/pulls/filipelperes/zapeia?logo=docker&label=Docker%20Pulls" alt="Docker Pulls" />
    </a>
  </p>
  <p>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://vite.dev/">
      <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
    </a>
  </p>
  <p>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    </a>
    <a href="https://vitest.dev/">
      <img src="https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
    </a>
  </p>
  <p>
    <a href="https://github.com/filipelperes/zapeia/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/filipelperes/zapeia" alt="License" />
    </a>
    <a href="https://github.com/filipelperes/zapeia">
      <img src="https://img.shields.io/github/stars/filipelperes/zapeia?style=social" alt="Stars" />
    </a>
  </p>
  <br/>
</div>

---

## 🧭 About

**Zapeia** is a modern, elegant web viewer for exported WhatsApp conversations. Simply export the conversation from WhatsApp, copy the file into the project, and Zapeia renders everything with an interface true to the WhatsApp Web style — text formatting, images, videos, audio, contacts, and more.

The name is a pun on **Zap** (a nickname for WhatsApp) and **passeia** (Portuguese for "browse" or "stroll") — a tool for browsing through your chats.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗨️ **Conversation viewer** | Renders WhatsApp `.txt` export files with full formatting |
| 🎨 **Light/Dark themes** | Switch between light and dark modes — all components adapt, including menus and inputs |
| 🔍 **Message search** | Instantly search for any text in the conversation |
| 🖼️ **Embedded media** | Displays images, videos, audio, and contacts directly in the chat |
| 🖱️ **Image lightbox** | Click images to view them full-screen |
| 💬 **Message bubbles** | WhatsApp-style own and others' message bubbles |
| 👤 **User identification** | Set your name to highlight your own messages |
| 📅 **Date separators** | Visual organization by day |
| ✏️ **Formatted text** | Supports WhatsApp bold, italic, strikethrough, and monospace |
| 📱 **Responsive + mobile scrollbar** | Adaptive layout; wider scrollbar with taller thumb for easy touch scrolling |
| ⬆️ **Scroll navigation** | Floating buttons to jump to top or bottom of the conversation |
| ⚡ **Local cache** | Instant loading on repeat visits |
| 🔄 **Auto-detection** | Automatically detects when the conversation file is added |
| 🌐 **Internationalization** | UI in English or Portuguese — date/time format locale independently selectable by each user |
| 🐳 **Containerized** | Multi-stage Docker with Nginx — ~25MB image ready for deployment |

---

## 🏠 Self-Hosted — Setup Guide

Zapeia is designed to run locally (self-hosted). No conversations are included in the repository — you must provide your own export files.

### 1. Export the conversation from WhatsApp

On WhatsApp (mobile or desktop):

1. Open the desired group or conversation
2. Tap the **three dots** (⋮) → **More** → **Export chat**
3. Choose **Without media** (the .txt file)
4. WhatsApp will generate a `.txt` file with the full conversation history

> 💡 If you also want to display photos, videos, and audio, choose **With media** when exporting — but be aware the generated .zip file may be large. You'll need to extract the media files to the correct folder (see step 3).

### 2. Place the file in the project

Copy the exported `.txt` file to the project's `public/` folder:

```bash
# The file MUST be named chat.txt
cp /path/to/your-conversation.txt public/chat.txt
```

### 3. (Optional) Add the media files

If you exported the conversation **with media**, extract the `.zip` and copy all media files (images, videos, audio, contacts) to `public/media/`:

```bash
# Extract the zip and copy the media files
unzip "_chat.txt.zip" -d /tmp/whatsapp-export
cp /tmp/whatsapp-export/media/* public/media/
```

Zapeia automatically recognizes the following media types:

| Type | Extensions |
|---|---|
| 🖼️ Image | `.jpg`, `.jpeg`, `.png`, `.webp` |
| 🎬 Video | `.mp4` |
| 🎵 Audio | `.opus` |
| 👤 Contact | `.vcf` |

### 4. Start the development server

```bash
npm run dev
```

As soon as the `public/chat.txt` file is detected, Zapeia will automatically load the conversation and display the messages.

> 🔄 **Auto-detection**: If you haven't copied `chat.txt` yet, Zapeia will display a welcome screen with instructions and keep watching the folder. Once the file is added, the conversation will load automatically — no page reload needed.

### 5. Production build (for deployment)

If you want to deploy to a static server:

```bash
npm run build
```

Copy the contents of the `dist/` folder to your web server. **Make sure to place `chat.txt` and the media files inside the served directory**, at the same paths the app expects.

### 6. (Alternative) Docker — self-hosted in 2 commands

Zapeia offers Docker support with a multi-stage build. All you need is Docker installed.

```bash
# 1. Copy your conversation to the project directory
cp /path/to/your-conversation.txt ./chat.txt

# 2. (Optional) Extract and copy media files
unzip "_chat.txt.zip" -d /tmp/whatsapp-export
cp -r /tmp/whatsapp-export/media/* ./media/

# 3. Build + Start with Docker Compose
docker compose up -d

# 4. Access http://localhost:5174 🎉
```

> 🔄 **Auto-detection**: The 5-second polling works normally with the bind mount. Just replace `./chat.txt` on the host and Zapeia detects it automatically — no rebuild, no container restart needed.

#### Manual image build

```bash
docker build -t zapeia:latest .
docker run -d \
  --name zapeia \
  -p 5174:80 \
  -v ./chat.txt:/usr/share/nginx/html/chat.txt \
  -v ./media:/usr/share/nginx/html/media \
  zapeia:latest
```

#### Container architecture

```
┌────────────────────────────────────────────┐
│          nginx:alpine (~25MB)              │
│                                            │
│  /usr/share/nginx/html/                    │
│  ├── index.html          (Vite build)      │
│  ├── assets/             (JS + CSS with    │
│  │                        hash, 1y cache)  │
│  ├── chat.txt ← user bind mount            │
│  └── media/   ← user bind mount            │
└────────────────────────────────────────────┘
```

---

## 🤖 CI/CD — Automatic publishing to Docker Hub

Whenever there's a **push to the `main` branch** or the creation of a **`v*` tag** (e.g. `v0.2.0`), GitHub Actions:

1. Checks out the repository
2. Logs in to Docker Hub (via `DOCKER_USERNAME`/`DOCKER_PASSWORD`)
3. Extracts automatic tags and labels (`latest`, `0.1.0`, `0.1`, etc.)
4. Builds and publishes the image to **`filipelperes/zapeia`**

### Automatically generated tags

| Event | Tags |
|---|---|
| Push to `main` | `latest` |
| Tag `v0.2.0` | `0.2.0`, `0.2` |
| Tag `v1.0.0` | `1.0.0`, `1.0` |

> 💡 You can also trigger the workflow manually from the GitHub UI under the **Actions** tab → **Publish Docker image** → **Run workflow**.

### Required setup (one-time)

Add these **secrets** to the repository under `Settings > Secrets and variables > Actions`:

| Name | Value |
|---|---|
| `DOCKER_USERNAME` | `filipelperes` |
| `DOCKER_PASSWORD` | An [access token](https://hub.docker.com/settings/security) from Docker Hub (not your account password) |

---

## 🔧 The welcome screen (first access)

When Zapeia is opened without a `public/chat.txt` configured, it displays an intuitive welcome screen that:

- Shows the Zapeia logo and purpose
- Lists the 3 steps to set up your conversation
- Displays an animated indicator showing the app is monitoring the folder
- Updates automatically as soon as the `chat.txt` file is detected

This allows you to deploy Zapeia without any sample data and configure your conversation later, with no need for redeployment or rebuilding.

---

## 🚀 Installation

### Prerequisites

**Without Docker:**
- Node.js >= 18
- npm, pnpm, or yarn

**With Docker (alternative):**
- [Docker](https://docs.docker.com/engine/install/) (any recent version)
- Docker Compose (already included in Docker Desktop)

```bash
git clone https://github.com/filipelperes/zapeia.git
cd zapeia
npm install
```

### Useful commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server with hot-reload (browser no longer auto-opens) |
| `npm run build` | Compiles for production into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm test` | Runs tests in watch mode |
| `npm run test:run` | Runs tests once |
| `npm run test:coverage` | Runs tests with coverage |
| `npm run lint` | Lints the code with ESLint |
| `docker compose up -d` | Build + start the container in background |
| `docker compose down` | Stops and removes the container |
| `docker compose logs -f` | Follows the container logs |
| `docker build -t zapeia .` | Manual Docker image build |

---

## 📁 Project Structure

```
src/
├── app/                      # Application root component
│   └── index.tsx
├── features/                 # Domain modules (Bulletproof React)
│   └── chat/                 # Main feature: chat viewer
│       ├── components/       #   Chat subcomponents
│       │   ├── ChatBubble/   #     Individual message bubble
│       │   ├── ChatHeader/   #     Header with avatar, title, and actions
│       │   ├── ChatLayout/   #     Main chat layout
│       │   ├── DateSeparator/#     Date separator between messages
│       │   ├── EmptyState/   #     Welcome screen (no chat.txt)
│       │   ├── ErrorDisplay/ #     Error screen with retry
│       │   ├── ImageLightbox/#     Full-screen image modal
│       │   ├── MediaContent/ #     Media renderer (img/video/audio/contact)
│       │   ├── MessageList/  #     Scrollable message list with scroll-to-top/bottom buttons
│       │   ├── MessageTime/  #     Message timestamp
│       │   ├── SystemMessage/#     System messages (join/leave)
│       │   ├── ThemeToggle/  #     Theme toggle button
│       │   └── UserMenu/     #     User configuration menu (name, locale, theme)
│       ├── hooks/            #   Feature hooks
│       │   ├── useChatMessages.ts
│       │   ├── useLocale.ts  #     Date/time format locale with localStorage persistence
│       │   ├── useSearch.ts
│       │   ├── useTheme.ts
│       │   └── useUserName.ts
│       ├── types/            #   Domain-specific types
│       └── __tests__/        #   Component and hook tests
├── hooks/                    # Reusable global hooks
├── lib/                      # Library configurations
│   └── i18n.ts               #   i18next setup with en/pt-BR resources
├── locales/                  # Translation JSON files (auto-generated by i18next-cli)
│   ├── en/
│   │   └── translation.json
│   └── pt-BR/
│       └── translation.json
├── types/                    # Global types
├── utils/                    # Pure utility functions
│   ├── chatCache.ts          #   Local cache (localStorage)
│   ├── formatDateString.ts   #   Date formatting with locale support
│   ├── formatWhatsAppText.tsx #  WhatsApp text formatting renderer
│   ├── parsechat.ts          #   Chat file parser
│   └── renderMediaContent.tsx #  Media content renderer
├── index.css                 # Global styles and theme
├── main.tsx                  # Entry point
└── test-setup.ts             # Test setup

public/                       # Static files served by Vite
├── chat.txt                  # ⚠️ Your exported conversation (git-ignored)
├── media/                    # ⚠️ Conversation media files (git-ignored)
│   └── .gitkeep
└── favicon.svg               # Zapeia icon

## Docker                          # Containerization (optional)
├── Dockerfile                 # Multi-stage build (Node → Nginx)
├── docker-compose.yml         # Orchestration with volumes + ports
├── nginx.conf                 # Nginx config optimized for SPA
└── .dockerignore              # Build context exclusions
```

### Architecture

The project follows **Atomic Design** combined with **Bulletproof React**:

- **Atoms**: Basic, reusable components
- **Molecules**: Combinations of atoms
- **Organisms**: Complex interface sections
- **Templates**: Page layouts
- **Features**: Self-contained modules per business domain, each with their own components, hooks, types, and tests

---

## 🧪 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 6 | Static typing |
| [Vite](https://vite.dev/) | 8 | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |
| [Vitest](https://vitest.dev/) | 4 | Unit testing |
| [i18next](https://www.i18next.com/) | 24 | Internationalization framework |
| [react-i18next](https://react.i18next.com/) | 15 | React bindings for i18next |
| [date-fns](https://date-fns.org/) | 4 | Date manipulation |
| [Testing Library](https://testing-library.com/) | — | Component testing |
| [Docker](https://www.docker.com/) | — | Multi-stage containerization |
| [Nginx](https://nginx.org/) | Alpine | Production-ready HTTP server |

---

## 📄 Chat File Format

Zapeia reads WhatsApp export files in the standard format:

```
DD/MM/AA, HH:MM - Sender Name: Message here
DD/MM/AA, HH:MM - Sender Name: <Media omitted>
DD/MM/AA, HH:MM - Name created the group "Group Name"
```

It also supports multi-paragraph messages and edited messages (with the `<This message was edited>` suffix).

---

## 🌐 Internationalization

Zapeia supports **American English** (default) and **Brazilian Portuguese** for the entire user interface.

Translation keys are auto-extracted via `i18next-cli` during the build pipeline, keeping the translation files in sync with the codebase.

### Date/Time Format — Independent Locale Selector

The date and time format locale is **decoupled** from the UI language. Each user can independently choose how dates and times are displayed:

- **MM/DD** or **DD/MM** format
- **12-hour** or **24-hour** clock
- Language-appropriate month/day names

To configure, open the User Menu (top-right corner) → **Date Format** → pick a locale from the grid or type a custom one (e.g. `de-DE`, `ja-JP`). The locale editor includes a back button and Cancel/Apply buttons for easy navigation. The preference is persisted in `localStorage`.

> 💡 The locale only affects date/time display formatting — the UI language remains whatever was selected for the interface.

---

## ☀️🌙 Themes

Zapeia offers two visual themes:

- **Light** — Beige background with green bubbles (classic WhatsApp style)
- **Dark** — Dark background with dark bubbles (WhatsApp Dark Mode style)

All UI components adapt to the active theme, including the User Menu dropdown, input fields, and locale/custom-locale editor. The preference is persisted in `localStorage` and maintained across sessions.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>
    Made with ❤️ to turn WhatsApp exports into a pleasant browsing experience.
  </p>
  <p>
    <strong>Zapeia</strong> — because good conversations deserve to be revisited.
  </p>
  <p>
    🙈 Sensitive conversations are not versioned. This repository contains only the viewer.
  </p>
</div>
