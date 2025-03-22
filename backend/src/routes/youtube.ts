import express from 'express';
import { YouTubeService } from '../services/youtube';
import { User, IUser } from '../models/User';

const router = express.Router();
const youtubeService = YouTubeService.getInstance();

const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

router.get('/videos', isAuthenticated, async (req, res) => {
  try {
    const videos = await youtubeService.getChannelVideos(req.user as IUser);
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

router.get('/videos/:videoId/comments', isAuthenticated, async (req, res) => {
  try {
    const comments = await youtubeService.getVideoComments(
      req.user as IUser,
      req.params.videoId
    );
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});
//checking for the posting of the comment
router.post('/videos/:videoId/comments', isAuthenticated, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = await youtubeService.postComment(
      req.user as IUser,
      req.params.videoId,
      text
    );
    res.json(comment);
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ message: 'Failed to post comment' });
  }
});

export default router; 