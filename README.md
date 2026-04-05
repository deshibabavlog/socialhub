# SocialHub - Multi-Platform Social Media Automation

A complete, production-ready monorepo for managing multiple social media platforms from a single dashboard. Built with NestJS, React, TypeScript, Prisma, and PostgreSQL.

## Features

- **Multi-Platform Support**: Facebook, Instagram, YouTube, TikTok, LinkedIn
- **Post Management**: Draft, schedule, and publish posts across multiple platforms
- **Media Management**: Upload and manage media assets
- **OAuth Integration**: Secure OAuth 2.0 authentication for each platform
- **Analytics**: Track engagement, reach, and performance metrics
- **Queue System**: Reliable post scheduling with Bull queue
- **Brand Management**: Manage multiple brands with separate social accounts
- **Authentication**: JWT-based user authentication

## Project Structure

```
socialhub/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── brands/        # Brand management
│   │   │   ├── oauth/         # OAuth integration
│   │   │   ├── posts/         # Post management
│   │   │   ├── media/         # Media handling
│   │   │   ├── queue/         # Job queue & publishers
│   │   │   ├── analytics/     # Analytics service
│   │   │   ├── main.ts        # Entry point
│   │   │   └── app.module.ts
│   │   ├── prisma/            # Database schema
│   │   └── package.json
│   │
│   └── web/                   # React Frontend
│       ├── src/
│       │   ├── pages/         # Page components
│       │   ├── components/    # Reusable components
│       │   ├── store/         # Zustand stores
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       └── package.json
│
├── docs/                       # Documentation
├── package.json               # Workspace package.json
└── .gitignore
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL 14+
- Redis 7+ (for job queue)

### Installation

1. Clone the repository:
```bash
cd socialhub
npm install
```

2. Set up environment variables:

**Backend (.env at root):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/socialhub
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
API_URL=http://localhost:3000

# OAuth Credentials
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

**Frontend (apps/web/.env.local):**
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=SocialHub
```

### Database Setup

```bash
npm run db:setup
```

This will:
1. Create the PostgreSQL database
2. Run Prisma migrations
3. Seed initial data (optional)

### Running the Application

```bash
# Development mode (runs both api and web)
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## API Documentation

### Authentication Endpoints

```
POST   /auth/register          - Register new user
POST   /auth/login             - Login user
POST   /auth/refresh           - Refresh JWT token
GET    /auth/me                - Get current user
```

### Brand Endpoints

```
GET    /brands                 - List all brands
POST   /brands                 - Create new brand
GET    /brands/:id             - Get brand details
PUT    /brands/:id             - Update brand
DELETE /brands/:id             - Delete brand
```

### Post Endpoints

```
GET    /posts                  - List posts
POST   /posts                  - Create post
GET    /posts/:id              - Get post details
PUT    /posts/:id              - Update post
DELETE /posts/:id              - Delete post
POST   /posts/:id/publish      - Publish post immediately
POST   /posts/:id/schedule     - Schedule post
POST   /posts/:id/attach-media - Attach media to post
```

### Media Endpoints

```
GET    /media                  - List media
POST   /media/upload           - Upload media file
GET    /media/:id              - Get media details
DELETE /media/:id              - Delete media
```

### OAuth Endpoints

```
GET    /oauth/authorize/:platform        - Get OAuth authorization URL
POST   /oauth/callback/:platform         - Handle OAuth callback
GET    /oauth/accounts                   - List connected accounts
POST   /oauth/disconnect                 - Disconnect account
POST   /oauth/refresh                    - Refresh OAuth token
```

## Database Schema

### User Model
- id, email, password, firstName, lastName, avatar
- Relations: brands, accounts, posts, media

### Brand Model
- id, userId, name, slug, logo, description, website
- Relations: user, accounts, posts, analytics

### OAuthAccount Model
- id, userId, brandId, platform, accountId, accessToken, refreshToken
- Platforms: facebook, instagram, youtube, tiktok, linkedin

### Post Model
- id, userId, brandId, title, content, platforms, scheduledAt, publishedAt, status
- Status: draft, scheduled, published, failed

### Media Model
- id, userId, key, url, type, mimeType, size, width, height

### Analytics Model
- id, brandId, platform, date, views, engagement, clicks, shares, comments, likes

## Platform Publishers

The queue system includes dedicated publishers for each platform:

- **FacebookPublisher** - Posts to Facebook pages
- **InstagramPublisher** - Posts to Instagram accounts
- **YouTubePublisher** - Uploads to YouTube channels
- **TikTokPublisher** - Posts to TikTok accounts
- **LinkedInPublisher** - Posts to LinkedIn profiles

Each publisher handles:
- Content formatting for platform specifications
- Media attachment and optimization
- Analytics data collection
- Error handling and retry logic

## Development Guide

### Adding a New Feature

1. **Backend**:
   - Create module in `apps/api/src/`
   - Add service and controller
   - Define DTOs in module folder
   - Export from module's index.ts
   - Import in app.module.ts

2. **Frontend**:
   - Create components in `apps/web/src/components/`
   - Create pages in `apps/web/src/pages/`
   - Add Zustand store if needed
   - Update routing in App.tsx

### Running Tests

```bash
npm run test
```

### Linting

```bash
npm run lint
```

## Deployment

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for complete deployment instructions.

### Quick Deploy

1. Set up PostgreSQL and Redis on your server
2. Configure environment variables
3. Build the project: `npm run build`
4. Start the server: `npm start`
5. Access via your domain

## Security Considerations

- JWT tokens expire after 15 minutes (refresh tokens: 7 days)
- OAuth tokens are encrypted in database
- CORS is enabled for configured origins
- Input validation on all endpoints
- Password hashing with bcrypt
- HTTPS required in production

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.

## License

MIT
