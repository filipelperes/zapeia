interface SystemMessageProps {
  content: string;
}

function PinIcon() {
  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
    </svg>
  );
}

/** Detects if a system message is a pinned message notification */
function isPinnedMessage(content: string): boolean {
  return /pinned/i.test(content);
}

/** Renders a WhatsApp system/info message (centered, small, gray) */
export function SystemMessage({ content }: SystemMessageProps) {
  const pinned = isPinnedMessage(content);

  return (
    <div className="flex justify-center my-1">
      <span className={`chat-system px-4 py-1.5 text-xs text-gray-500 bg-white/70 rounded-lg shadow-sm text-center max-w-[85%] ${pinned ? 'not-italic flex items-center gap-1.5 font-medium' : 'italic'}`}>
        {pinned && <PinIcon />}
        {content}
      </span>
    </div>
  );
}
