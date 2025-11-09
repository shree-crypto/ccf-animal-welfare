# CCF Animal Welfare Website

A comprehensive digital platform for the Committee for Campus Fauna (CCF) at IIT Roorkee to streamline animal care operations, enhance volunteer coordination, and provide public visibility for campus animals.

## 🚀 Integration Status

**Branch: `copilot/implement-integration`** - Phase 3 Frontend Integration Complete

New pages and features are now integrated and ready for backend API hookup:
- ✅ Emergency Alerts System (`/emergency`)
- ✅ Community Reporting Portal (`/report`)  
- ✅ Behavior Tracking (Animal Detail Pages)
- ✅ QR Code Generation (Animal Detail Pages)
- ✅ Volunteer Impact Dashboard (Profile Page)

See `IMPLEMENTATION_PROGRESS.md` for details.

## Features

### Core Features
- **Public Animal Gallery**: Browse animal profiles with beautiful card layouts and detailed information
- **Interactive Territory Maps**: Visualize pack locations and territories with heatmap overlays
- **Volunteer Dashboard**: Collaborative scheduling and task management for volunteers
- **Medical Records Management**: Digital health documentation and veterinary care tracking
- **Notification System**: Automated reminders and real-time updates for volunteers
- **Admin Dashboard**: Comprehensive animal database management with bulk operations
- **Public Information Pages**: Mission, contact, success stories, and volunteer recruitment
- **Theme Switcher**: Toggle between vibrant custom theme and clean default theme with persistent preferences

### Innovative Features 🆕
- **Animal Behavior & Temperament Tracking**: Track personality traits, compatibility, and special needs for safer interactions
- **Volunteer Hours & Impact Dashboard**: Gamification with badges, milestones, and visual impact tracking
- **Emergency Alert System**: Quick response system for urgent situations with priority levels and real-time notifications
- **QR Code Animal Profiles**: Generate scannable QR codes for instant access to animal information
- **Community Reporting Portal**: Allow public to report sightings, concerns, or issues with campus animals

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI Framework**: Aceternity UI + Shadcn/ui with Tailwind CSS
- **Backend**: Appwrite (self-hosted on AWS)
- **Database**: Appwrite Database with real-time subscriptions
- **Storage**: AWS S3 via Appwrite Storage
- **Maps**: React Leaflet with OpenStreetMap
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local Appwrite instance)
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ccf-animal-welfare
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Appwrite configuration:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
```

4. Start local Appwrite instance:

```bash
docker-compose up -d
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Documentation

Comprehensive documentation is available in the [docs](./docs) folder:

### For New Developers

- **[Setup Guide](./docs/SETUP_GUIDE.md)** - Complete setup instructions for local development and production
- **[Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Project overview, technology stack, and architecture
- **[Conventions](./docs/CONVENTIONS.md)** - Code conventions and best practices to follow
- **[New Features Guide](./docs/NEW_FEATURES.md)** - Documentation for innovative features added to the platform

### Architecture Documentation

- **[Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md)** - Pages, components, state management, and UI patterns
- **[Backend Architecture](./docs/BACKEND_ARCHITECTURE.md)** - Database operations, authentication, storage, and real-time features
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** - Complete database schema with collections, indexes, and relationships

### Specialized Guides

- **[Query Optimization](./docs/QUERY_OPTIMIZATION.md)** - Database indexing and query performance optimization
- **[Theme Switcher Guide](./docs/THEME_SWITCHER_GUIDE.md)** - Complete guide to using and customizing themes
- **[Theme Customization](./docs/THEME_CUSTOMIZATION_GUIDE.md)** - Quick reference for theme customization

See [docs/README.md](./docs/README.md) for the complete documentation index and quick navigation guide.

## Project Structure

```
ccf-animal-welfare/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── features/     # Feature-specific components
│   │   ├── layout/       # Layout components (Header, Footer)
│   │   └── ui/           # Reusable UI components (Shadcn/ui)
│   ├── contexts/         # React contexts (Auth, Notifications)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── constants/    # Constants and configuration
│   │   ├── db/           # Database operations
│   │   ├── notifications/# Notification utilities
│   │   ├── storage/      # File storage utilities
│   │   ├── utils/        # General utilities
│   │   └── validations/  # Zod validation schemas
│   └── types/            # TypeScript type definitions
├── docs/                 # Documentation
├── public/               # Static assets
└── docker-compose.yml    # Appwrite local setup
```

## Theme Switcher

CampusPaws includes a powerful theme switcher that allows users to toggle between two distinct visual experiences:

### Available Themes

#### 🎨 Custom Theme (Default)

The vibrant CampusPaws branding theme featuring:

- Colorful gradients and animations
- Aceternity UI effects (sparkles, beams, animated gradients)
- Rich visual design with custom color palette
- Enhanced user engagement through dynamic effects

#### 🎯 Default Theme

A clean, minimal theme featuring:

- Standard shadcn/ui styling
- Neutral color palette
- No decorative effects
- Professional, distraction-free interface

### Key Features

- **Persistent Preferences**: Theme selection is saved in localStorage and persists across page reloads
- **Seamless Switching**: Instant theme changes without page refresh
- **Dark Mode Compatible**: Works alongside dark mode toggle
- **Accessibility**: Both themes maintain WCAG 2.1 AA contrast ratios
- **Performance Optimized**: Conditional loading of theme-specific assets

### Usage

The theme switcher is located in the header navigation. Simply click the dropdown to select your preferred theme.

For developers:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, config } = useTheme();

  // Switch theme
  setTheme('default');

  // Check if effects are enabled
  if (config.effects.gradients) {
    // Render gradient background
  }
}
```

### Documentation

- **[Complete Theme Guide](./docs/THEME_SWITCHER_GUIDE.md)** - Comprehensive guide covering usage, architecture, and customization
- **[Quick Customization Reference](./docs/THEME_CUSTOMIZATION_GUIDE.md)** - Quick reference for common customizations

### Theme Comparison

| Feature            | Custom Theme      | Default Theme    |
| ------------------ | ----------------- | ---------------- |
| Gradients          | ✅ Enabled        | ❌ Disabled      |
| Animations         | ✅ Enabled        | ❌ Disabled      |
| Aceternity Effects | ✅ Enabled        | ❌ Disabled      |
| Color Palette      | Vibrant           | Neutral          |
| Visual Style       | Dynamic           | Minimal          |
| Best For           | Public engagement | Professional use |

## Development

### Code Quality

The project uses:

- **ESLint**: Code linting with Next.js and Prettier configs
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Zod**: Runtime validation

Run linting:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Next.js Application

- Deploy to Vercel, AWS Amplify, or similar platforms
- Configure environment variables for production Appwrite instance

### Appwrite Backend

- Deploy Appwrite on AWS EC2/ECS or DigitalOcean
- Configure production database, storage, and functions
- Set up SSL certificates and custom domain

See [docs](./docs) for detailed deployment guides.

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the code style
3. Update documentation in the `docs` folder
4. Test your changes thoroughly
5. Submit a pull request

## License

[Add your license here]

## Contact

Committee for Campus Fauna (CCF)
IIT Roorkee

[Add contact information]
