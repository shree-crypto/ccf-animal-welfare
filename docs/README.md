# CCF Animal Welfare - Documentation

Welcome to the CCF Animal Welfare project documentation. This guide will help you understand, maintain, and extend the application.

## Documentation Overview

### For New Developers

Start here to get up and running:

1. **[Setup Guide](SETUP_GUIDE.md)** - Complete setup instructions for local development and production deployment
2. **[Developer Guide](DEVELOPER_GUIDE.md)** - Project overview, technology stack, and architecture
3. **[Conventions](CONVENTIONS.md)** - Code conventions and best practices

### Architecture Documentation

Deep dive into the application architecture:

4. **[Frontend Architecture](FRONTEND_ARCHITECTURE.md)** - Pages, components, state management, and UI patterns
5. **[Backend Architecture](BACKEND_ARCHITECTURE.md)** - Database operations, authentication, storage, and real-time features
6. **[Database Schema](DATABASE_SCHEMA.md)** - Complete database schema with collections, indexes, and relationships

### Specialized Guides

7. **[Query Optimization](QUERY_OPTIMIZATION.md)** - Database indexing and query performance optimization
8. **[Quick Reference](QUICK_REFERENCE.md)** - Code snippets and examples for common operations

## Quick Start

### I want to...

**...set up the project locally**
→ Follow [Setup Guide](SETUP_GUIDE.md) → Local Development Setup

**...understand the project structure**
→ Read [Developer Guide](DEVELOPER_GUIDE.md) → Project Structure

**...add a new page**
→ Read [Frontend Architecture](FRONTEND_ARCHITECTURE.md) → Page Structure

**...add a new database collection**
→ Read [Database Schema](DATABASE_SCHEMA.md) → Collections

**...understand authentication**
→ Read [Backend Architecture](BACKEND_ARCHITECTURE.md) → Authentication

**...optimize a slow query**
→ Read [Query Optimization](QUERY_OPTIMIZATION.md)

**...follow code conventions**
→ Read [Conventions](CONVENTIONS.md)

**...deploy to production**
→ Follow [Setup Guide](SETUP_GUIDE.md) → Production Deployment

## Project Structure

```
ccf-animal-welfare/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   ├── components/       # React components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Business logic and utilities
│   ├── types/            # TypeScript type definitions
│   └── test/             # Test files
├── docs/                 # Documentation (you are here)
├── public/               # Static assets
└── [config files]        # Configuration files
```

## Technology Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend**: Appwrite (BaaS)
- **UI Components**: Shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod
- **Maps**: React Leaflet
- **Testing**: Vitest

## Key Features

### Public Features
- Animal gallery with filtering
- Interactive territory maps
- Success stories
- Contact and donation pages

### Volunteer Features
- Dashboard with task overview
- Task management and scheduling
- Medical records access
- Real-time notifications

### Admin Features
- Complete animal database management
- Bulk operations
- User management
- System configuration

## Common Tasks

### Adding a New Feature

1. **Plan the feature**
   - Define requirements
   - Design database schema
   - Plan UI/UX

2. **Create database operations**
   - Add types in `src/types/`
   - Create validation schema in `src/lib/validations/`
   - Implement CRUD operations in `src/lib/db/`

3. **Build the UI**
   - Create page in `src/app/`
   - Build components in `src/components/features/`
   - Add forms with validation

4. **Test**
   - Write unit tests for validation
   - Write integration tests for database operations
   - Test UI manually

5. **Document**
   - Update relevant documentation
   - Add comments to complex code
   - Update README if needed

### Modifying Existing Features

1. **Understand current implementation**
   - Read relevant documentation
   - Review existing code
   - Check database schema

2. **Make changes**
   - Update types if needed
   - Modify validation schemas
   - Update database operations
   - Modify UI components

3. **Test thoroughly**
   - Run existing tests
   - Add new tests if needed
   - Manual testing

4. **Update documentation**
   - Update affected documentation
   - Add migration notes if needed

## Development Workflow

### Daily Development

```bash
# Start Appwrite
docker-compose up -d

# Start development server
npm run dev

# In another terminal, run tests
npm test -- --watch

# Check code quality
npm run lint
npm run format:check
```

### Before Committing

```bash
# Format code
npm run format

# Fix linting issues
npm run lint:fix

# Run tests
npm test

# Type check
npx tsc --noEmit

# Build to verify
npm run build
```

### Code Review Checklist

- [ ] Code follows conventions
- [ ] Types are properly defined
- [ ] Validation schemas are updated
- [ ] Database operations are optimized
- [ ] UI is responsive and accessible
- [ ] Error handling is implemented
- [ ] Tests are added/updated
- [ ] Documentation is updated

## Troubleshooting

### Common Issues

**Build fails**
→ Check [Setup Guide](SETUP_GUIDE.md) → Troubleshooting → Build Fails

**Database queries slow**
→ Check [Query Optimization](QUERY_OPTIMIZATION.md)

**Authentication not working**
→ Check [Setup Guide](SETUP_GUIDE.md) → Troubleshooting → Authentication

**Real-time features not working**
→ Check [Backend Architecture](BACKEND_ARCHITECTURE.md) → Real-time Features

## Best Practices

### Code Quality
- Follow TypeScript strict mode
- Use Zod for validation
- Write meaningful comments
- Keep functions small and focused

### Performance
- Use proper indexes for queries
- Implement pagination
- Optimize images
- Use React Compiler

### Security
- Validate all inputs
- Use proper permissions
- Never expose secrets
- Follow authentication best practices

### Accessibility
- Use semantic HTML
- Provide ARIA labels
- Ensure keyboard navigation
- Test with screen readers

## Contributing

### Before Starting
1. Read all documentation
2. Set up local environment
3. Understand the codebase
4. Check existing issues

### Development Process
1. Create feature branch
2. Make changes following conventions
3. Write/update tests
4. Update documentation
5. Submit pull request

### Pull Request Guidelines
- Clear description of changes
- Reference related issues
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation

## Resources

### Internal Documentation
- [Developer Guide](DEVELOPER_GUIDE.md)
- [Frontend Architecture](FRONTEND_ARCHITECTURE.md)
- [Backend Architecture](BACKEND_ARCHITECTURE.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Conventions](CONVENTIONS.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Query Optimization](QUERY_OPTIMIZATION.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Appwrite Documentation](https://appwrite.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)

## Support

### Getting Help
1. Check documentation
2. Review error logs
3. Search existing issues
4. Ask the development team

### Reporting Issues
- Provide clear description
- Include error messages
- Share reproduction steps
- Attach screenshots if relevant

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and optimize queries
- Clean up expired data
- Monitor performance
- Review security

### Long-term Maintenance
- Keep documentation updated
- Refactor as needed
- Improve test coverage
- Optimize performance
- Enhance features

## Version History

### Current Version
- Next.js 14 with App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Appwrite 1.4+

### Upgrade Notes
When upgrading major dependencies:
1. Review breaking changes
2. Update code accordingly
3. Test thoroughly
4. Update documentation
5. Communicate changes to team

## License

[Add license information here]

## Contact

[Add contact information here]

---

**Last Updated**: [Current Date]

**Maintained By**: CCF Development Team
