import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import type { Message } from '../utils/ai'
import { AiIcon } from './icons/AiIcons'

export const ChatMessage = ({ message }: { message: Message }) => (
  <div className="py-6">
    <div
      className={`flex items-start w-full max-w-3xl gap-4 mx-auto rounded-lg p-4 ${
        message.role === 'assistant' ? 'bg-[#141414]' : 'bg-[#262626]'
      }`}
      style={
        message.role === 'assistant'
          ? {
              borderLeft: '4px solid',
              borderImage:
                'linear-gradient(to bottom, #ff00ff, #00ffff) 1',
            }
          : undefined
      }
      tabIndex={0}
    >
      {message.role === 'assistant' ? (
        <AiIcon className="flex-shrink-0 w-12 h-12 ml-4" />
      ) : (
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-sm font-medium text-white bg-black rounded-lg">
          Y
        </div>
      )}
      <div className="flex-1 min-w-0 mr-4">
        <ReactMarkdown
          className="prose dark:prose-invert max-w-none"
          rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  </div>
);
