import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import {
  ChatMessage,
  TypingMessage,
  LoadingIndicator,
  ChatInput,
  Sidebar,
  WelcomeScreen,
  TopBar

} from '../components'
import { PlusCircle } from 'lucide-react'
import { useConversations, useAppState, actions } from '../store'
import { genAIResponse, type Message, HARMONY_PROMPT_AR, HARMONY_PROMPT_EN, PROMPT1_AR, PROMPT1_EN, translations } from '../utils'

function Home() {
  const {
    conversations,
    currentConversationId,
    currentConversation,
    setCurrentConversationId,
    createNewConversation,
    updateConversationTitle,
    deleteConversation,
    addMessage,
  } = useConversations()
  
  const { isLoading, setLoading, language } = useAppState()

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = language
    }
  }, [language])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    }
  }, [])

  // Memoize messages to prevent unnecessary re-renders
  const messages = useMemo(
    () => currentConversation?.messages || [],
    [currentConversation]
  )

  // Local state
  const [input, setInput] = useState('')
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null)
  
  const hasMessages = messages.length > 0 || pendingMessage !== null
  const [error, setError] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string | null>(null)
  const [inputDisabled, setInputDisabled] = useState(true) // Start disabled by default
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, []);

  // Smooth scroll to bottom when messages change or loading state changes
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(scrollToBottom, 50)
    return () => clearTimeout(timer)
  }, [messages, isLoading, scrollToBottom])

  const createTitleFromInput = useCallback((text: string) => {
    const words = text.trim().split(/\s+/)
    const firstThreeWords = words.slice(0, 3).join(' ')
    return firstThreeWords + (words.length > 3 ? '...' : '')
  }, []);

  // Helper function to process AI response
const processAIResponse = useCallback(async (conversationId: string, userMessage: Message) => {
  try {
    let promptToUse: { value: string; enabled: boolean } | undefined
    if (systemPrompt) {
      promptToUse = {
        value: systemPrompt,
        enabled: true,
      }
    }

    console.log('Making AI request with:', {
      messageCount: [...messages, userMessage].length,
      hasSystemPrompt: !!promptToUse?.enabled,
      conversationId
    });

    // Get AI response (now returns complete response instead of stream)
    const result = await genAIResponse({
      data: {
        messages: [...messages, userMessage],
        systemPrompt: promptToUse,
      },
    })

    console.log('Complete response received:', {
      success: result?.success,
      contentLength: result?.content?.length,
      result: result
    });

    if (!result || !result.success || !result.content) {
      console.error('Invalid AI response:', result);
      throw new Error('Failed to get response from AI')
    }
    
    // Create a message with typing effect enabled
    const newMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: result.content,
      isTyping: true, // This triggers the typing effect
    }
    
    console.log('Setting pending message with typing effect:', {
      messageId: newMessage.id,
      contentLength: newMessage.content.length,
      isTyping: newMessage.isTyping
    });
    
    // Disable input while AI is responding
    setInputDisabled(true)
    setPendingMessage(newMessage)
    
    // After typing completes, add the final message to conversation
    // We'll handle this in the TypingMessage component's onTypingComplete callback
    
  } catch (error) {
    console.error('Error in AI response:', error)
    setPendingMessage(null)
    
    // Re-enable input on AI error so user can try again
    setInputDisabled(false)
    
    // Add an error message to the conversation
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: 'Sorry, I encountered an error generating a response. Please try again.',
    }
    await addMessage(conversationId, errorMessage)
  }
}, [messages, addMessage, systemPrompt, setPendingMessage, setInputDisabled])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const currentInput = input
    setInput('') // Clear input early for better UX
    setInputDisabled(true) // Disable input while processing
    setLoading(true)
    setError(null)
    
    const conversationTitle = createTitleFromInput(currentInput)

    try {
      // Create the user message object
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: currentInput.trim(),
      }
      
      let conversationId = currentConversationId

      // If no current conversation, create one in Convex first
      if (!conversationId) {
        try {
          console.log('Creating new Convex conversation with title:', conversationTitle)
          // Create a new conversation with our title
          const convexId = await createNewConversation(conversationTitle)
          
          if (convexId) {
            console.log('Successfully created Convex conversation with ID:', convexId)
            conversationId = convexId
            
            // Add user message directly to Convex
            console.log('Adding user message to Convex conversation:', userMessage.content)
            await addMessage(conversationId, userMessage)
          } else {
            console.warn('Failed to create Convex conversation, falling back to local')
            // Fallback to local storage if Convex creation failed
            const tempId = Date.now().toString()
            const tempConversation = {
              id: tempId,
              title: conversationTitle,
              messages: [],
            }
            
            actions.addConversation(tempConversation)
            conversationId = tempId
            
            // Add user message to local state
            actions.addMessage(conversationId, userMessage)
          }
        } catch (error) {
          console.error('Error creating conversation:', error)
          throw new Error('Failed to create conversation')
        }
      } else {
        // We already have a conversation ID, add message directly to Convex
        console.log('Adding user message to existing conversation:', conversationId)
        await addMessage(conversationId, userMessage)
        
        // Check if this is the user's first actual message (after the initial assistant message)
        // If so, update the conversation title based on their input
        const userMessages = messages.filter(m => m.role === 'user')
        if (userMessages.length === 0) {
          // This is the first user message, update the conversation title
          console.log('Updating conversation title to:', conversationTitle)
          await updateConversationTitle(conversationId, conversationTitle)
        }
      }
      
      // Process with AI after message is stored
      await processAIResponse(conversationId, userMessage)
      
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error processing your request.',
      }
      if (currentConversationId) {
        await addMessage(currentConversationId, errorMessage)
      }
      else {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('An unknown error occurred.')
        }
      }
      // Re-enable input on error so user can try again
      setInputDisabled(false)
    } finally {
      setLoading(false)
    }
  }, [input, isLoading, createTitleFromInput, currentConversationId, createNewConversation, addMessage, updateConversationTitle, processAIResponse, setLoading, messages, setInputDisabled, setError]);

  const handleNewChat = useCallback(() => {
    // Clean up any pending AI response/typing animation
    setPendingMessage(null)
    setLoading(false)
    setInputDisabled(true) // Keep disabled for new chats
    setError(null)
    
    // Reset the current conversation so the welcome screen is shown
    setCurrentConversationId(null)
    setSystemPrompt(null)
  }, [setCurrentConversationId, setPendingMessage, setLoading, setInputDisabled, setError])

  const handleDefineProblem = useCallback(async () => {
    try {
      const instruction = language === 'ar' ? HARMONY_PROMPT_AR : HARMONY_PROMPT_EN
      const prompt = language === 'ar' ? PROMPT1_AR : PROMPT1_EN
      const defaultTitle = language === 'ar' ? 'مشكلة جديدة' : 'New Problem'
      
      console.log('Creating new conversation for problem definition...');
      const id = await createNewConversation(defaultTitle)
      console.log('New conversation created with ID:', id);
      
      // Clear any existing pending message and set the conversation
      setPendingMessage(null)
      setCurrentConversationId(id)
      setSystemPrompt(prompt)
      setInput('')
      
      // Create the typing message as pendingMessage instead of adding directly
      const typingMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: instruction,
        isTyping: true,
        isInitialInstruction: true
      }
      
      console.log('Setting initial instruction as pending message with typing effect:', {
        messageId: typingMessage.id,
        contentLength: instruction.length,
        newConversationId: id
      });
      setPendingMessage(typingMessage)
    } catch (error) {
      console.error('Error in handleDefineProblem:', error);
      setError('Failed to create new conversation. Please try again.');
    }
  }, [language, createNewConversation, setCurrentConversationId, setPendingMessage, setError, setInputDisabled])

  const handleDeleteChat = useCallback(async (id: string) => {
    await deleteConversation(id)
  }, [deleteConversation]);

  const handleUpdateChatTitle = useCallback(async (id: string, title: string) => {
    await updateConversationTitle(id, title)
    setEditingChatId(null)
    setEditingTitle('')
  }, [updateConversationTitle]);

  return (
    <div className="relative flex h-screen bg-black text-white">
      <TopBar />


      {/* Sidebar - Always show on desktop, hidden on mobile */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        handleNewChat={handleNewChat}
        setCurrentConversationId={setCurrentConversationId}
        handleDeleteChat={handleDeleteChat}
        editingChatId={editingChatId}
        setEditingChatId={setEditingChatId}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        handleUpdateChatTitle={handleUpdateChatTitle}
        onCollapseChange={setSidebarCollapsed}
        isAiResponding={pendingMessage !== null || isLoading}
      />

      {/* Floating New Chat Button - Only on mobile */}
      <button
        onClick={handleNewChat}
        disabled={pendingMessage !== null || isLoading}
        className={`fixed bottom-32 end-4 z-20 md:hidden p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-200 ${
          pendingMessage !== null || isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
            : 'bg-red-600 text-white hover:opacity-90'
        }`}
        title={pendingMessage !== null || isLoading ? 'Please wait for AI response to complete' : translations[language].newChat}
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className="flex flex-col flex-1 pt-12 md:pt-0">
        {error && (
          <p className="w-full max-w-3xl p-4 mx-auto font-bold text-red-600">{error}</p>
        )}
        {hasMessages ? (
          <>
            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 pb-24 overflow-y-auto"
            >
              <div className="w-full max-w-3xl px-4 mx-auto">
                {[...messages, pendingMessage]
                  .filter((message): message is Message => message !== null)
                  .map((message) => {
                    return message.isTyping ? (
                      <TypingMessage 
                        key={message.id} 
                        message={message} 
                        typingSpeed={5}
                        onTypingProgress={scrollToBottom}
                        onTypingComplete={async () => {
                          // Capture the conversation ID at completion time
                          const conversationAtCompletion = currentConversationId
                          
                          // When typing completes, save the message to the conversation
                          console.log('Typing completed, saving message to conversation')
                          setPendingMessage(null)
                          
                          // Safety check: only proceed if we still have the same valid conversation
                          if (conversationAtCompletion && message.content.trim() && conversationAtCompletion === currentConversationId) {
                            // Add the final message without typing flag
                            const finalMessage: Message = {
                              ...message,
                              isTyping: false
                            }
                            await addMessage(conversationAtCompletion, finalMessage)
                            
                            // Handle input state and subscription based on message type
                            if (message.isInitialInstruction) {
                              // For initial instructions: re-enable input so user can ask their question
                              setInputDisabled(false)
                            } else {
                              // For AI responses: add subscription link and keep input disabled
                              await new Promise(resolve => setTimeout(resolve, 500))
                              await addMessage(conversationAtCompletion, {
                                id: (Date.now() + 2).toString(),
                                role: 'assistant',
                                content: `<a href="https://www.ajnee.com" target="_blank" class="px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-red-600 hover:opacity-90">${translations[language].subscribe}</a>`
                              })
                              setInputDisabled(true)
                            }
                          }
                        }}
                      />
                    ) : (
                      <ChatMessage key={message.id} message={message} />
                    )
                  })}
                {isLoading && <LoadingIndicator />}
              </div>
            </div>

            {/* Input */}
            
            <ChatInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              disabled={inputDisabled}
              sidebarCollapsed={sidebarCollapsed}
            />
          </>
        ) : (
          <WelcomeScreen
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={inputDisabled}
            onDefineProblem={handleDefineProblem}
          />
        )}
      </div>

    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})