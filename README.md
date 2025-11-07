# CCF Animal Welfare Website

A comprehensive digital platform for the Committee for Campus Fauna (CCF) at IIT Roorkee to streamline animal care operations, enhance volunteer coordination, and provide public visibility for campus animals.

## Features

- **Public Animal Gallery**: Browse animal profiles with beautiful card layouts and detailed information
- **Interactive Territory Maps**: Visualize pack locations and territories with heatmap overlays
- **Volunteer Dashboard**: Collaborative scheduling and task management for volunteers
- **Medical Records Management**: Digital health documentation and veterinary care tracking
- **Notification System**: Automated reminders and real-time updates for volunteers
- **Admin Dashboard**: Comprehensive animal database management with bulk operations
- **Public Information Pages**: Mission, contact, success stories, and volunteer recruitment

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

### Architecture Documentation
- **[Frontend Architecture](./docs/FRONTEND_ARCHITECTURE.md)** - Pages, components, state management, and UI patterns
- **[Backend Architecture](./docs/BACKEND_ARCHITECTURE.md)** - Database operations, authentication, storage, and real-time features
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** - Complete database schema with collections, indexes, and relationships

### Specialized Guides
- **[Query Optimization](./docs/QUERY_OPTIMIZATION.md)** - Database indexing and query performance optimization

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
