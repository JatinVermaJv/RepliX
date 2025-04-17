import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

export class AIService {
  private static instance: AIService;
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  private constructor() {
    const apiKey = process.env['GEMINI_API_KEY'];
    if (!apiKey) {
      console.error('Environment variables:', process.env);
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateReply(comment: string): Promise<string> {
    try {
      console.log('\n=== AI Reply Generation Debug ===');
      console.log('Original comment:', comment);
      
      const prompt = `As a YouTube content creator, generate a friendly and professional reply to this comment: "${comment}"

Guidelines for the reply:
-keep the reply short and concise and also punchy
-be friendly and engaging
-sound natural and personalized
-include an emoji if appropriate

just give me one of the option not all the options just ready to be posted option you see fit`;
      
      console.log('\nPrompt:', prompt);

      try {
        const result = await this.model.generateContent(prompt);
        const reply = result.response.text().trim();
        
        if (!reply) {
          throw new Error('No reply was generated');
        }

        console.log('Successfully generated reply:', reply);
        console.log('=== End Debug ===\n');
        
        return reply;
      } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback to a safe default response if the API fails
        const fallbackReply = "Thank you for your comment! I appreciate your feedback. 🙏";
        console.log('Using fallback reply:', fallbackReply);
        console.log('=== End Debug ===\n');
        return fallbackReply;
      }
    } catch (error: any) {
      console.error('Error generating reply:', error);
      throw new Error(`Failed to generate reply: ${error.message}`);
    }
  }
} 