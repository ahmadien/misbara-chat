import { createServerFn } from '@tanstack/react-start'
import OpenAI from 'openai'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const DEFAULT_SYSTEM_PROMPT = `You are TanStack Chat, an AI assistant using Markdown for clear and structured responses. Format your responses following these guidelines:

1. Use headers for sections:
   # For main topics
   ## For subtopics
   ### For subsections

2. For lists and steps:
   - Use bullet points for unordered lists
   - Number steps when sequence matters
   
3. For code:
   - Use inline \`code\` for short snippets
   - Use triple backticks with language for blocks:
   \`\`\`python
   def example():
       return "like this"
   \`\`\`

4. For emphasis:
   - Use **bold** for important points
   - Use *italics* for emphasis
   - Use > for important quotes or callouts

5. For structured data:
   | Use | Tables |
   |-----|---------|
   | When | Needed |

6. Break up long responses with:
   - Clear section headers
   - Appropriate spacing between sections
   - Bullet points for better readability
   - Short, focused paragraphs

7. For technical content:
   - Always specify language for code blocks
   - Use inline \`code\` for technical terms
   - Include example usage where helpful

Keep responses concise and well-structured. Use appropriate Markdown formatting to enhance readability and understanding.`

// Corrected Responses API implementation
export const genAIResponse = createServerFn({ method: 'POST', response: 'raw' })
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
      throw new Error(
        'Missing API key: Please set OPENAI_API_KEY in your environment variables or VITE_OPENAI_API_KEY in your .env file.'
      )
    }

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
      return new Response(JSON.stringify({ error: 'No valid messages to send' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = data.systemPrompt?.enabled
      ? `${DEFAULT_SYSTEM_PROMPT}\n\n${data.systemPrompt.value}`
      : DEFAULT_SYSTEM_PROMPT

    // Debug log to verify prompt layering
    console.log('System Prompt Configuration:', {
      hasCustomPrompt: data.systemPrompt?.enabled,
      customPromptValue: data.systemPrompt?.value?.substring(0, 100) + '...', // Truncate for logging
    })

    try {
      // CORRECTED: Use proper Responses API format according to documentation
      const stream = openai.responses.stream({
        model: 'gpt-4o',
        instructions: systemPrompt,
        input: formattedMessages.map((msg) => ({
          type: 'message',
          role: msg.role,
          content: [
            {
              type: 'input_text',
              text: msg.content.trim(),
            },
          ],
        })),
        stream: true,
      })

      const encoder = new TextEncoder()
      
      // Create a readable stream that properly handles the Responses API events
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              console.log('Received event:', event.type); // Debug log
              
              // Handle the text delta events according to the Responses API docs
              if (event.type === 'response.output_text.delta') {
                const text = event.delta;
                if (text) {
                  const json = JSON.stringify({
                    type: 'content_block_delta',
                    delta: { text },
                  });
                  controller.enqueue(encoder.encode(json + '\n'));
                }
              }
              // Handle completion
              else if (event.type === 'response.done') {
                console.log('Stream completed');
                break;
              }
              // Handle errors
              else if (event.type === 'error') {
                console.error('OpenAI stream error:', event);
                const errorJson = JSON.stringify({
                  type: 'error',
                  error: event.error?.message || 'Unknown streaming error'
                });
                controller.enqueue(encoder.encode(errorJson + '\n'));
                break;
              }
            }
          } catch (error) {
            console.error('Stream processing error:', error);
            const errorJson = JSON.stringify({
              type: 'error',
              error: 'Stream processing failed'
            });
            controller.enqueue(encoder.encode(errorJson + '\n'));
          } finally {
            controller.close();
          }
        },
        
        // Handle stream cancellation
        cancel() {
          console.log('Stream cancelled by client');
        }
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Cache-Control',
        },
      })
    } catch (error) {
      console.error('Error in genAIResponse:', error)
      
      // Enhanced error handling
      let errorMessage = 'Failed to get AI response'
      let statusCode = 500
      
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack?.substring(0, 500)
        });
        
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please try again in a moment.'
          statusCode = 429
        } else if (error.message.includes('Connection error') || error.name === 'APIConnectionError') {
          errorMessage = 'Connection to OpenAI API failed. Please check your internet connection and API key.'
          statusCode = 503
        } else if (error.message.includes('authentication') || error.message.includes('401')) {
          errorMessage = 'Authentication failed. Please check your OpenAI API key.'
          statusCode = 401
        } else if (error.message.includes('model') || error.message.includes('400')) {
          errorMessage = 'Invalid request. Please check the model and parameters.'
          statusCode = 400
        } else {
          errorMessage = error.message
        }
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? {
          name: error.name,
          message: error.message
        } : undefined
      }), {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  })