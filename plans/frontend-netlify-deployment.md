# Frontend Deployment to Netlify

This guide explains how to deploy your React frontend to Netlify for production.

## Current Frontend Structure

Your React application is in `/client/` directory with:
- React 18 + TypeScript + Vite
- React Router 6 for SPA routing
- TailwindCSS 3 for styling
- Netlify configuration already present (`netlify.toml`)

## 1. GitHub Repository Setup

### Create a New Repository
1. Go to GitHub and create a new repository
2. Initialize with README.md (optional but recommended)
3. Copy the repository URL

### Initialize Git in Your Project
```bash
cd "c:/Users/sxc/Downloads/multi-wallet-banking-sim-ab3 (1)"
git init
git remote add origin <your-repository-url>
git add .
git commit -m "Initial commit"
git push -u origin main
```

## 2. Netlify Deployment

### Option 1: Automatic Deployment (Recommended)

1. Go to [Netlify](https://www.netlify.com/) and create an account
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub account
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build:client`
   - Publish directory: `dist/spa`
6. Click "Deploy site"

### Option 2: Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod
```

## 3. Environment Variables

If you have environment variables, set them in Netlify:

1. Go to Site Settings > Build & deploy > Environment
2. Add variables like:
   - `VITE_API_URL`: Your API endpoint (e.g., `https://your-django-api.onrender.com`)
   - Other environment variables your app needs

## 4. Custom Domain (Optional)

1. Go to Site Settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS
4. Enable HTTPS (Netlify provides free SSL certificates)

## 5. Build Configuration

Your project already has a `netlify.toml` file:

```toml
[build]
  command = "npm run build:client"
  publish = "dist/spa"

[build.environment]
  NODE_VERSION = "18"
```

## 6. Continuous Deployment

Netlify automatically deploys your site when you push changes to GitHub:

1. Make changes to your code
2. Commit and push to GitHub
3. Netlify automatically builds and deploys the new version

## 7. Performance Optimization

### Enable Compression
Netlify automatically compresses files with Gzip and Brotli

### Caching
Netlify caches static assets by default

### CDN Distribution
Your site is distributed via Netlify's global CDN

## 8. Testing the Deployed Site

1. After deployment, Netlify will provide a URL like `https://your-site-name.netlify.app`
2. Test all functionality:
   - Navigation
   - Forms
   - API calls
   - Responsive design

## 9. Troubleshooting

### Common Issues

1. **Build fails**: Check build logs in Netlify dashboard
2. **API calls failing**: Verify API endpoint is correct and CORS is configured
3. **Page not found**: Ensure React Router routes are properly configured
4. **Assets not loading**: Check file paths and public directory

### Debugging

1. View deployment logs in Netlify dashboard
2. Check browser console for errors
3. Use Netlify's debugging tools

## 10. Connecting to Django Backend

Once your Django backend is deployed to Render, update your frontend API calls:

```typescript
// Change from
const apiUrl = 'http://localhost:8000';

// To
const apiUrl = 'https://your-django-api.onrender.com';
```

Add your Netlify URL to Django's CORS settings:

```python
CORS_ALLOWED_ORIGINS = [
    "https://your-site-name.netlify.app",
    "http://localhost:3000",
    "http://localhost:8083",
]
```

## Conclusion

Netlify provides a simple and powerful platform for hosting React applications. Your project is already configured for Netlify, so deployment should be straightforward. Follow this guide to get your frontend live, then connect it to your Django backend.
