# Hospital Website Backend Setup Guide

## Prerequisites
- Node.js installed (v14 or higher)
- MongoDB installed locally OR MongoDB Atlas account

## Step 1: Install MongoDB

### Option A: Local MongoDB (Recommended for development)
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Windows
# Download from: https://www.mongodb.com/try/download/community
```

### Option B: MongoDB Atlas (Cloud - Free tier available)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your settings:

```env
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/medicare

# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medicare

JWT_SECRET=your-secret-key-here
PORT=5000
```

## Step 3: Install Dependencies & Start Server

```bash
cd backend
npm install
npm start
```

Server should start at: **http://localhost:5000**

## Step 4: Verify Backend is Running

Open browser and visit:
- http://localhost:5000/api/doctors - Should return list of doctors

## Step 5: Start Frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend should start at: **http://localhost:5173** (or the port Vite assigns)

## Troubleshooting

### "NetworkError when attempting to fetch resource"
- ✅ Ensure backend is running on port 5000
- ✅ Check MongoDB is connected (see server console logs)
- ✅ Verify `.env` file exists with correct MONGO_URI

### "MongoDB connection error"
- ✅ If using local MongoDB: `sudo service mongodb start` (Linux) or `brew services start mongodb-community` (Mac)
- ✅ If using Atlas: Check connection string and whitelist your IP

### Port 5000 already in use
- Change PORT in `.env` to another port (e.g., 5001)
- Update frontend `vite.config.mjs` proxy target accordingly

## API Endpoints

- `POST /api/signup` - Create new user
- `POST /api/login` - User login
- `GET /api/doctors` - Get all doctors
- `POST /api/appointments` - Create appointment
- `POST /api/contact` - Submit contact form
- `GET /api/appointments` - Get all appointments (protected)

## Default Test User (after first signup)
- Email: test@example.com
- Password: (whatever you set during signup)

---

For production deployment, update MONGO_URI and JWT_SECRET with secure values.
