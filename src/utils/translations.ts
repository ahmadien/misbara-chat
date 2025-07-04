export const translations = {
  en: {
    newChat: 'New Chat',
    describeProblem: 'Define your problem',
    chooseTopic: 'Define your relationship with...',
    placeholder: "Write here...",
    instruction: 'Please describe any challenge you\'re facing in life. Mr. Harmony will help analyze it using the Harmony Model to find the best understanding and solution.',
    subscribe: 'Subscribe to continue your session and explore more challenges.',
    welcomeSubtitle: 'We accompany you on your journey of self-discovery toward a more balanced and impactful life.',
    topics: ['Life', 'Family', 'Work', 'Emotions']
  },
  ar: {
    newChat: 'دردشة جديدة',
    describeProblem: 'حدد مشكلتك',
    chooseTopic: 'حدد علاقتك بـ...',
    placeholder: 'اكتب هنا...',
    instruction: 'حدد أي مشكلة تواجهها في الحياة، وسيساعدك السيد هارموني في تحليلها باستخدام نموذج هارموني للوصول إلى أفضل فهم وحل ممكن.',
    subscribe: 'اشترك لمتابعة الجلسة وتحليل مشكلات أخرى.',
    welcomeSubtitle: 'نرافقك في رحلة الذات لحياة أكثر توازنًا وأثرًا.',
    topics: ['الحياة', 'العائلة', 'العمل', 'المشاعر']
  }
} as const

export type SupportedLang = keyof typeof translations
