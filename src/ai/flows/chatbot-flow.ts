'use server';
/**
 * @fileOverview A chatbot flow for the website assistant.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {products} from '@/lib/data';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({
        text: z.string()
    }))
  })).describe('The conversation history.'),
  message: z.string().describe('The latest message from the user.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(
  input: ChatInput
): Promise<ChatOutput> {
  return chatbotFlow(input);
}

// Create a simplified list of product names and descriptions for the prompt
const productContext = products.map(p => `- ${p.name}: ${p.description}`).join('\n');

const promptTemplate = `You are an AI assistant for "Box", a B2B marketplace for factory by-products. Your goal is to help users find information and navigate the site.

You are friendly, helpful, and concise.

Your capabilities include:
- Answering questions about what Box is.
- Providing information about the types of products available.
- Explaining how to contact a factory or request a quote (RFQ).
- Answering questions about the seller dashboard.

Here is a list of available products to help you answer questions:
${productContext}

Based on the conversation history and the user's latest message, provide a helpful response.
`;

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        history: input.history,
        prompt: `${promptTemplate}\n\nUser message: ${input.message}`
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response text from AI model.");
    }
    return { response: text };
  }
);
