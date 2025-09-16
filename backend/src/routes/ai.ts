import express from 'express';
import { AIService } from '../services/ai';
import { IUser } from '../models/User';

const router = express.Router();
const aiService = AIService.getInstance();

const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

router.post('/generate-reply', isAuthenticated, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const reply = await aiService.generateReply(comment);
    res.json({ reply });
  } catch (error: any) {
    console.error('Error generating reply:', error);
    res.status(500).json({ message: error.message || 'Failed to generate reply' });
  }
});

router.post('/categorize-comments', isAuthenticated, async (req, res) => {
  try {
    const { comments } = req.body;
    if (!comments || !Array.isArray(comments)) {
      return res.status(400).json({ message: 'Comments array is required' });
    }

    if (comments.length === 0) {
      return res.json({ positive: [], negative: [], neutral: [] });
    }

    const categorizedComments = await aiService.categorizeComments(comments);
    res.json(categorizedComments);
  } catch (error: any) {
    console.error('Error categorizing comments:', error);
    res.status(500).json({ message: error.message || 'Failed to categorize comments' });
  }
});

export default router; 