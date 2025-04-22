# Notes AI - Smart Note-Taking Application

A modern, interactive note-taking application built with Next.js, Supabase, and AI integration.

## Features

- 🔐 Secure authentication with email/password and Google OAuth
- 📝 Create, edit, and organize notes
- 🎨 Clean, responsive UI built with Tailwind CSS and shadcn/ui
- ✨ Interactive particle background animation
- 🧠 AI-powered note summarization with GROQ
- 🔄 Real-time query fetching and caching with Tanstack-query (react-query)

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase Auth, Google OAuth
- **Database**: Supabase PostgreSQL
- **AI Integration**: GROQ API (Model - llama-3.3-70b)
- **State Management**: Tancstack Query
- **Animation**: tsParticles

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier works fine)
- Google Cloud Platform account (for OAuth)
- GROQ API key (optional, for AI features)

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/notes-ai.git
cd notes-ai
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Supabase Setup

1. Create a new Supabase project
2. Set up the following tables in your Supabase database:

**Users Table**:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Notes Table**:

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Enable Google OAuth in Supabase Auth settings
   - Add your Google OAuth credentials (Client ID and Secret)
   - Configure the redirect URL as `https://your-domain.com/auth/callback` (use `http://localhost:3000/auth/callback` for local development)

### Google OAuth Setup

1. Create a new project in Google Cloud Platform
2. Configure the OAuth consent screen
3. Create OAuth 2.0 Client ID credentials
4. Add authorized JavaScript origins: `http://localhost:3000` (and your production domain)
5. Add authorized redirect URIs: `http://localhost:3000/auth/callback` (and your production domain's callback URL)

### GROQ API Setup (Optional)

1. Sign up for a GROQ API key at [groq.com](https://groq.com)
2. Add the key to your `.env.local` file as `NEXT_PUBLIC_GROQ_API_KEY`

### Running the Application

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Authentication Flow

This application uses a combined approach for authentication:

1. **Traditional Email/Password**: Using Supabase Auth
2. **Google OAuth**: Implemented with both Google One Tap and traditional OAuth flow

The OAuth implementation uses:

- Client-side authentication with secure nonce generation
- Server-side session handling through Next.js route handlers
- Session persistence with Supabase Auth and localStorage fallback

## Deployment

This application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/notes-ai)

Make sure to add all the environment variables in your Vercel project settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
