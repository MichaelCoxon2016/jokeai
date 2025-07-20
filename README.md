# JokeAI Platform

A modern AI-powered joke generation platform built with Next.js, Supabase, and OpenRouter.

## Features

- 🎭 AI-powered joke generation using OpenRouter
- 🎯 Multiple joke categories (dad jokes, programming, animals, etc.)
- ⭐ Rating system for jokes
- ❤️ Favorite jokes functionality
- 📱 Responsive design with dark theme
- 🔐 User authentication with Supabase
- 📊 Generation history tracking
- 🎨 Modern UI with styled-components

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Styled Components
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **AI**: OpenRouter API for joke generation
- **State Management**: Zustand
- **Styling**: Styled Components with custom theme
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd joke-ai-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `OPENROUTER_API_KEY`: Your OpenRouter API key

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── joke/              # Joke-related components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── lib/
│   ├── openrouter/        # OpenRouter API client
│   ├── services/          # Business logic services
│   └── supabase/          # Supabase clients
├── store/                 # Zustand stores
├── styles/                # Theme and styled-components
└── types/                 # TypeScript type definitions
```

## API Routes

- `POST /api/jokes/generate` - Generate a new joke
- `GET /api/jokes` - Get jokes with filters
- `POST /api/jokes/rate` - Rate a joke
- `POST /api/jokes/favorite` - Toggle favorite status

## Database Schema

The app uses the following main tables:
- `jokes` - Stores generated jokes
- `joke_categories` - Available joke categories
- `joke_ratings` - User ratings for jokes
- `joke_favorites` - User favorites
- `user_preferences` - User settings
- `generation_history` - Track generation requests

## Features in Detail

### AI Joke Generation
- Uses OpenRouter to access various AI models
- Supports different joke categories and styles
- Custom prompts for personalized jokes
- Content filtering options

### User Experience
- Clean, modern dark theme
- Responsive design for all devices
- Real-time updates with optimistic UI
- Toast notifications for user feedback

### Authentication
- Secure authentication with Supabase
- Protected routes for authenticated features
- User session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues, please create an issue on the GitHub repository.