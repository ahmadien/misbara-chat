export const translations = {
  en: {
    newChat: 'New Chat',
    describeProblem: 'Describe your problem',
    chooseTopic: 'Choose topic',
    placeholder: "Type something clever (or don't, we won't judge)...",
    welcomeSubtitle: 'You can ask me about anything, I might or might not have a good answer, but you can still ask.',
    topics: ['Billing', 'Technical', 'General', 'Other']
  },
  ar: {
    newChat: 'دردشة جديدة',
    describeProblem: 'صف مشكلتك',
    chooseTopic: 'اختر موضوع',
    placeholder: 'اكتب شيئًا ما...',
    welcomeSubtitle: 'يمكنك أن تسألني عن أي شيء، قد أجيبك جيدًا أو لا، لكن يمكنك السؤال.',
    topics: ['الفواتير', 'تقني', 'عام', 'آخر']
  }
} as const

export type SupportedLang = keyof typeof translations
