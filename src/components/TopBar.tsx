import { Globe, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAppState } from '../store'

export function TopBar() {
  const { language, setLanguage, conversations, currentConversationId } = useAppState()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Check if user is in an active conversation
  const hasActiveConversation = currentConversationId && conversations.length > 0
  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const hasMessages = currentConversation && currentConversation.messages.length > 0

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageSelect = (lang: 'en' | 'ar') => {
    // Only allow language change if no active conversation with messages
    if (!hasMessages) {
      setLanguage(lang)
      setIsOpen(false)
    } else {
      // Show a brief indication that language can't be changed
      setIsOpen(false)
      // You could add a toast notification here if desired
    }
  }

  return (
    <div
      className={`fixed top-0 z-20 flex items-center gap-2 md:gap-4 p-1 md:p-4 ${
        language === 'ar' ? 'left-0' : 'right-0'
      }`}
    >
      {/* Collapsible Language Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1 md:gap-2 px-1.5 md:px-3 py-1 md:py-2 backdrop-blur-sm text-white rounded-md md:rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs md:text-sm ${
            hasMessages 
              ? 'bg-gray-600/70 border-gray-600 cursor-not-allowed opacity-60' 
              : 'bg-gray-800/90 border-gray-700 hover:bg-gray-700 cursor-pointer'
          }`}
          disabled={hasMessages}
        >
          <Globe className="w-3 h-3 md:w-4 md:h-4" />
          <span className="font-medium">{language.toUpperCase()}</span>
          <ChevronDown 
            className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && !hasMessages && (
          <div className={`absolute top-full mt-1 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg overflow-hidden min-w-[100px] md:min-w-[120px] z-30 ${
            language === 'ar' ? 'left-0' : 'right-0'
          }`}>
            <button
              onClick={() => handleLanguageSelect('en')}
              className={`w-full px-2 md:px-4 py-2 md:py-2.5 text-left text-xs md:text-sm hover:bg-gray-700 transition-colors duration-150 flex items-center gap-1 md:gap-2 ${
                language === 'en' ? 'bg-red-600 text-white' : 'text-gray-300'
              }`}
            >
              <Globe className="w-3 h-3 md:w-3.5 md:h-3.5" />
              English
            </button>
            <button
              onClick={() => handleLanguageSelect('ar')}
              className={`w-full px-2 md:px-4 py-2 md:py-2.5 text-left text-xs md:text-sm hover:bg-gray-700 transition-colors duration-150 flex items-center gap-1 md:gap-2 ${
                language === 'ar' ? 'bg-red-600 text-white' : 'text-gray-300'
              }`}
            >
              <Globe className="w-3 h-3 md:w-3.5 md:h-3.5" />
              العربية
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
