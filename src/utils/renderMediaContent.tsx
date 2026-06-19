import type { JSX } from 'react';
import { formatWhatsAppText } from './formatWhatsAppText';
import { ImageWithPreview } from '@/features/chat/components/ImageLightbox';
import type { TFunction } from 'i18next';

const FILE_ATTACHED = /\s*\(file attached\)\s*/gi;
const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp'] as const;
const VIDEO_EXTS = ['mp4'] as const;
const AUDIO_EXTS = ['opus'] as const;
const CONTACT_EXTS = ['vcf'] as const;
const ALL_KNOWN = [...IMAGE_EXTS, ...VIDEO_EXTS, ...AUDIO_EXTS, ...CONTACT_EXTS] as readonly string[];

/** Default translate function that returns the key itself or English fallback */
function defaultT(key: string): string {
   const fallbacks: Record<string, string> = {
      'media.downloadFile': 'Download file',
      'media.image': 'image',
      'media.videoNotSupported': 'Your browser does not support videos.',
      'media.audioNotSupported': 'Your browser does not support audio.',
      'media.contactAvailable': 'Contact available:',
      'media.downloadVcf': 'Download .vcf',
      'media.mediaNotAvailable': 'Media not exported or unavailable',
      'media.deletedMessage': 'Deleted message',
   };
   return fallbacks[key] ?? key;
}

type MediaRendererOptions = {
   baseUrl?: string;
   highlightQuery?: string;
   t?: TFunction;
};

// ─── helpers ───────────────────────────────────────────────────────────

function getMediaPath(filename: string, baseUrl = ''): string {
   return `${baseUrl}media/${filename}`;
}

function extension(content: string): string | null {
   const clean = content.replace(FILE_ATTACHED, '').trim();
   const dot = clean.lastIndexOf('.');
   if (dot <= 0 || dot >= clean.length - 1) return null;
   return clean.slice(dot + 1).toLowerCase();
}

function cleanName(content: string): string {
   return content.replace(FILE_ATTACHED, '').trim();
}

function isMediaOmitted(content: string): boolean {
   const c = content.replace(FILE_ATTACHED, '').trim();
   return c === '<Media omitted>' || c === '<media omitted>';
}

/** Returns true when a `type='message'` / `type='system'` string should be
 *  treated as media (i.e. it's a filename with a `(file attached)` suffix). */
function looksLikeAttachedMedia(content: string): boolean {
   const hasSuffix = FILE_ATTACHED.test(content);
   FILE_ATTACHED.lastIndex = 0; // reset global regex
   if (!hasSuffix) return false;
   const ext = extension(content);
   if (!ext) return false;
   return ALL_KNOWN.includes(ext);
}

// ─── sub-components ────────────────────────────────────────────────────

function DownloadLink({ href, t }: { href: string; t: TFunction }) {
   return (
      <a
         href={href}
         download
         className="text-blue-500 underline hover:text-blue-800 text-xs"
      >
         {t('media.downloadFile')}
      </a>
   );
}

function ImageMedia({ src, t }: { src: string; t: TFunction }) {
   return <ImageWithPreview src={src} alt={t('media.image')} />;
}

function VideoMedia({ src, t }: { src: string; t: TFunction }) {
   return (
      <video
         controls
         preload="metadata"
         className="max-w-full max-h-64 rounded-lg"
      >
         <source src={src} type="video/mp4" />
         {t('media.videoNotSupported')}
      </video>
   );
}

function AudioMedia({ src, t }: { src: string; t: TFunction }) {
   return (
      <audio controls preload="none" className="max-w-full h-10">
         <source src={src} type="audio/ogg" />
         {t('media.audioNotSupported')}
      </audio>
   );
}

/** Renders the "Contact available:" line + download link. */
function ContactMedia({ vcfPath, filename, t }: { vcfPath: string; filename: string; t: TFunction }) {
   return (
      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
         <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
         </div>
         <div>
            <p className="text-xs text-gray-500">{t('media.contactAvailable')}</p>
            <p className="text-sm font-medium text-gray-900">{filename}</p>
            <a
               href={vcfPath}
               download
               className="text-xs text-blue-500 underline hover:text-blue-800"
            >
               {t('media.downloadVcf')}
            </a>
         </div>
      </div>
   );
}

// ─── media routing (always returns JSX.Element) ───────────────────────

function renderMedia(type: string, content: string, baseUrl: string, t: TFunction): JSX.Element {
   const name = cleanName(content);
   const ext = extension(content);

   // 1. Media omitted
   if (isMediaOmitted(content)) {
      return (
         <span className="italic text-gray-400 text-xs">
            {t('media.mediaNotAvailable')}
         </span>
      );
   }

   // 2. Deleted
   if (type === 'deleted') {
      return (
         <span className="italic line-through text-gray-400 text-xs">
            {t('media.deletedMessage')}
         </span>
      );
   }

   // 3. image type → always image (regardless of extension)
   if (type === 'image') {
      const src = getMediaPath(name, baseUrl);
      return (
         <div className="flex flex-col gap-1">
            <ImageMedia src={src} t={t} />
            <DownloadLink href={src} t={t} />
         </div>
      );
   }

   // 4. video type → only mp4
   if (type === 'video') {
      if (ext && VIDEO_EXTS.includes(ext as typeof VIDEO_EXTS[number])) {
         const src = getMediaPath(name, baseUrl);
         return (
            <div className="flex flex-col gap-1">
               <VideoMedia src={src} t={t} />
               <DownloadLink href={src} t={t} />
            </div>
         );
      }
      const src = getMediaPath(name, baseUrl);
      return <DownloadLink href={src} t={t} />;
   }

   // 5. audio type → only opus
   if (type === 'audio') {
      if (ext && AUDIO_EXTS.includes(ext as typeof AUDIO_EXTS[number])) {
         const src = getMediaPath(name, baseUrl);
         return <AudioMedia src={src} t={t} />;
      }
      const src = getMediaPath(name, baseUrl);
      return <DownloadLink href={src} t={t} />;
   }

   // 6. contact type → always contact
   if (type === 'contact') {
      const vcfPath = getMediaPath(name, baseUrl);
      return <ContactMedia vcfPath={vcfPath} filename={name} t={t} />;
   }

   // 7. generic type → download link
   if (type === 'generic') {
      const src = getMediaPath(name, baseUrl);
      return <DownloadLink href={src} t={t} />;
   }

   // 8. media / message / system → detect from extension
   if (ext && IMAGE_EXTS.includes(ext as typeof IMAGE_EXTS[number])) {
      const src = getMediaPath(name, baseUrl);
      return (
         <div className="flex flex-col gap-1">
            <ImageMedia src={src} t={t} />
            <DownloadLink href={src} t={t} />
         </div>
      );
   }

   if (ext && VIDEO_EXTS.includes(ext as typeof VIDEO_EXTS[number])) {
      const src = getMediaPath(name, baseUrl);
      return (
         <div className="flex flex-col gap-1">
            <VideoMedia src={src} t={t} />
            <DownloadLink href={src} t={t} />
         </div>
      );
   }

   if (ext && AUDIO_EXTS.includes(ext as typeof AUDIO_EXTS[number])) {
      const src = getMediaPath(name, baseUrl);
      return <AudioMedia src={src} t={t} />;
   }

   if (ext && CONTACT_EXTS.includes(ext as typeof CONTACT_EXTS[number])) {
      const vcfPath = getMediaPath(name, baseUrl);
      return <ContactMedia vcfPath={vcfPath} filename={name} t={t} />;
   }

   // default fallback for media types → download link
   const src = getMediaPath(name, baseUrl);
   return <DownloadLink href={src} t={t} />;
}

// ─── public API ────────────────────────────────────────────────────────

/**
 * Renders WhatsApp media content.
 *
 * - For plain `message` / `system` types (without media content) it returns
 *   the raw array from `formatWhatsAppText` so that the legacy test contract
 *   (`Array.isArray(result) === true`) is kept.
 * - For every other case (deleted, media omitted, image, video, audio,
 *   contact, generic, or message with `(file attached)` suffix) it returns
 *   a `JSX.Element`.
 */
export function renderMediaContent(
   type: string,
   content: string,
   options?: MediaRendererOptions,
): JSX.Element | (string | JSX.Element)[] {
   const t = options?.t ?? (defaultT as TFunction);
   const baseUrl = options?.baseUrl ?? '';
   const highlightQuery = options?.highlightQuery;

   // ── Special cases that always produce JSX ──────────────────────────────

   if (type === 'deleted') {
      return (
         <span className="italic line-through text-gray-400 text-xs">
            {t('media.deletedMessage')}
         </span>
      );
   }

   if (isMediaOmitted(content)) {
      return (
         <span className="italic text-gray-400 text-xs">
            {t('media.mediaNotAvailable')}
         </span>
      );
   }

   if (type === 'media' || type === 'image' || type === 'video' || type === 'audio' || type === 'contact' || type === 'generic') {
      return renderMedia(type, content, baseUrl, t);
   }

   // ── message / system ───────────────────────────────────────────────────

   if (type === 'message' || type === 'system') {
      // If the line looks like an attached media file → render media
      if (looksLikeAttachedMedia(content)) {
         return renderMedia(type, content, baseUrl, t);
      }

      // Otherwise return the formatted text array (legacy contract:
      // `Array.isArray(result) === true` for plain message types)
      return formatWhatsAppText(content, highlightQuery);
   }

   // ── unknown / fallback ──────────────────────────────────────────────────
   return <>{content}</>;
}
