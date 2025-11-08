# ⚠️ Restart Required

## Next.js Configuration Updated

The `next.config.ts` file has been updated to allow images from Unsplash.

### What Changed

Added image configuration to allow external images from `images.unsplash.com`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
      pathname: '/**',
    },
  ],
}
```

### Action Required

**You must restart your development server for this change to take effect:**

1. Stop the current dev server (Ctrl+C or Cmd+C)
2. Restart with: `npm run dev`

### Why This Was Needed

Next.js requires explicit configuration for external image domains for security reasons. The mock animal data uses Unsplash images, so we needed to whitelist this domain.

### Adding More Image Domains

If you need to add more external image sources in the future, add them to the `remotePatterns` array in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'your-domain.com',
      port: '',
      pathname: '/**',
    },
  ],
}
```

---

**After restarting, the `/animals` page should work perfectly!** 🎉

You can delete this file once you've restarted the server.
