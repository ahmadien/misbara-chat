import { AnimatedAiIcon } from './icons/AiIcons'

export const LoadingIndicator = () => (
  <div className="px-6 py-6 bg-gradient-to-r from-red-600/5 to-red-600/5">
    <div className="flex items-start w-full max-w-3xl gap-4 mx-auto">
      <AnimatedAiIcon className="w-8 h-8 flex-shrink-0" />
      <div className="flex items-center gap-3">
        <div className="text-lg font-medium text-gray-400">
          Thinking
        </div>
        <div className="flex gap-2">
          <div
            className="w-2 h-2 rounded-full bg-red-600 animate-[bounce_0.8s_infinite]"
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-red-600 animate-[bounce_0.8s_infinite]"
            style={{ animationDelay: '200ms' }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-red-600 animate-[bounce_0.8s_infinite]"
            style={{ animationDelay: '400ms' }}
          ></div>
        </div>
      </div>
    </div>
  </div>
); 