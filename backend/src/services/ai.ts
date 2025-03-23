import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

export class AIService {
  private static instance: AIService;
  private readonly openai: OpenAI;

  private constructor() {
    const apiKey = process.env['OPENAI_API_KEY'];
    if (!apiKey) {
      console.error('Environment variables:', process.env);
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    this.openai = new OpenAI({ apiKey });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateReply(comment: string): Promise<string> {
    try {
      // Log the incoming comment and prompt structure
      console.log('\n=== AI Reply Generation Debug ===');
      console.log('Original comment:', comment);
      
      const systemPrompt = "You are a helpful assistant that generates friendly and professional replies to YouTube comments. Keep the replies concise, relevant, and engaging.";
      const userPrompt = `Please generate a friendly reply to this YouTube comment: "${comment}"`;
      
      console.log('\nPrompt Structure:');
      console.log('System:', systemPrompt);
      console.log('User:', userPrompt);
      
      // For testing, return a hardcoded reply
      const hardcodedReply = "Thank you for your comment! I appreciate your feedback and perspective. Looking forward to creating more content you'll enjoy! 😊";
      
      console.log('\nGenerated reply (hardcoded):', hardcodedReply);
      console.log('=== End Debug ===\n');

      return hardcodedReply;

      /* Commented out OpenAI implementation for now
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content?.trim();
      
      if (!reply) {
        throw new Error('No reply was generated');
      }

      console.log('Successfully generated reply:', reply);
      return reply;
      */

    } catch (error: any) {
      console.error('Error generating reply:', error);
      throw new Error(`Failed to generate reply: ${error.message}`);
    }
  }
} 