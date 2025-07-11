import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
  isInitialInstruction?: boolean
}

export const genAIResponse = createServerFn({ method: 'POST' })
  .validator(
    (d: {
      messages: Array<Message>
      systemPrompt?: { value: string; enabled: boolean }
    }) => d,
  )
  .handler(async ({ data }) => {
    // Check for API key in environment variables
    const apiKey = process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY

    if (!apiKey) {
      console.error('No OpenAI API key found');
      throw new Error(
        'Missing API key: Please set OPENAI_API_KEY in your environment variables or VITE_OPENAI_API_KEY in your .env file.'
      )
    }

    console.log('OpenAI API Key available:', apiKey.substring(0, 10) + '...');

    const openai = new OpenAI({
      apiKey
    })

    // Filter out error messages and empty messages
    const formattedMessages = data.messages
      .filter(
        (msg) =>
          msg.content.trim() !== '' &&
          !msg.content.startsWith('Sorry, I encountered an error'),
      )

    if (formattedMessages.length === 0) {
      throw new Error('No valid messages to send')
    }

    const systemPrompt = data.systemPrompt?.enabled
      ? data.systemPrompt.value
      : null

    console.log('Request details:', {
      messageCount: formattedMessages.length,
      hasCustomPrompt: !!systemPrompt,
      systemPromptLength: systemPrompt ? systemPrompt.length : 0,
    });

    try {
      console.log('Creating OpenAI chat completion...');
      
      // Create the messages array for chat completions
      const messages = [
        ...(systemPrompt
          ? [{ role: 'system' as const, content: systemPrompt }]
          : []),
        ...formattedMessages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content.trim()
        }))
      ];

      console.log('Messages format:', JSON.stringify(messages.map(msg => ({
        role: msg.role,
        contentLength: msg.content.length,
        contentPreview: msg.content.substring(0, 100) + '...'
      })), null, 2));

      // Use regular chat completions API (no streaming)
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        stream: false,
      });

      console.log('OpenAI chat completion created successfully');

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      return {
        success: true,
        content: content
      };

    } catch (error) {
      console.error('OpenAI API failed:', error);
      
      // Enhanced error handling
      let errorMessage = 'OpenAI API failed'
      
      if (error instanceof Error) {
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.'
        } else if (error.message.includes('authentication') || error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please check your OpenAI API key.'
        } else if (error.message.includes('model') || error.message.includes('400')) {
          errorMessage = 'Invalid request. The model or parameters may be incorrect.'
        } else {
          errorMessage = error.message
        }
      }
      
      throw new Error(errorMessage);
    }
  })