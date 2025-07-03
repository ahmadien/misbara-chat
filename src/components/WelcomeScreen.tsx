import { Send } from 'lucide-react';
import { useState } from 'react';
import { useAppState } from '../store';
import { translations } from '../utils';
import { BrandLogo } from './icons/BrandLogo';


interface WelcomeScreenProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const WelcomeScreen = ({
  input,
  setInput,
  handleSubmit,
  isLoading
}: WelcomeScreenProps) => {
  const [showTopics, setShowTopics] = useState(false)
  const { language } = useAppState()
  const t = translations[language]
  const topics = t.topics

  return (
    <div className="flex items-center justify-center flex-1 px-4">
      <div className="w-full max-w-3xl mx-auto text-center">
      <div className="flex justify-center mb-4">
        <BrandLogo className="w-20 h-auto" />
      </div>
      <p className="w-2/3 mx-auto mb-6 text-lg text-gray-400">
        {t.welcomeSubtitle}
      </p>
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          type="button"
          className="px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-red-600 to-red-600 hover:opacity-90 focus:outline-none"
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
            className="px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-red-600 to-red-600 hover:opacity-90 focus:outline-none"
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
                    setInput(t)
                    setShowTopics(false)
                  }}
                  className={`px-2 py-1 text-sm ${language === 'ar' ? 'text-right' : 'text-left'} text-white rounded hover:bg-black`}

                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative max-w-xl mx-auto">
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
            className="w-full py-3 pl-4 pr-12 overflow-hidden text-sm text-white placeholder-gray-400 border rounded-lg resize-none border-red-600/20 bg-black/50 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-transparent"
            rows={1}
            style={{ minHeight: '88px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute p-2 text-red-600 transition-colors -translate-y-1/2 right-2 top-1/2 hover:text-red-400 disabled:text-gray-500 focus:outline-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}
