import { google } from 'googleapis';
import { User, IUser } from '../models/User';

interface YouTubeVideoItem {
  id?: { videoId: string };
  snippet?: {
    title?: string;
    thumbnails?: { medium?: { url: string } };
    publishedAt?: string;
  };
}

interface YouTubeCommentItem {
  id: string;
  snippet?: {
    topLevelComment?: {
      snippet?: {
        authorDisplayName?: string;
        authorProfileImageUrl?: string;
        textDisplay?: string;
        publishedAt?: string;
        likeCount?: number;
      };
    };
  };
}

export class YouTubeService {
  private static instance: YouTubeService;
  private youtube: any;

  private constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.GOOGLE_CLIENT_ID 
    });
  }

  public static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  private getAuth(user: IUser) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });
    return oauth2Client;
  }

  async getChannelVideos(user: IUser) {
    try {
      const auth = this.getAuth(user);
      
      // First, get the user's channel ID
      const response = await this.youtube.channels.list({
        auth,
        part: ['contentDetails'],
        mine: true,
      });

      const channelId = response.data.items?.[0]?.id;
      if (!channelId) {
        throw new Error('Could not find channel ID');
      }

      // Then, get the channel's videos
      const videosResponse = await this.youtube.search.list({
        auth,
        part: ['snippet'],
        channelId,
        type: ['video'],
        order: 'date',
        maxResults: 10,
      });

      return videosResponse.data.items?.map((item: YouTubeVideoItem) => ({
        id: item.id?.videoId,
        title: item.snippet?.title,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
        publishedAt: item.snippet?.publishedAt,
      })) || [];

    } catch (error: any) {
      console.error('Error fetching channel videos:', error);
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }
  }

  async getVideoComments(user: IUser, videoId: string) {
    try {
      const auth = this.getAuth(user);
      
      const response = await this.youtube.commentThreads.list({
        auth,
        part: ['snippet'],
        videoId,
        maxResults: 100,
      });

      return response.data.items?.map((item: YouTubeCommentItem) => ({
        id: item.id,
        author: item.snippet?.topLevelComment?.snippet?.authorDisplayName,
        authorImage: item.snippet?.topLevelComment?.snippet?.authorProfileImageUrl,
        text: item.snippet?.topLevelComment?.snippet?.textDisplay,
        publishedAt: item.snippet?.topLevelComment?.snippet?.publishedAt,
        likeCount: item.snippet?.topLevelComment?.snippet?.likeCount,
      })) || [];

    } catch (error: any) {
      console.error('Error fetching video comments:', error);
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }
  }

  async postComment(user: IUser, videoId: string, text: string, parentId?: string) {
    try {
      const auth = this.getAuth(user);

      if (parentId) {
        // This is a reply to an existing comment
        const response = await this.youtube.comments.insert({
          auth,
          part: ['snippet'],
          requestBody: {
            snippet: {
              parentId,
              textOriginal: text,
              videoId,
            },
          },
        });
        return response.data;
      } else {
        // This is a new top-level comment
        const response = await this.youtube.commentThreads.insert({
          auth,
          part: ['snippet'],
          requestBody: {
            snippet: {
              videoId,
              topLevelComment: {
                snippet: {
                  textOriginal: text,
                },
              },
            },
          },
        });
        return response.data;
      }
    } catch (error: any) {
      console.error('Error posting comment:', error);
      throw new Error(`Failed to post comment: ${error.message}`);
    }
  }
} 