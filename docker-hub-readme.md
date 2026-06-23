<div align="center">
  <img src="https://raw.githubusercontent.com/filipelperes/zapeia/main/public/favicon.svg" alt="Zapeia" width="80" />
  <h1>Zapeia</h1>
  <p><strong>Elegant viewer for exported WhatsApp conversations</strong></p>
</div>

<br/>

## About

**Zapeia** is a modern web viewer for exported WhatsApp conversations. Simply export the chat from WhatsApp, mount the file as a volume, and Zapeia renders everything with a UI faithful to the WhatsApp Web style.

## How to Use

```bash
# 1. Export the chat in WhatsApp (⋮ > More > Export chat)
# 2. Place the file in the current directory as chat.txt
# 3. Run the container

docker run -d \
  --name zapeia \
  -p 5174:80 \
  -v ./chat.txt:/usr/share/nginx/html/chat.txt \
  -v ./media:/usr/share/nginx/html/media \
  filipelperes/zapeia

# Access: http://localhost:5174
```

> 🔄 **Auto-detection**: The app automatically detects when `chat.txt` is added or replaced — no restart, no rebuild.

## Supported Media

If your chat was exported **with media**, extract the `.zip` and mount the folder:

```bash
unzip "_chat.txt.zip" -d /tmp/whatsapp-export
docker run -d \
  --name zapeia \
  -p 5174:80 \
  -v ./chat.txt:/usr/share/nginx/html/chat.txt \
  -v /tmp/whatsapp-export/media:/usr/share/nginx/html/media \
  filipelperes/zapeia
```

| Type | Extensions |
|---|---|
| 🖼️ Image | `.jpg`, `.jpeg`, `.png`, `.webp` |
| 🎬 Video | `.mp4` |
| 🎵 Audio | `.opus` |
| 👤 Contact | `.vcf` |

## Docker Compose

```yaml
services:
  zapeia:
    image: filipelperes/zapeia:latest
    container_name: zapeia
    ports:
      - "5174:80"
    volumes:
      - ./chat.txt:/usr/share/nginx/html/chat.txt
      - ./media:/usr/share/nginx/html/media
    restart: unless-stopped
```

## Features

- 🗨️ Faithful rendering of WhatsApp conversations
- 🌐 Internationalization (English / Brazilian Portuguese)
- 📅 User-selectable date/time format locale (decoupled from UI language)
- 🎨 Light/Dark themes (all components adapt, including menus and inputs)
- 🔍 Instant text search
- 🖼️ Display images, videos, audio, and contacts
- 💬 WhatsApp-style message bubbles
- 👤 Your name identified in messages
- 📅 Date separators
- ⬆️ Scroll-to-top / scroll-to-bottom navigation buttons
- 📱 Custom scrollbar optimized for mobile (wider, easier to grab)
- ⚡ Local cache (localStorage)
- 🔄 Auto-detection of chat file

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · i18next · Nginx Alpine

## Repository

GitHub: [github.com/filipelperes/zapeia](https://github.com/filipelperes/zapeia)
