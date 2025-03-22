import { google } from 'googleapis';
import { User, IUser } from '../models/User';

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

  async getChannelVideos(user: IUser, maxResults: number = 10) {
    try {
      console.log('Fetching channel videos for user:', user.email);
      
      if (!user.accessToken) {
        throw new Error('User access token is missing');
      }

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/auth/google/callback'
      );
      
      oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
      });

      const response = await this.youtube.channels.list({
        auth: oauth2Client,
        part: ['contentDetails'],
        mine: true,
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('No channel found for the authenticated user');
      }

      const uploadsPlaylistId = response.data.items[0].contentDetails.relatedPlaylists.uploads;
      console.log('Found uploads playlist ID:', uploadsPlaylistId);

      const videosResponse = await this.youtube.playlistItems.list({
        auth: oauth2Client,
        part: ['snippet'],
        playlistId: uploadsPlaylistId,
        maxResults,
      });

      if (!videosResponse.data.items) {
        return [];
      }

      const videos = videosResponse.data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
      }));

      console.log(`Successfully fetched ${videos.length} videos`);
      return videos;
    } catch (error: any) {
      console.error('Error fetching channel videos:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      if (error.code === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }
  }

  async getVideoComments(user: IUser, videoId: string, maxResults: number = 10) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/auth/google/callback'
      );
      
      oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
      });

      const response = await this.youtube.commentThreads.list({
        auth: oauth2Client,
        part: ['snippet'],
        videoId,
        maxResults,
        order: 'relevance',
      });

      return response.data.items.map((item: any) => ({
        id: item.id,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        authorImage: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        publishedAt: item.snippet.topLevelComment.snippet.publishedAt,
        likeCount: item.snippet.topLevelComment.snippet.likeCount,
      }));
    } catch (error) {
      console.error('Error fetching video comments:', error);
      throw error;
    }
  }

  async postComment(user: IUser, videoId: string, commentText: string) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/auth/google/callback'
      );
      
      oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
      });

      const response = await this.youtube.commentThreads.insert({
        auth: oauth2Client,
        part: ['snippet'],
        requestBody: {
          snippet: {
            videoId,
            topLevelComment: {
              snippet: {
                textOriginal: commentText,
              },
            },
          },
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  }
} 