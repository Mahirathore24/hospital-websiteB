# 🏥 Hospital Website - Complete Setup Instructions

## ❌ Fixing "NetworkError when attempting to fetch resource"

This error means the **backend server is not running**. Follow these steps:

## 🚀 Quick Start (Easiest Way)

### Option 1: Automatic Start Script
```bash
cd /home/sama/Desktop/hospital/hospital-website
./start.sh
```

This will:
- Start MongoDB (if installed locally)
- Start backend server on port 5000
- Start frontend dev server

---

## 📋 Manual Setup (Step by Step)

### Step 1: Install & Start MongoDB

**Option A - Local MongoDB:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Check if running:
sudo systemctl status mongodb
```

**Option B - MongoDB Atlas (Cloud/Free):**
1. Go to https://mongodb.com/cloud/atlas
2. Create free account & cluster
3. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/`)
4. Whitelist your IP address in Atlas dashboard

### Step 2: Configure Backend

```bash
cd /home/sama/Desktop/hospital/hospital-website/backend

# Create .env file:
cat > .env << 'EOF'
MONGO_URI=mongodb://localhost:27017/medicare
JWT_SECRET=my-super-secret-jwt-key-12345
PORT=5000
EOF

# For MongoDB Atlas, use:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medicare
```

### Step 3: Install Backend Dependencies

```bash
cd /home/sama/Desktop/hospital/hospital-website/backend
npm install
```

### Step 4: Start Backend Server

```bash
cd /home/sama/Desktop/hospital/hospital-website/backend
npm start
```

You should see:
```
Server running on http://localhost:5000
Connected to MongoDB
Seeded doctors
```

### Step 5: Start Frontend (New Terminal)

```bash
cd /home/sama/Desktop/hospital/hospital-website/frontend
npm install
npm run dev
```

Frontend should open at: http://localhost:5173

---

## ✅ Verify Everything Works

1. **Check Backend:** Open http://localhost:5000/api/doctors
   - Should return JSON with list of doctors
   
2. **Check Frontend:** Open http://localhost:5173
   - Navigate to Login/Signup
   - No "NetworkError" should appear

3. **Test Signup:**
   - Go to http://localhost:5173/signup
   - Create account with any email/password
   - Should redirect to profile page

---

## 🐛 Troubleshooting

### "ECONNREFUSED" or "NetworkError"
- ✅ Backend is not running → Run `npm start` in backend folder
- ✅ Wrong port → Check backend console for actual port
- ✅ MongoDB not connected → Check MongoDB is running

### "MongoDB connection error"
```bash
# Check MongoDB status:
sudo systemctl status mongodb

# Start MongoDB if stopped:
sudo systemctl start mongodb

# View MongoDB logs:
sudo journalctl -u mongodb -n 50
```

### "Port 5000 already in use"
```bash
# Find what's using port 5000:
lsof -i :5000

# Kill the process:
kill -9 <PID>

# Or use different port in backend/.env:
PORT=5001
```

### Frontend can't connect after backend starts
- Check `frontend/vite.config.mjs` → proxy should point to correct backend port
- Restart frontend dev server after changing proxy config

---

## 📦 Project Structure

```
hospital-website/
├── backend/              # Node.js + Express + MongoDB
│   ├── models/          # Mongoose schemas
│   ├── server.js        # Main server file
│   ├── .env            # Environment variables (create this!)
│   └── package.json
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── pages/      # React pages
│   │   ├── components/ # Reusable components
│   │   └── api.js      # API helper
│   └── package.json
└── start.sh            # Quick start script
```

---

## 🎯 What Each Component Does

- **MongoDB** → Stores users, doctors, appointments
- **Backend (Port 5000)** → API server, handles login/signup/data
- **Frontend (Port 5173)** → React UI, makes requests to backend

---

## 📱 After Setup

Once everything is running:

1. **Create Account:** http://localhost:5173/signup
2. **Browse Doctors:** http://localhost:5173/doctors  
3. **Book Appointment:** Click "Book" on any doctor
4. **View Profile:** http://localhost:5173/profile

---

## 🔐 Security Notes

- Change `JWT_SECRET` in `.env` before production
- Never commit `.env` file to GitHub
- Use strong MongoDB password for Atlas

---

## 📞 Need Help?

Check server console logs for detailed error messages:
- Backend logs: Terminal where `npm start` is running
- Frontend logs: Browser Developer Console (F12)

---

Made with ❤️ for MediCare+ Hospital
