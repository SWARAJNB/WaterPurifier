# Render Environment Variables

Copy these keys and your respective values into your Render service dashboard under **Environment**.

| Key | Example / Instructions |
| :--- | :--- |
| **MONGODB_URI** | `mongodb+srv://<user>:<password>@cluster.mongodb.net/waterpurifier` |
| **JWT_SECRET** | `your_long_random_secret_string` |
| **CORS_ORIGINS** | `https://your-vercel-app.vercel.app` (Add your frontend URL here) |
| **CLOUDINARY_CLOUD_NAME** | `your_cloud_name` |
| **CLOUDINARY_API_KEY** | `your_api_key` |
| **CLOUDINARY_API_SECRET** | `your_api_secret` |
| **NODE_ENV** | `production` |
| **PYTHON_VERSION** | `3.11.0` |

### 🛠️ Important Notes for Render:
1. **Start Command**: Ensure your Render start command is:  
   `uvicorn main:app --host 0.0.0.0 --port 5000`
2. **Environment**: We use `MONGODB_URI` in the Python code instead of `MONGO_URI` for consistency with standard drivers.
3. **CORS**: The value in `CORS_ORIGINS` must match your Vercel URL exactly (no trailing slash).
