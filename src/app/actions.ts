'use server';

import { suggestInitialInquiry } from '@/ai/flows/suggest-initial-inquiry';
import { chat, type ChatInput } from '@/ai/flows/chatbot-flow';
import type { Product } from '@/lib/types';

export async function getInquirySuggestion(product: Product) {
  try {
    const result = await suggestInitialInquiry({
      productName: product.name,
      productDescription: product.description,
    });
    return result.suggestedInquiry;
  } catch (error) {
    console.error('Error getting inquiry suggestion:', error);
    return 'Could not generate a suggestion at this time. Please write your own inquiry.';
  }
}

export async function getChatbotResponse(input: ChatInput) {
    try {
        const result = await chat(input);
        return result.response;
    } catch (error) {
        console.error('Error getting chatbot response:', error);
        return 'Sorry, I am having trouble connecting. Please try again later.';
    }
}
