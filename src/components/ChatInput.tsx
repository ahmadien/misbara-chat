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
      className={`absolute bottom-0 border-t text-white backdrop-blur-sm border-red-600/10 ${
        language === 'ar' ? 'left-0 right-64' : 'right-0 left-64'
      }`}
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div className="w-full max-w-3xl px-4 py-3 mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            className="px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-red-600 hover:opacity-90"
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
              className="px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-red-600 hover:opacity-90"
              onClick={() => setShowTopics((s) => !s)}
            >
              {t.chooseTopic}
            </button>
            {showTopics && (
              <div className="absolute z-10 flex flex-col w-32 p-2 mt-1 space-y-1 bg-black rounded-lg shadow-lg">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      window.location.href = 'https://www.ajnee.com/'
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

              className="w-full py-3 pl-4 pr-12 overflow-hidden text-sm text-white placeholder-[#888888] border rounded-lg shadow-lg resize-none border-red-600/20 bg-[#1a1a1a] focus:border-red-600 focus:shadow-[0_0_6px_#e50914]"
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
              className="absolute p-2 bg-red-600 text-white rounded -translate-y-1/2 right-2 top-1/2 hover:opacity-90 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
