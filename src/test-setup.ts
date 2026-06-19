import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock scrollIntoView for jsdom (not implemented by default)
Element.prototype.scrollIntoView = () => {};

// Initialize i18next for testing with English resources
void i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        app: {
          loadingConversations: 'Loading conversations...',
          conversationWith: 'Conversation with {{name}}',
          conversationWithTwo: '{{name1}} and {{name2}}',
          whatsappHistory: 'WhatsApp History',
        },
        chat: {
          typeMessage: 'Type a message',
          attach: 'Attach',
          send: 'Send',
          noMessagesFound: 'No messages found.',
          search: 'Search',
          searchPlaceholder: 'Search...',
          closeSearch: 'Close search',
          deletedMessage: 'Deleted message',
          edited: 'Edited',
          emoji: 'Emoji',
          couldNotLoadMessages: 'Could not load messages',
          tryAgain: 'Try again',
          noResultsFound: 'No results found',
        },
        emptyState: {
          title: 'WhatsApp exported conversation viewer',
          subtitle: 'To get started, configure your conversation',
          step1Title: 'Export the WhatsApp conversation',
          step1Description:
            'In the group/conversation, click <1>More → Export chat</1> and choose <2>without media</2>.',
          step2Title: 'Copy the file to the project',
          step2Description: 'Save the file as <1>public/chat.txt</1> in the project root.',
          step3Title: '(Optional) Add media',
          step3Description: 'Copy photos, videos, and audio to <1>public/media/</1>.',
          watchingFile:
            'Watching <1>public/chat.txt</1> — the screen will update automatically as soon as the file is detected.',
          privacyNotice:
            '<1>Zapeia</1> is a local viewer. No data is sent to external servers. Everything runs exclusively in your browser.',
        },
        imageLightbox: {
          viewImage: 'View image',
          image: 'image',
          imagePreview: 'Image preview',
          enlargedImage: 'enlarged image',
          download: 'Download',
          close: 'Close',
        },
        userMenu: {
          apply: 'Apply',
          yourNameInMessages: 'Your name in messages',
          namePlaceholder: 'E.g.: John Doe',
          cancel: 'Cancel',
          save: 'Save',
          settings: 'Settings',
          yourName: 'Your name',
          setMyName: 'Set my name...',
          clearName: 'Clear name',
          menu: 'Menu',
          dateFormat: 'Date format',
          customLocale: 'Or type a custom locale:',
          localePlaceholder: 'e.g.: de-DE',
        },
        theme: {
          enableDarkMode: 'Enable dark mode',
          enableLightMode: 'Enable light mode',
          darkMode: 'Dark mode',
          lightMode: 'Light mode',
        },
        media: {
          downloadFile: 'Download file',
          image: 'image',
          videoNotSupported: 'Your browser does not support videos.',
          audioNotSupported: 'Your browser does not support audio.',
          contactAvailable: 'Contact available:',
          downloadVcf: 'Download .vcf',
          mediaNotAvailable: 'Media not exported or unavailable',
          deletedMessage: 'Deleted message',
        },
        error: {
          failedToLoadFile: 'Failed to load file: {{statusText}}',
          unknownError: 'Unknown error',
          errorLoadingChat: 'Error loading chat',
        },
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});
