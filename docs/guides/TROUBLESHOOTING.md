# Troubleshooting Guide

## Mock Authentication Issues

### Problem: Cannot login with mock credentials

**Symptoms:**

- Login form shows "Invalid credentials" error
- Console shows Appwrite connection errors

**Solution:**

1. **Check browser console** for these messages:
   ```
   ✅ Mock auth successful: admin@ccf.dev
   ```
2. **Verify credentials exactly**:
   - Email: `admin@ccf.dev` (not .com)
   - Password: `admin123` (case-sensitive)

3. **Check NODE_ENV**:

   ```javascript
   console.log(process.env.NODE_ENV); // Should be 'development'
   ```

4. **Clear localStorage and try again**:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### Problem: Logged in but cannot access dashboard

**Symptoms:**

- Login successful
- Redirected back to login page
- Or stuck on loading screen

**Debugging Steps:**

1. **Check browser console** for these logs:

   ```
   🔐 Attempting login for: admin@ccf.dev
   ✅ Mock auth successful: admin@ccf.dev
   ✅ Login successful, checking user...
   🔍 Checking user...
   👤 Current user: admin@ccf.dev
   🎭 User role: admin
   ✅ User set in context: admin@ccf.dev admin
   ```

2. **Check localStorage**:
   - Open DevTools → Application → Local Storage
   - Look for key: `ccf_mock_session`
   - Should contain JSON with user data including `role`

3. **Check AuthDebug component** (bottom-right corner):
   - Should show: "User: ✅ Logged in"
   - Should show your email and role

4. **If user is null after login**:

   ```javascript
   // In console, check:
   localStorage.getItem('ccf_mock_session');
   // Should return user data
   ```

5. **Force refresh after login**:
   - Sometimes the context doesn't update immediately
   - Try refreshing the page (F5)

### Problem: Territory map not showing

**Symptoms:**

- Map shows "No territories found"
- Empty map with no polygons
- Map container is blank or shows only base tiles

**Debugging Steps:**

1. **Check console logs** for:

   ```
   📍 Using mock territories data
   🗺️ Map mounted with 6 territories
   ```

2. **Verify territories are loaded**:
   - Open browser console
   - Should see 6 mock territories
   - Check: territories array is not empty

3. **Check for JavaScript errors**:
   - Open console (F12)
   - Look for red error messages
   - Common errors:
     - "Cannot read property of undefined"
     - "Leaflet is not defined"
     - "heatLayer is not a function"

4. **Verify Leaflet CSS is loaded**:
   - Check Network tab for `leaflet.css`
   - Should load from CDN or node_modules
   - Map tiles won't show without CSS

5. **Check map container height**:
   - Map needs explicit height to render
   - Inspect element: should have `min-height: 500px`
   - Parent containers must not have `height: 0`

6. **Test without heatmap**:
   - Uncheck "Show Heatmap" toggle
   - If map works without heatmap, it's a heatmap issue
   - Heatmap now uses CircleMarkers (no plugin required)

7. **Hard refresh**:
   - Clear cache: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

**If map still doesn't show:**

```javascript
// In browser console, check:
console.log(window.L); // Should show Leaflet object
console.log(document.querySelector('.leaflet-container')); // Should find map element
```

### Problem: Heatmap toggle causes error

**Symptoms:**

- Error when clicking "Show Heatmap" checkbox
- Console shows "heatLayer is not a function"

**Solution:**

- The heatmap has been updated to use CircleMarkers instead of leaflet.heat plugin
- No additional installation required
- If you see this error, refresh the page to load the updated component

## Common Issues

### Issue: "Failed to compile" errors

**Solution:**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Issue: TypeScript errors

**Solution:**

```bash
# Check for type errors
npm run type-check

# If errors persist, restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Issue: Styles not loading

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: Mock data not working

**Check:**

1. `NODE_ENV=development` is set
2. No `NEXT_PUBLIC_USE_MOCK_DATA=false` in .env
3. Console shows mock data logs

## Development Checklist

Before reporting an issue, verify:

- [ ] Running `npm run dev` (not build)
- [ ] Browser console is open to see logs
- [ ] Using correct mock credentials
- [ ] localStorage is not full/corrupted
- [ ] No browser extensions blocking localStorage
- [ ] Using a modern browser (Chrome, Firefox, Edge, Safari)
- [ ] Node.js version is 18+ (`node --version`)

## Getting Help

If issues persist:

1. **Check console logs** - Most issues show clear error messages
2. **Clear all caches** - localStorage, browser cache, .next folder
3. **Try incognito mode** - Rules out extension conflicts
4. **Check this file** - Solutions for common issues are here

## Debug Mode

Enable verbose logging:

```javascript
// In browser console
localStorage.setItem('DEBUG', 'true');
location.reload();
```

This will show detailed logs for:

- Authentication flow
- API calls
- Mock data usage
- Route protection
