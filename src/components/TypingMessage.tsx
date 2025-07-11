import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import { AiIcon } from './icons/AiIcons'
import type { Message } from '../utils/ai'

interface TypingMessageProps {
  message: Message
  onTypingComplete?: () => void
  onTypingProgress?: () => void
  typingSpeed?: number
}

export const TypingMessage = ({ 
  message, 
  onTypingComplete, 
  onTypingProgress,
  typingSpeed = 30 
}: TypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const hasTyped = useRef(false)

  useEffect(() => {
    if (!message.content || hasTyped.current) return

    hasTyped.current = true
    let currentIndex = 0
    const fullText = message.content
    let timeoutId: NodeJS.Timeout
    
    const typeText = () => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        currentIndex++
        // Trigger scroll during typing (every 5 characters for better performance)
        if (currentIndex % 5 === 0 || currentIndex === fullText.length) {
          onTypingProgress?.()
        }
        timeoutId = setTimeout(typeText, typingSpeed)
      } else {
        setIsTyping(false)
        onTypingComplete?.()
      }
    }

    typeText()
    
    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [message.content, typingSpeed, onTypingComplete, onTypingProgress, message.id])

  return (
    <div className="py-6 animate-fadeIn">
      <div
        className={`chat-message flex items-start w-full max-w-3xl gap-4 mx-auto rounded-lg p-4 ${
          message.role === 'assistant' ? 'bg-[#141414]' : 'bg-[#262626]'
        }`}
        style={
          message.role === 'assistant'
            ? {
                borderLeft: '4px solid',
                borderImage:
                  'linear-gradient(to bottom, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0088ff, #8800ff) 1',
              }
            : undefined
        }
        tabIndex={0}
              >
          {message.role === 'assistant' && (
            <AiIcon className="flex-shrink-0 w-12 h-12 ml-4" />
          )}
          
          <div className="flex-1 min-w-0 mr-4">
          <div className="overflow-hidden">
            <ReactMarkdown
              className="prose dark:prose-invert max-w-none"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
              components={{
                table: ({ children, ...props }) => (
                  <div className="table-wrapper overflow-x-auto md:overflow-x-visible">
                    <table {...props}>{children}</table>
                  </div>
                ),
              }}
            >
              {displayedText}
            </ReactMarkdown>
            {isTyping && (
              <span className="inline-block w-2 h-5 ml-1 bg-red-600 animate-pulse"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 