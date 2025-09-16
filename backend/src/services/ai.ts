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

  async categorizeComments(comments: any[]): Promise<{ positive: any[], negative: any[], neutral: any[] }> {
    try {
      console.log('\n=== AI Comment Categorization Debug ===');
      console.log('Processing comments count:', comments.length);
      
      const categorizedComments = {
        positive: [] as any[],
        negative: [] as any[],
        neutral: [] as any[]
      };

      // Process comments in batches to avoid API limits
      const batchSize = 10;
      
      for (let i = 0; i < comments.length; i += batchSize) {
        const batch = comments.slice(i, i + batchSize);
        
        for (const comment of batch) {
          try {
            const prompt = `Analyze the sentiment of this YouTube comment and categorize it as exactly one of: positive, negative, or neutral.

Comment: "${comment.text}"

Instructions:
- Respond with ONLY one word: "positive", "negative", or "neutral"
- positive: encouraging, supportive, complimentary, excited, grateful
- negative: critical, angry, disappointed, hateful, spam
- neutral: questions, informational, neutral observations, requests

Response:`;

            const result = await this.model.generateContent(prompt);
            const sentiment = result.response.text().trim().toLowerCase();
            
            console.log(`Comment: "${comment.text.substring(0, 50)}..." -> Sentiment: ${sentiment}`);
            
            // Validate and categorize
            if (sentiment.includes('positive')) {
              categorizedComments.positive.push({ ...comment, sentiment: 'positive' });
            } else if (sentiment.includes('negative')) {
              categorizedComments.negative.push({ ...comment, sentiment: 'negative' });
            } else {
              categorizedComments.neutral.push({ ...comment, sentiment: 'neutral' });
            }
            
            // Small delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error('Error processing comment:', error);
            // Default to neutral if analysis fails
            categorizedComments.neutral.push({ ...comment, sentiment: 'neutral' });
          }
        }
      }

      console.log('Categorization results:');
      console.log(`- Positive: ${categorizedComments.positive.length}`);
      console.log(`- Negative: ${categorizedComments.negative.length}`);
      console.log(`- Neutral: ${categorizedComments.neutral.length}`);
      console.log('=== End Debug ===\n');

      return categorizedComments;
    } catch (error: any) {
      console.error('Error categorizing comments:', error);
      throw new Error(`Failed to categorize comments: ${error.message}`);
    }
  }
} 