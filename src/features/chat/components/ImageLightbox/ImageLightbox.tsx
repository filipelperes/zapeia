import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageLightboxProps {
  src: string;
  alt?: string;
}

/** Inline image with WhatsApp-style lightbox on click */
const ImageWithPreview = memo(function ImageWithPreview({ src, alt }: ImageLightboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  const handleDownload = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = alt || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        // Fallback: open in new tab
        window.open(src, '_blank');
      }
    },
    [src, alt],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-0 border-0 bg-transparent cursor-pointer"
        aria-label={t('imageLightbox.viewImage')}
      >
        <img
          src={src}
          alt={alt ?? t('imageLightbox.image')}
          className="rounded-md max-w-xs max-h-64 object-cover hover:opacity-90 transition-opacity"
          loading="lazy"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 animate-in fade-in"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('imageLightbox.imagePreview')}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={src}
              alt={alt ?? t('imageLightbox.enlargedImage')}
              className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
            />
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-white/80 hover:text-white transition-colors"
               aria-label={t('imageLightbox.download')}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 text-white/80 hover:text-white transition-colors"
               aria-label={t('imageLightbox.close')}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default ImageWithPreview;
