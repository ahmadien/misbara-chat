import { Send } from 'lucide-react';
import { useAppState } from '../store';
import { translations } from '../utils';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
  sidebarCollapsed?: boolean;
}

export const ChatInput = ({
  input,
  setInput,
  handleSubmit,
  isLoading,
  disabled = false,
  sidebarCollapsed = false
}: ChatInputProps) => {
  const { language } = useAppState()
  const t = translations[language]

  const offsetClass = sidebarCollapsed 
    ? 'inset-x-0 md:ms-12' 
    : 'inset-x-0 md:ms-64'

  return (
    <div
      className={`absolute bottom-0 border-t text-white backdrop-blur-sm border-red-600/10 ${offsetClass}`}
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div className="w-full max-w-3xl px-4 py-3 mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder={t.placeholder}

              className="w-full py-3 pl-4 pr-12 overflow-hidden text-sm text-white placeholder-[#888888] border rounded-lg shadow-lg resize-none border-red-600/20 bg-[#1a1a1a] focus:border-red-600 focus:shadow-[0_0_6px_#e50914]"
              rows={3}
              style={{ minHeight: '60px', maxHeight: '200px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 200) + 'px'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || disabled}
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
