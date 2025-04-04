# RepliX

RepliX is an AI-powered YouTube comment assistant that helps content creators streamline their engagement and manage responses efficiently. Built with Next.js, TypeScript, and the YouTube Data API, RepliX provides a modern interface for managing your YouTube comments.

## 🎥 Demo

Watch our demo video: [RepliX Demo](https://drive.google.com/file/d/1FBLAYU6wfb2IIo5NQXORz5DuMBwLvFNm/view?usp=sharing)

## ✨ Features

- 🔐 Secure Google OAuth authentication
- 📱 Modern, responsive UI with dark mode support
- 🎯 Easy video selection and comment management
- 💬 Real-time comment viewing and response
- 🤖 AI-powered comment management
- 📊 Dashboard for video and comment analytics

## 🚀 Tech Stack

- **Frontend:**
  - Next.js 
  - TypeScript
  - Tailwind CSS
  - React Context API

- **Backend:**
  - Node.js
  - Express
  - TypeScript
  - MongoDB
  - YouTube Data API v3

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- YouTube Data API v3 credentials
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/replix.git
cd replix
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_uri
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

4. Start the development servers:

```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🔒 Environment Variables

### Backend
- `MONGODB_URI`: MongoDB connection string
- `YOUTUBE_API_KEY`: YouTube Data API v3 key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `SESSION_SECRET`: Session secret for authentication


