export const translations = {
  en: {
    newChat: 'New Chat',
    describeProblem: 'Define your problem',
    chooseTopic: 'Define your relationship with...',
    placeholder: "Write here...",
    welcomeSubtitle: 'We accompany you on your journey of self-discovery toward a more balanced and impactful life.',
    topics: ['Life', 'Family', 'Work', 'Emotions']
  },
  ar: {
    newChat: 'دردشة جديدة',
    describeProblem: 'حدد مشكلتك',
    chooseTopic: 'حدد علاقتك بـ...',
    placeholder: 'اكتب هنا...',
    welcomeSubtitle: 'نرافقك في رحلة الذات لحياة أكثر توازنًا وأثرًا.',
    topics: ['الحياة', 'العائلة', 'العمل', 'المشاعر']
  }
} as const

export type SupportedLang = keyof typeof translations
