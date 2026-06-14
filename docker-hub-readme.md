<div align="center">
  <img src="https://raw.githubusercontent.com/filipelperes/zapeia/main/public/favicon.svg" alt="Zapeia" width="80" />
  <h1>Zapeia</h1>
  <p><strong>Visualizador elegante de conversas exportadas do WhatsApp</strong></p>
</div>

<br/>

## Sobre

O **Zapeia** é um visualizador web moderno para conversas exportadas do WhatsApp. Basta exportar a conversa pelo próprio WhatsApp, montar o arquivo como volume, e o Zapeia renderiza tudo com uma interface fiel ao estilo do WhatsApp Web.

## Como Usar

```bash
# 1. Exporte a conversa no WhatsApp (⋮ > Mais > Exportar conversa)
# 2. Coloque o arquivo no diretório atual como chat.txt
# 3. Rode o container

docker run -d \
  --name zapeia \
  -p 5174:80 \
  -v ./chat.txt:/usr/share/nginx/html/chat.txt \
  -v ./media:/usr/share/nginx/html/media \
  filipelperes/zapeia

# Acesse: http://localhost:5174
```

> 🔄 **Auto-detecção**: O app detecta automaticamente quando o `chat.txt` é adicionado ou substituído — sem restart, sem rebuild.

## Mídias Suportadas

Se sua conversa foi exportada **com mídia**, extraia o `.zip` e monte a pasta:

```bash
unzip "_chat.txt.zip" -d /tmp/whatsapp-export
docker run -d \
  --name zapeia \
  -p 5174:80 \
  -v ./chat.txt:/usr/share/nginx/html/chat.txt \
  -v /tmp/whatsapp-export/media:/usr/share/nginx/html/media \
  filipelperes/zapeia
```

| Tipo | Extensões |
|---|---|
| 🖼️ Imagem | `.jpg`, `.jpeg`, `.png`, `.webp` |
| 🎬 Vídeo | `.mp4` |
| 🎵 Áudio | `.opus` |
| 👤 Contato | `.vcf` |

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

## Funcionalidades

- 🗨️ Renderização fiel de conversas do WhatsApp
- 🎨 Temas Claro/Escuro
- 🔍 Busca instantânea por texto
- 🖼️ Exibição de imagens, vídeos, áudios e contatos
- 💬 Bolhas de mensagem estilo WhatsApp
- 👤 Identificação do seu nome nas mensagens
- 📅 Separadores de data
- ⚡ Cache local (localStorage)
- 🔄 Auto-detecção do arquivo de conversa

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · Nginx Alpine

## Repositório

GitHub: [github.com/filipelperes/zapeia](https://github.com/filipelperes/zapeia)
