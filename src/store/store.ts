import { Store } from '@tanstack/store'
import type { Message } from '../utils/ai'

export interface Conversation {
  id: string
  title: string
  messages: Message[]
}

export interface State {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  language: 'ar' | 'en'
}

const initialState: State = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  language: 'ar'
}

export const store = new Store<State>(initialState)

export const actions = {
  // Chat actions
  setConversations: (conversations: Conversation[]) => {
    store.setState(state => ({ ...state, conversations }))
  },

  setCurrentConversationId: (id: string | null) => {
    store.setState(state => ({ ...state, currentConversationId: id }))
  },

  addConversation: (conversation: Conversation) => {
    store.setState(state => ({
      ...state,
      conversations: [...state.conversations, conversation],
      currentConversationId: conversation.id
    }))
  },

  updateConversationId: (oldId: string, newId: string) => {
    store.setState(state => ({
      ...state,
      conversations: state.conversations.map(conv =>
        conv.id === oldId ? { ...conv, id: newId } : conv
      ),
      currentConversationId: state.currentConversationId === oldId ? newId : state.currentConversationId
    }))
  },

  updateConversationTitle: (id: string, title: string) => {
    store.setState(state => ({
      ...state,
      conversations: state.conversations.map(conv =>
        conv.id === id ? { ...conv, title } : conv
      )
    }))
  },

  deleteConversation: (id: string) => {
    store.setState(state => ({
      ...state,
      conversations: state.conversations.filter(conv => conv.id !== id),
      currentConversationId: state.currentConversationId === id ? null : state.currentConversationId
    }))
  },

  addMessage: (conversationId: string, message: Message) => {
    store.setState(state => ({
      ...state,
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    }))
  },

  setLoading: (isLoading: boolean) => {
    store.setState(state => ({ ...state, isLoading }))
  },

  setLanguage: (lang: 'en' | 'ar') => {
    store.setState(state => ({ ...state, language: lang }))
  }
}

// Selectors
export const selectors = {
  getCurrentConversation: (state: State) =>
    state.conversations.find(c => c.id === state.currentConversationId),
  getConversations: (state: State) => state.conversations,
  getCurrentConversationId: (state: State) => state.currentConversationId,
  getIsLoading: (state: State) => state.isLoading,
  getLanguage: (state: State) => state.language
}