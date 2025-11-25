# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=https://the-bliss-portal-backend.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_FOLDER=products
```

## Instructions:

1. Create a `.env` file in the root directory (`/Users/sachinpadyar/Documents/TaskWork/.env`)
2. Replace `your_cloud_name` with your actual Cloudinary cloud name
3. Replace `your_upload_preset` with your actual Cloudinary upload preset
4. The `VITE_CLOUDINARY_FOLDER` is optional and defaults to 'products' if not set

## Getting Cloudinary Credentials:

1. Sign up or log in to [Cloudinary](https://cloudinary.com)
2. Go to Dashboard
3. Copy your Cloud Name
4. Go to Settings > Upload > Upload presets
5. Create or use an existing unsigned upload preset
6. Copy the preset name

## API Base URL:

The API base URL is set to `https://the-bliss-portal-backend.onrender.com`. Make sure your backend is deployed and accessible at this URL.

