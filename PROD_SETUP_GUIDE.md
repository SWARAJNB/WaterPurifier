# Production Deployment & Google Visibility Guide

This guide covers the necessary steps to take your project live and ensure it ranks on Google.

## 1. Cloud Deployment Setup

### Frontend (Vercel)
1. Push your code to a GitHub repository.
2. Connect the repo to **Vercel**.
3. Set environment variables:
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g., `https://api.aquapure.com/api`).
4. Vercel will automatically use the `vercel.json` file for headers and routing.

### Backend (Render)
1. Connect the repo to **Render**.
2. Select **Web Service**.
3. Render will detect `render.yaml` and prompt you to fill in missing environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: (Should be pre-generated, or use a strong 64-character hex string).
   - `CORS_ORIGINS`: Your Vercel frontend URL.
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary Cloud Name.
   - `CLOUDINARY_API_KEY`: Your Cloudinary API Key.
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API Secret.

> [!TIP]
> Get your Cloudinary keys from the [Cloudinary Dashboard](https://cloudinary.com/console). These are required for product image and offer banner uploads.

---

## 2. Google Search Console (SEO Visibility)
*This tells Google your site exists and helps you track performance.*

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add a **New Property** and enter your custom domain.
3. Choose **DNS verification** (preferred) or **HTML file** (upload to your frontend `public` folder).
4. Once verified, go to **Sitemaps** in the sidebar.
5. Enter `sitemap.xml` and click **Submit**.
6. Google will now begin crawling your pages.

---

## 3. Google Business Profile (Local Search & Maps)
*Crucial for appearing in "water purifier near me" searches.*

1. Go to [Google Business Profile](https://www.google.com/business/).
2. Create a profile for **AquaPure**.
3. Enter your business category: **Water Purification Service** or **Store**.
4. Enter your address (even if it's a home office, you can set "service areas").
5. Verify your business (usually via a postcard or phone code).
6. **Important**: Add your website URL and high-quality photos of products.

---

## 4. Performance Monitoring
*Keep your Lighthouse score above 90.*

1. Open your live site in Chrome.
2. Open DevTools -> **Lighthouse**.
3. Click "Analyze page load".
4. If scores are low, check:
   - Image sizes (ensure they aren't multi-megabyte).
   - Server response time (Render Free Tier might be slow to wake up).
