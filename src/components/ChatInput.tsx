import { Send } from 'lucide-react';
import { useState } from 'react';
import { useAppState } from '../store';
import { translations } from '../utils';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput = ({
  input,
  setInput,
  handleSubmit,
  isLoading
}: ChatInputProps) => {
  const [showTopics, setShowTopics] = useState(false)
  const { language } = useAppState()
  const t = translations[language]
  const topics = t.topics

  return (
    <div
      className={`absolute bottom-0 border-t bg-gray-900/80 backdrop-blur-sm border-orange-500/10 ${
        language === 'ar' ? 'left-0 right-64' : 'right-0 left-64'
      }`}
    >
      <div className="w-full max-w-3xl px-4 py-3 mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            className="px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 focus:outline-none"
            onClick={() => {
              setInput('')
              setShowTopics(false)
            }}
          >
            {t.describeProblem}
          </button>
          <div className="relative">
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 focus:outline-none"
              onClick={() => setShowTopics((s) => !s)}
            >
              {t.chooseTopic}
            </button>
            {showTopics && (
              <div className="absolute z-10 flex flex-col w-32 p-2 mt-1 space-y-1 bg-gray-800 rounded-lg shadow-lg">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setInput(t)
                      setShowTopics(false)
                    }}
                    className={`px-2 py-1 text-sm ${language === 'ar' ? 'text-right' : 'text-left'} text-white rounded hover:bg-gray-700`}

                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder={t.placeholder}

              className="w-full py-3 pl-4 pr-12 overflow-hidden text-sm text-white placeholder-gray-400 border rounded-lg shadow-lg resize-none border-orange-500/20 bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '200px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 200) + 'px'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute p-2 text-orange-500 transition-colors -translate-y-1/2 right-2 top-1/2 hover:text-orange-400 disabled:text-gray-500 focus:outline-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
