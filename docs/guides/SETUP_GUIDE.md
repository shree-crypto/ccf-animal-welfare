# Setup and Deployment Guide

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Appwrite Configuration](#appwrite-configuration)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **Docker**: For running Appwrite locally
- **Docker Compose**: For orchestrating Appwrite services
- **Git**: For version control

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd ccf-animal-welfare
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your configuration (see [Environment Configuration](#environment-configuration))

4. **Start Appwrite**

   ```bash
   docker-compose up -d
   ```

   Wait for Appwrite to start (may take 1-2 minutes)

   Access Appwrite Console: `http://localhost`

5. **Configure Appwrite**
   Follow the [Appwrite Configuration](#appwrite-configuration) section

6. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000` in your browser

## Appwrite Configuration

### Initial Setup

1. **Access Appwrite Console**
   - Navigate to `http://localhost`
   - Create an admin account

2. **Create Project**
   - Click "Create Project"
   - Name: `CCF Animal Welfare`
   - Project ID: `ccf-animal-welfare`
   - Copy the Project ID to `.env.local`

3. **Configure Web Platform**
   - Go to Project Settings > Platforms
   - Add Web Platform
   - Name: `CCF Website`
   - Hostname: `localhost` (for development)
   - For production, add your domain

### Database Setup

1. **Create Database**
   - Navigate to Databases
   - Click "Create Database"
   - Name: `CCF Database`
   - Database ID: `ccf-database`
   - Copy the Database ID to `.env.local`

2. **Create Collections**

   Create the following collections with their attributes:

   **Animals Collection**
   - Collection ID: `animals`
   - Attributes:
     - `name` (string, required, max: 100)
     - `type` (string, required, enum: ['dog', 'cat'])
     - `age` (integer, required, min: 0, max: 30)
     - `breed` (string, optional, max: 100)
     - `location` (string, required) - JSON object
     - `currentFeeder` (string, optional)
     - `medicalHistory` (string, required) - JSON array
     - `photos` (string, required) - JSON object
     - `packId` (string, optional)
     - `status` (string, required, enum: ['healthy', 'needs_attention', 'under_treatment'])

   **Territories Collection**
   - Collection ID: `territories`
   - Attributes:
     - `name` (string, required)
     - `description` (string, optional)
     - `boundaries` (string, required) - JSON array
     - `packSize` (integer, required)
     - `assignedVolunteers` (string, required) - JSON array
     - `feedingSchedule` (string, optional) - JSON object
     - `notes` (string, optional)

   **Tasks Collection**
   - Collection ID: `tasks`
   - Attributes:
     - `title` (string, required)
     - `description` (string, optional)
     - `type` (string, required, enum: ['feeding', 'medical', 'grooming', 'monitoring', 'other'])
     - `priority` (string, required, enum: ['low', 'medium', 'high', 'urgent'])
     - `status` (string, required, enum: ['pending', 'in_progress', 'completed', 'cancelled'])
     - `scheduledDate` (string, required)
     - `scheduledTime` (string, optional)
     - `assignedTo` (string, optional)
     - `animalId` (string, optional)
     - `territoryId` (string, optional)
     - `completed` (boolean, required)
     - `completedAt` (string, optional)
     - `completedBy` (string, optional)
     - `notes` (string, optional)

   **Medical Records Collection**
   - Collection ID: `medical-records`
   - Attributes:
     - `animalId` (string, required)
     - `type` (string, required, enum: ['checkup', 'vaccination', 'treatment', 'surgery', 'emergency', 'other'])
     - `date` (string, required)
     - `veterinarian` (string, optional)
     - `diagnosis` (string, optional)
     - `treatment` (string, optional)
     - `medications` (string, optional) - JSON array
     - `notes` (string, optional)
     - `followUpRequired` (boolean, required)
     - `followUpDate` (string, optional)
     - `documents` (string, optional) - JSON array
     - `cost` (float, optional)

   **Notifications Collection**
   - Collection ID: `notifications`
   - Attributes:
     - `type` (string, required, enum: ['task_assigned', 'task_reminder', 'medical_alert', 'volunteer_update', 'system_announcement'])
     - `priority` (string, required, enum: ['low', 'medium', 'high', 'urgent'])
     - `title` (string, required)
     - `message` (string, required)
     - `recipientId` (string, required)
     - `relatedEntityId` (string, optional)
     - `relatedEntityType` (string, optional)
     - `read` (boolean, required)
     - `readAt` (string, optional)
     - `actionUrl` (string, optional)
     - `expiresAt` (string, optional)

   **Notification Preferences Collection**
   - Collection ID: `notification-preferences`
   - Attributes:
     - `userId` (string, required)
     - `emailNotifications` (boolean, required)
     - `pushNotifications` (boolean, required)
     - `taskReminders` (boolean, required)
     - `medicalAlerts` (boolean, required)
     - `volunteerUpdates` (boolean, required)
     - `systemAnnouncements` (boolean, required)
     - `dailyDigest` (boolean, required)

3. **Create Indexes**

   Run the index creation script to see all required indexes:

   ```bash
   npx tsx src/lib/setup/create-indexes.ts
   ```

   Create indexes manually in Appwrite Console or use the generated CLI commands.

   See `docs/QUERY_OPTIMIZATION.md` for detailed index information.

4. **Set Collection Permissions**

   For each collection, set permissions:

   **Animals, Territories, Medical Records, Tasks:**
   - Read: `role:all` (public can read)
   - Create: `team:volunteer-team`, `team:admin-team`
   - Update: `team:volunteer-team`, `team:admin-team`
   - Delete: `team:admin-team`

   **Notifications:**
   - Read: `user:[USER_ID]` (set dynamically per document)
   - Create: `team:volunteer-team`, `team:admin-team`
   - Update: `user:[USER_ID]`
   - Delete: `user:[USER_ID]`, `team:admin-team`

   **Notification Preferences:**
   - Read: `user:[USER_ID]`
   - Create: `user:[USER_ID]`
   - Update: `user:[USER_ID]`
   - Delete: `user:[USER_ID]`

### Storage Setup

1. **Create Storage Buckets**

   Navigate to Storage and create two buckets:

   **Animal Photos Bucket**
   - Bucket ID: `animal-photos`
   - Name: `Animal Photos`
   - Max File Size: 10 MB
   - Allowed File Extensions: `jpg`, `jpeg`, `png`, `webp`
   - Permissions:
     - Read: `role:all`
     - Create: `team:volunteer-team`, `team:admin-team`
     - Update: `team:volunteer-team`, `team:admin-team`
     - Delete: `team:admin-team`

   **Medical Documents Bucket**
   - Bucket ID: `medical-documents`
   - Name: `Medical Documents`
   - Max File Size: 10 MB
   - Allowed File Extensions: `jpg`, `jpeg`, `png`, `webp`, `pdf`, `doc`, `docx`
   - Permissions:
     - Read: `team:volunteer-team`, `team:admin-team`
     - Create: `team:volunteer-team`, `team:admin-team`
     - Update: `team:volunteer-team`, `team:admin-team`
     - Delete: `team:admin-team`

### Authentication Setup

1. **Enable Email/Password Authentication**
   - Navigate to Auth > Settings
   - Enable "Email/Password" method

2. **Create Teams**

   Navigate to Auth > Teams and create:

   **Volunteer Team**
   - Team ID: `volunteer-team`
   - Name: `Volunteers`

   **Admin Team**
   - Team ID: `admin-team`
   - Name: `Administrators`

3. **Add Users to Teams**
   - Create user accounts
   - Add users to appropriate teams
   - Admins should be in both teams

## Environment Configuration

### Environment Variables

Create `.env.local` file in the project root:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=http://localhost/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=ccf-animal-welfare

# Database
NEXT_PUBLIC_APPWRITE_DATABASE_ID=ccf-database

# Collections
NEXT_PUBLIC_APPWRITE_COLLECTION_ANIMALS=animals
NEXT_PUBLIC_APPWRITE_COLLECTION_TERRITORIES=territories
NEXT_PUBLIC_APPWRITE_COLLECTION_TASKS=tasks
NEXT_PUBLIC_APPWRITE_COLLECTION_MEDICAL_RECORDS=medical-records
NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATIONS=notifications
NEXT_PUBLIC_APPWRITE_COLLECTION_NOTIFICATION_PREFERENCES=notification-preferences

# Storage Buckets
NEXT_PUBLIC_APPWRITE_BUCKET_ANIMAL_PHOTOS=animal-photos
NEXT_PUBLIC_APPWRITE_BUCKET_MEDICAL_DOCUMENTS=medical-documents

# Teams
NEXT_PUBLIC_APPWRITE_VOLUNTEER_TEAM_ID=volunteer-team
NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID=admin-team
```

### Production Environment

For production, update the endpoint:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-domain.com/v1
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

Features in development mode:

- Hot module replacement
- Fast refresh
- Detailed error messages
- Source maps

### Production Build

```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

### Production Mode

```bash
npm start
```

Runs the production build. Must run `npm run build` first.

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npx tsc --noEmit

# Run tests
npm test
```

## Production Deployment

### Appwrite Production Setup

1. **Deploy Appwrite**

   Option 1: Self-hosted on AWS/DigitalOcean

   ```bash
   # Follow Appwrite installation guide
   # https://appwrite.io/docs/installation
   ```

   Option 2: Appwrite Cloud
   - Sign up at https://cloud.appwrite.io
   - Create project
   - Configure as per local setup

2. **Configure Domain**
   - Set up SSL certificate
   - Configure DNS
   - Update Appwrite domain settings

3. **Set Environment Variables**
   - Update production environment variables
   - Use production Appwrite endpoint
   - Keep IDs consistent with development

### Next.js Deployment

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Project Settings > Environment Variables
   - Add all environment variables from `.env.local`

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Option 2: Docker

1. **Create Dockerfile**

   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   # Build application
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 3000

   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   docker build -t ccf-animal-welfare .
   docker run -p 3000:3000 --env-file .env.local ccf-animal-welfare
   ```

#### Option 3: Traditional Server

1. **Build Application**

   ```bash
   npm run build
   ```

2. **Install PM2**

   ```bash
   npm install -g pm2
   ```

3. **Start with PM2**

   ```bash
   pm2 start npm --name "ccf-website" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Verify real-time notifications work
- [ ] Check all pages load correctly
- [ ] Test role-based access control
- [ ] Verify database queries are performant
- [ ] Check error logging
- [ ] Set up monitoring
- [ ] Configure backups

## Troubleshooting

### Common Issues

#### 1. Appwrite Connection Failed

**Error**: `fetch failed` or `ECONNREFUSED`

**Solutions**:

- Check if Appwrite is running: `docker-compose ps`
- Verify endpoint in `.env.local`
- Check firewall settings
- Restart Appwrite: `docker-compose restart`

#### 2. Authentication Not Working

**Error**: `Invalid credentials` or `Session not found`

**Solutions**:

- Verify project ID matches
- Check if email/password auth is enabled
- Clear browser cookies
- Check Appwrite console for user

#### 3. Database Queries Slow

**Solutions**:

- Verify indexes are created
- Check query patterns match indexes
- Review `docs/QUERY_OPTIMIZATION.md`
- Monitor Appwrite logs

#### 4. File Upload Fails

**Error**: `File too large` or `Invalid file type`

**Solutions**:

- Check file size (max 10 MB)
- Verify file type is allowed
- Check bucket permissions
- Verify bucket ID in `.env.local`

#### 5. Real-time Not Working

**Solutions**:

- Check WebSocket connection
- Verify collection permissions
- Check browser console for errors
- Ensure user is authenticated

#### 6. Build Fails

**Error**: TypeScript or ESLint errors

**Solutions**:

```bash
# Type check
npx tsc --noEmit

# Fix linting
npm run lint:fix

# Clear cache
rm -rf .next
npm run build
```

#### 7. Environment Variables Not Loading

**Solutions**:

- Verify `.env.local` exists
- Check variable names start with `NEXT_PUBLIC_`
- Restart development server
- Clear Next.js cache

### Debug Mode

Enable debug logging:

```typescript
// In src/lib/appwrite.ts
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Add for debugging
if (process.env.NODE_ENV === 'development') {
  client.setLogLevel('debug');
}
```

### Logs

**Appwrite Logs**:

```bash
docker-compose logs -f appwrite
```

**Next.js Logs**:

- Development: Check terminal
- Production: Check PM2 logs or hosting platform logs

### Performance Monitoring

1. **Next.js Analytics**
   - Enable in Vercel dashboard
   - Monitor Core Web Vitals

2. **Appwrite Monitoring**
   - Check Appwrite console
   - Monitor database queries
   - Check storage usage

3. **Error Tracking**
   - Set up Sentry or similar
   - Monitor error rates
   - Track user issues

## Maintenance

### Regular Tasks

**Daily**:

- Monitor error logs
- Check notification delivery
- Verify backups

**Weekly**:

- Review performance metrics
- Check storage usage
- Update content

**Monthly**:

- Update dependencies
- Review security
- Optimize database
- Clean up expired notifications

### Database Maintenance

**Cleanup Expired Notifications**:

```typescript
// Run periodically
import { cleanupExpiredNotifications } from '@/lib/db/notifications';

await cleanupExpiredNotifications();
```

**Backup Database**:

- Use Appwrite backup features
- Export critical data regularly
- Test restore procedures

### Updates

**Updating Dependencies**:

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions carefully
npm install package@latest
```

**Updating Appwrite**:

```bash
# Pull latest image
docker-compose pull

# Restart services
docker-compose up -d
```

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local`
   - Use different values for production
   - Rotate secrets regularly

2. **Authentication**
   - Enforce strong passwords
   - Enable 2FA for admins
   - Regular security audits

3. **Permissions**
   - Follow principle of least privilege
   - Review permissions regularly
   - Test access control

4. **Data Protection**
   - Regular backups
   - Encrypt sensitive data
   - Secure file uploads

5. **Monitoring**
   - Set up alerts
   - Monitor suspicious activity
   - Log security events

## Support

### Documentation

- Developer Guide: `docs/DEVELOPER_GUIDE.md`
- Frontend Architecture: `docs/FRONTEND_ARCHITECTURE.md`
- Backend Architecture: `docs/BACKEND_ARCHITECTURE.md`
- Database Schema: `docs/DATABASE_SCHEMA.md`
- Conventions: `docs/CONVENTIONS.md`
- Query Optimization: `docs/QUERY_OPTIMIZATION.md`

### Resources

- Next.js Documentation: https://nextjs.org/docs
- Appwrite Documentation: https://appwrite.io/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs

### Getting Help

- Check documentation first
- Review error logs
- Search GitHub issues
- Contact development team
