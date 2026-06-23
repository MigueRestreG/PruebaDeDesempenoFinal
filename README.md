# Recetario – Recipe Management Application

A fully functional recipe management application with user authentication, favorites, and email integration. Built with modern web technologies for scalability and maintainability.

## Features

- 🍳 **Recipe Catalog** – Browse public recipes with detailed information
- 👤 **User Authentication** – Secure JWT-based login and registration
- ❤️ **Favorites System** – Save and manage favorite recipes (protected)
- 📧 **Email Notifications** – Welcome email sent automatically on signup
- 🎨 **Dynamic UI** – Difficulty-based color coding and visual indicators
- 🔒 **Protected Routes** – Middleware-protected favorites page
- 📱 **Responsive Design** – Mobile-friendly Material-UI components
- 🏗️ **Layered Architecture** – Clean separation of concerns (routes → services → models)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.9 (App Router) |
| **Language** | TypeScript (strict mode) |
| **UI Library** | Material-UI (MUI) v9 |
| **Database** | MongoDB + Mongoose 9.7.2 |
| **Authentication** | JWT via jose + HttpOnly cookies |
| **Password Hashing** | bcryptjs |
| **Validation** | Zod |
| **Email** | Nodemailer |
| **State Management** | React Context |

## Requirements

- Node.js 18+
- npm or yarn
- MongoDB instance (local or Atlas)
- SMTP credentials (optional, for email notifications)

## Installation

### 1. Clone and Install

```bash
git clone https://github.com/MigueRestreG/PruebaDeDesempenoFinal.git
cd pruebadesempenomiguel
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required variables:**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/
MONGODB_DB_NAME=recetario

# Optional: Email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Recetario <noreply@recetario.local>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Load Initial Data

Seed the database with 10 demo recipes:

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** to see the app.

## Available Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Load demo recipes into MongoDB
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── auth/                # Authentication endpoints
│   │   └── recipes/             # Recipe endpoints
│   │   └── favorites/           # Favorites endpoints
│   ├── favorites/               # Protected favorites page
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── recipes/[id]/            # Dynamic recipe detail page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home / catalog page
├── components/                  # Reusable React components
│   ├── AuthForm.tsx            # Login/register form
│   ├── Navbar.tsx              # Header with navigation
│   ├── ProtectedRoute.tsx       # Client-side route protection
│   ├── RecipeCard.tsx          # Recipe card component
│   ├── RecipeGrid.tsx          # Recipe grid with favorites logic
│   ├── RecipeList.tsx          # Recipe list wrapper
│   └── FavoriteGrid.tsx        # Favorites display
├── context/                    # React Context
│   └── AuthContext.tsx         # Authentication state management
├── lib/                        # Utility functions
│   ├── api.ts                  # Fetch wrapper
│   ├── jwt.ts                  # JWT signing/verification
│   ├── mongodb.ts              # MongoDB connection
│   └── theme.ts                # MUI theme configuration
├── models/                     # Mongoose schemas
│   ├── user.model.ts           # User schema
│   ├── recipe.model.ts         # Recipe schema
│   └── favorite.model.ts       # Favorite schema
├── services/                   # Business logic layer
│   ├── auth.service.ts         # Authentication logic
│   ├── user.service.ts         # User operations
│   ├── recipe.service.ts       # Recipe operations
│   ├── favorite.service.ts     # Favorite operations
│   └── email.service.ts        # Email sending
├── scripts/                    # Utility scripts
│   └── seed.ts                 # Database seeding script
├── types/                      # TypeScript type definitions
│   └── index.ts               # All shared types
├── utils/                      # Helper functions
│   └── validators.ts           # Zod validation schemas
├── middleware.ts               # Next.js middleware (auth protection)
└── globals.css                 # Global styles
```

## Architecture

The application follows a **layered architecture** pattern:

```
┌─────────────────────────────────┐
│      React Components (UI)       │  Presentation Layer
├─────────────────────────────────┤
│    Next.js App Router Pages     │  Routing Layer
├─────────────────────────────────┤
│      API Routes (Handlers)       │  API Layer
├─────────────────────────────────┤
│     Services (Business Logic)    │  Business Logic Layer
├─────────────────────────────────┤
│  Mongoose Models (DB Interface)  │  Data Access Layer
├─────────────────────────────────┤
│         MongoDB Database         │  Data Layer
└─────────────────────────────────┘
```

**Key Principle:** All database interactions flow through the service layer. API routes never access models directly.

## Routes

| Path | Method | Auth | Purpose |
|------|--------|------|---------|
| `/` | GET | ❌ | Recipe catalog (public) |
| `/recipes/[id]` | GET | ❌ | Recipe detail page |
| `/login` | GET | ❌ | Login page |
| `/register` | GET | ❌ | Registration page |
| `/favorites` | GET | ✅ | User's favorite recipes |

## API Endpoints

### Authentication

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/auth/register` | POST | `{ name, lastName, email, password, confirmPassword }` | `{ user }` |
| `/api/auth/login` | POST | `{ email, password }` | `{ user }` |
| `/api/auth/logout` | POST | — | `{ ok: true }` |
| `/api/auth/me` | GET | — | `{ user \| null }` |

### Recipes

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `/api/recipes` | GET | — | `{ recipes: Recipe[] }` |
| `/api/recipes/[id]` | GET | — | `{ recipe: Recipe }` |

### Favorites

| Endpoint | Method | Auth | Body | Response |
|----------|--------|------|------|----------|
| `/api/favorites` | GET | ✅ | — | `{ favorites: Favorite[] }` |
| `/api/favorites` | POST | ✅ | `{ recipeId }` | `{ favorite: Favorite }` |
| `/api/favorites/[id]` | DELETE | ✅ | — | `{ ok: true }` |

## Key Components

### RecipeCard
Displays a single recipe with:
- Image with fallback handling
- Title and description
- Preparation time
- Difficulty with dynamic color coding
- Visual difficulty meter (1-3 bars)
- Favorite toggle button

### RecipeGrid
- Loads user's favorites
- Implements optimistic UI updates
- Supports toggle add/remove from any card

### ProtectedRoute
Client-side route protection:
- Checks authentication state
- Redirects to login if unauthorized
- Shows loading spinner while verifying

### AuthForm
Flexible form component for:
- Login (email + password)
- Registration (name, lastName, email, password, confirm password)

## Database Models

### User
```typescript
{
  _id: ObjectId,
  name: string,
  lastName: string,
  email: string (unique),
  password: string (hashed),
  createdAt: Date
}
```

### Recipe
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  image: string (URL),
  ingredients: string[],
  steps: string[],
  servings: number,
  preparationTime: number (minutes),
  difficulty: "Facil" | "Media" | "Dificil"
}
```

### Favorite
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  recipeId: ObjectId,
  createdAt: Date
}
```
Unique compound index on `(userId, recipeId)`

## Authentication Flow

1. **Registration:**
   - User submits form
   - Password hashed with bcryptjs (salt: 12)
   - User created in MongoDB
   - Welcome email sent via Nodemailer
   - JWT token created and set as HttpOnly cookie
   - Redirect to home

2. **Login:**
   - User submits credentials
   - Password verified against hash
   - JWT token generated
   - Token stored in HttpOnly, Secure (production) cookie
   - Valid for 7 days

3. **Protected Access:**
   - Middleware checks token on `/favorites` requests
   - Unauthenticated requests redirect to `/login?redirect=/favorites`
   - Token verified on each API request

## Email Configuration

The app sends welcome emails using Nodemailer. To enable:

1. **Gmail (recommended):**
   - Enable 2-step verification
   - Create an [App Password](https://myaccount.google.com/apppasswords)
   - Use the app password in `SMTP_PASS`

2. **.env.local:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx
   SMTP_FROM=Your App <noreply@example.com>
   ```

3. **Without SMTP:** Emails log to console (development)

## Development

### Hot Reload
Next.js automatically reloads on file changes. Check terminal for compilation status.

### TypeScript Checking
The build step includes type checking. Fix any errors before deploying.

### Database Connection Issues
- Verify `MONGODB_URI` format
- Check network/firewall access
- Use connection string without `&retryWrites=true` if experiencing DNS errors

### Seeding Data
If recipes don't appear:
```bash
npm run seed
# Or manually insert recipes via MongoDB compass/Atlas UI
```

## Performance Notes

- ✅ Optimized images with MUI Box
- ✅ Database queries cached per-page
- ✅ JWT verification cached in cookies
- ✅ No N+1 queries (favorites populate recipe data)
- ✅ Lazy component loading with Suspense

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard before deploying.

### Other Platforms
Ensure Node.js 18+ support and set `.env` variables.

## License

MIT

## Author

Miguel Restrepo – [GitHub](https://github.com/MigueRestreG)