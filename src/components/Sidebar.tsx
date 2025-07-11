import {
  PlusCircle,
  MessageCircle,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelRightClose,
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppState } from '../store';
import { translations } from '../utils';

interface SidebarProps {
  conversations: Array<{ id: string; title: string }>;
  currentConversationId: string | null;
  handleNewChat: () => void;
  setCurrentConversationId: (id: string) => void;
  handleDeleteChat: (id: string) => void;
  editingChatId: string | null;
  setEditingChatId: (id: string | null) => void;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  handleUpdateChatTitle: (id: string, title: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isAiResponding?: boolean;
}

export const Sidebar = ({
  conversations,
  currentConversationId,
  handleNewChat,
  setCurrentConversationId,
  handleDeleteChat,
  editingChatId,
  setEditingChatId,
  editingTitle,
  setEditingTitle,
  handleUpdateChatTitle,
  onCollapseChange,
  isAiResponding = false
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Remember sidebar state in localStorage (only in browser)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed')
      return saved ? JSON.parse(saved) : false
    }
    return false // Default value for SSR
  })
  const { language } = useAppState()
  const t = translations[language]

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    // Save to localStorage only in browser
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsedState))
    }
    onCollapseChange?.(newCollapsedState)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        handleToggleCollapse()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        handleNewChat()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleToggleCollapse, handleNewChat])

  return (
    <div 
      className={`hidden md:flex flex-col text-white border-r shadow-lg md:static transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-64'
      }`} 
      style={{background:'#0d0d0d',borderColor:'#e50914'}}
      role="complementary"
      aria-label="Chat sidebar"
    >
      {isCollapsed ? (
        /* Collapsed State - Only Toggle Button */
        <div className="flex items-center justify-center p-2">
          <button
            onClick={handleToggleCollapse}
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 rounded-lg transition-all duration-200 group"
            title="Expand sidebar (Ctrl+B)"
          >
            {language === 'ar' ? (
              <PanelRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <PanelLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            )}
          </button>
        </div>
      ) : (
        /* Expanded State - Full Content */
        <>
          <div className="flex items-center justify-between p-4 border-b border-red-600">
            <button
              onClick={handleNewChat}
              disabled={isAiResponding}
              className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 group ${
                isAiResponding 
                  ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                  : 'bg-red-600 hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600'
              }`}
              title={isAiResponding ? 'Please wait for AI response to complete' : `${t.newChat} (Ctrl+N)`}
            >
              <PlusCircle className={`w-4 h-4 transition-transform duration-200 ${isAiResponding ? '' : 'group-hover:rotate-90'}`} />
              {t.newChat}
            </button>
            
            <button
              onClick={handleToggleCollapse}
              className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-white hover:bg-gray-700 hover:scale-110 rounded-lg transition-all duration-200 group"
              title="Collapse sidebar (Ctrl+B)"
            >
              {language === 'ar' ? (
                <PanelRightClose className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <PanelLeftClose className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto" role="list" aria-label="Conversation history">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-700 hover:translate-x-1 rounded-lg mx-2 transition-all duration-200 ${
                  chat.id === currentConversationId ? 'bg-gray-700 border-l-2 border-red-600' : ''
                }`}
                onClick={() => setCurrentConversationId(chat.id)}
                role="listitem"
                tabIndex={0}
                aria-label={`Chat: ${chat.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setCurrentConversationId(chat.id)
                  }
                }}
              >
                <MessageCircle className="w-4 h-4 text-gray-400" />
                
                {editingChatId === chat.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onBlur={() => {
                      if (editingTitle.trim()) {
                        handleUpdateChatTitle(chat.id, editingTitle)
                      }
                      setEditingChatId(null)
                      setEditingTitle('')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && editingTitle.trim()) {
                        handleUpdateChatTitle(chat.id, editingTitle)
                      } else if (e.key === 'Escape') {
                        setEditingChatId(null)
                        setEditingTitle('')
                      }
                    }}
                    className="flex-1 text-sm text-white bg-transparent focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1 text-sm text-gray-300 truncate">
                    {chat.title}
                  </span>
                )}
                
                <div className="items-center hidden gap-1 group-hover:flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingChatId(chat.id)
                      setEditingTitle(chat.title)
                    }}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChat(chat.id)
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}