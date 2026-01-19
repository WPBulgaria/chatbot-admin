export interface ChatThemeBranding {
  name: string;
  logo?: string;
  statusText: string;
  statusOnline: boolean;
}

export interface ChatThemeColors {
  primary: string;
  primaryHover: string;
  secondaryBg: string;
  textDark: string;
  textMuted: string;
  border: string;
  botMessageBg: string;
  botMessageText: string;
  userMessageBg: string;
  userMessageText: string;
  codeBg: string;
  codeText: string;
  codeBlockBg: string;
  codeBlockText: string;
}

export interface ChatThemeTypography {
  fontFamily: string;
  fontUrl?: string;
}

export interface ChatThemeLabels {
  headerTitle: string;
  headerStatus: string;
  historyButtonTitle: string;
  moreOptionsTitle: string;
  welcomeMessage: string;
  inputPlaceholder: string;
  sendButton: string;
  loadingMessage: string;
  errorMessage: string;
  historyTitle: string;
  historySubtitle: string;
  historyEmpty: string;
  historyEmptyHint: string;
  historyLoading: string;
  historyUntitled: string;
  dateToday: string;
  dateYesterday: string;
  dateDaysAgoTemplate: string; // Template string like "Преди {days} дни"
  readOnlyNotice: string;
  startNewChat: string;
  backButton: string;
}

export interface ChatThemeBackgrounds {
  page: string;
  header: string;
  inputArea: string;
  modal: string;
  modalBackdrop: string;
}

export interface ChatThemeShadows {
  botMessage: string;
  userMessage: string;
  button: string;
  modal: string;
}

export interface ChatThemeBorderRadius {
  message: string;
  input: string;
  button: string;
  avatar: string;
  modal: string;
}

export interface ChatTheme {
  branding: ChatThemeBranding;
  colors: ChatThemeColors;
  typography: ChatThemeTypography;
  labels: ChatThemeLabels;
  backgrounds: ChatThemeBackgrounds;
  shadows: ChatThemeShadows;
  borderRadius: ChatThemeBorderRadius;
}

export const defaultTheme: ChatTheme = {
  branding: {
    name: 'WP Помощник',
    logo: undefined,
    statusText: 'Онлайн',
    statusOnline: true,
  },

  colors: {
    primary: '#00BFA5',
    primaryHover: '#00a892',
    secondaryBg: '#EEF4FB',
    textDark: '#1a2744',
    textMuted: '#64748b',
    border: '#e2e8f0',
    botMessageBg: '#ffffff',
    botMessageText: '#1a2744',
    userMessageBg: '#00BFA5',
    userMessageText: '#ffffff',
    codeBg: '#EEF4FB',
    codeText: '#d946ef',
    codeBlockBg: '#1a2744',
    codeBlockText: '#e2e8f0',
  },

  typography: {
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  },

  labels: {
    headerTitle: 'WP Помощник',
    headerStatus: 'Онлайн',
    historyButtonTitle: 'История на разговорите',
    moreOptionsTitle: 'Още опции',
    welcomeMessage: 'Здравей, за какво имаш нужда от помощ за WordPress?',
    inputPlaceholder: 'Напиши съобщение...',
    sendButton: 'Изпрати',
    loadingMessage: 'Генериране на отговор...',
    errorMessage: 'Съжалявам, не мога да се свържа със сървъра. Моля, опитай отново по-късно.',
    historyTitle: 'История на разговорите',
    historySubtitle: 'Преглед на предишни чатове',
    historyEmpty: 'Няма предишни разговори',
    historyEmptyHint: 'Започнете нов чат, за да видите историята тук',
    historyLoading: 'Зареждане...',
    historyUntitled: 'Разговор без заглавие',
    dateToday: 'Днес',
    dateYesterday: 'Вчера',
    dateDaysAgoTemplate: 'Преди {days} дни',
    readOnlyNotice: 'Този разговор е само за четене',
    startNewChat: 'Започнете нов чат',
    backButton: 'Назад',
  },

  backgrounds: {
    page: 'linear-gradient(180deg, #EEF4FB 0%, #e2ecf7 50%, #EEF4FB 100%)',
    header: '#ffffff',
    inputArea: '#ffffff',
    modal: '#ffffff',
    modalBackdrop: 'rgba(0, 0, 0, 0.4)',
  },

  shadows: {
    botMessage: '0 2px 8px rgba(0, 0, 0, 0.06)',
    userMessage: '0 2px 8px rgba(0, 191, 165, 0.25)',
    button: '0 4px 12px rgba(0, 191, 165, 0.3)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  borderRadius: {
    message: '20px',
    input: '9999px',
    button: '9999px',
    avatar: '9999px',
    modal: '16px',
  },
};
