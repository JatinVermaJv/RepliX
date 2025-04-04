# RepliX - YouTube Comment Assistant

## Project Overview
RepliX is an AI-powered YouTube comment management system that helps content creators efficiently manage and respond to their video comments. The application integrates with YouTube's API and uses Large Language Models to generate contextually appropriate responses to comments.

## Architecture
The project follows a modern full-stack architecture with separate frontend and backend services:

### Frontend (Next.js)
- Built with Next.js 14 and TypeScript
- Uses Tailwind CSS for styling
- Implements dark mode and responsive design
- Features a split-view dashboard for efficient comment management

### Backend (Node.js/Express)
- RESTful API built with Express.js and TypeScript
- MongoDB database for data persistence
- Integration with YouTube Data API v3
- OpenAI API integration for comment response generation

## Workflow

### 1. Authentication Flow
1. User clicks "Sign in with Google"
2. OAuth2 authentication with Google
3. User grants access to YouTube account
4. Backend creates/updates user session
5. User is redirected to dashboard

### 2. Video Management Flow
1. User's YouTube videos are fetched on dashboard load
2. Videos are displayed in a grid layout
3. User can select a video to view its comments
4. Real-time updates of video data

### 3. Comment Management Flow
1. Comments are fetched when a video is selected
2. Comments are displayed in a scrollable list
3. User can:
   - View comment details
   - Generate AI responses
   - Post responses to YouTube
   - Track engagement metrics

### 4. AI Response Generation
1. User selects a comment to respond to
2. System analyzes comment context
3. AI generates appropriate response
4. User can edit/modify response
5. Response is posted to YouTube

## Technical Features

### Security
- Secure OAuth2 authentication
- Environment variable management
- Rate limiting
- Input validation
- CORS protection

### Performance
- Efficient caching mechanisms
- Optimized API calls
- Lazy loading of components
- Image optimization

### User Experience
- Dark mode support
- Responsive design
- Real-time updates
- Intuitive interface
- Loading states and error handling

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- YouTube Data API v3 credentials
- Google OAuth credentials
- OpenAI API key

### Environment Variables
```env
# Backend
MONGODB_URI=your_mongodb_uri
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Docker Deployment
The application is containerized using Docker and can be deployed using docker-compose:

```bash
# Build and run
docker-compose up --build

# Stop services
docker-compose down
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/logout` - Logout user

### YouTube
- `GET /api/youtube/videos` - Get user's videos
- `GET /api/youtube/videos/:videoId/comments` - Get video comments
- `POST /api/youtube/videos/:videoId/comments` - Post comment

## Future Enhancements
1. Comment sentiment analysis
2. Automated response scheduling
3. Bulk comment management
4. Analytics dashboard
5. Custom AI response templates
6. Multi-language support
7. Team collaboration features

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any questions or concerns, please open an issue in the GitHub repository. 