# Production Deployment Guide

## MongoDB Atlas Setup

Your backend is already configured to use MongoDB Atlas! The connection is handled via environment variables.

### Database Configuration
- **File:** `server/src/config/database.js`
- **Environment Variable:** `MONGODB_URI`
- **Features:** Serverless-optimized with connection caching

## Deployment to Vercel

### Backend Deployment

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`

### Frontend Deployment

1. **Navigate back to root:**
   ```bash
   cd ..
   ```

2. **Update production backend URL in `.env.production`** (if different from current):
   ```env
   # If your backend deploys to a different URL, set it here
   VITE_API_URL=https://your-backend.vercel.app
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

## Environment Variables Summary

### Development (.env.development)
```env
VITE_API_URL=http://localhost:5000
```

### Production
The frontend uses the hardcoded production URL in `services/api.ts`:
- `https://video-website-rxsu.vercel.app/api`

You can override this by setting `VITE_API_URL` in Vercel if needed.

### Backend (.env)
```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

## Running Locally

### Development Mode (Both Servers)
```bash
npm run dev:all
```

This starts:
- **Frontend:** http://localhost:3000 (Vite)
- **Backend:** http://localhost:5000 (Express)

### Frontend Only
```bash
npm run dev
```

### Backend Only
```bash
npm run server
```

## Verifying Production

After deployment, test:

1. ✅ Visit your production URL
2. ✅ Navigate to `/anwar` admin panel
3. ✅ Add a video with related videos
4. ✅ Check MongoDB Atlas to verify data is saved
5. ✅ View homepage to verify related videos display

## Important Notes

- **MongoDB Atlas:** Both development and production use the **same MongoDB Atlas database**
- **IP Whitelist:** Ensure MongoDB Atlas allows connections from Vercel (use `0.0.0.0/0` or Vercel IPs)
- **Environment Variables:** Never commit `.env` files with real credentials
- **Related Videos:** The `relatedVideos` field is already in your schema and ready for production
