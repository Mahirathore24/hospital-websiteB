# 🏥 Hospital Website Backend

Node.js + Express + MongoDB backend for the Hospital Management System.

## 🚨 Fixing "NetworkError when attempting to fetch resource"

This error means **MongoDB is not connected** or **backend is not running**. Follow the setup below:

---

## ⚡ Quick Start

### 1. Install MongoDB

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download from: https://www.mongodb.com/try/download/community

### 2. Configure Environment

```bash
# Create .env file:
cat > .env << 'EOF'
MONGO_URI=mongodb://localhost:27017/medicare
JWT_SECRET=your-secret-key-change-this
PORT=5000
EOF
```

**Or use MongoDB Atlas (Cloud - Free):**
- Get free cluster at https://mongodb.com/cloud/atlas
- Update `MONGO_URI` with your Atlas connection string

### 3. Install & Run

```bash
npm install
npm start
```

✅ You should see:
```
Server running on http://localhost:5000
Connected to MongoDB
Seeded doctors
```

### 4. Verify Backend Works

Open: http://localhost:5000/api/doctors

Should return JSON with list of doctors.

---

## 📂 Project Structure

```
backend/
├── models/              # Mongoose schemas
│   ├── User.js         # User authentication
│   ├── Doctor.js       # Doctor information
│   ├── Appointment.js  # Appointments
│   └── Contact.js      # Contact form submissions
├── server.js           # Main Express server
├── .env               # Environment variables (create this!)
├── .env.example       # Template for .env
├── SETUP.md           # Detailed setup guide
└── package.json       # Dependencies
```

---

## 🔌 API Endpoints

### Public Endpoints
- `POST /api/signup` - Create new user account
- `POST /api/login` - User login (returns JWT token)
- `GET /api/doctors` - Get list of all doctors
- `POST /api/appointments` - Create appointment
- `POST /api/contact` - Submit contact form

### Protected Endpoints (require JWT token)
- `GET /api/appointments` - Get all appointments (admin)

---

## 🔧 Environment Variables

Create `.env` file with:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/medicare

# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/medicare

# JWT Secret (change in production!)
JWT_SECRET=your-random-secret-key

# Server Port
PORT=5000
```

---

## 🐛 Troubleshooting

### "MongoDB connection error"
```bash
# Check MongoDB is running:
sudo systemctl status mongodb

# Start MongoDB:
sudo systemctl start mongodb

# View logs:
sudo journalctl -u mongodb -n 50
```

### "Port 5000 already in use"
```bash
# Find process using port 5000:
lsof -i :5000

# Kill it:
kill -9 <PID>

# Or change PORT in .env
```

### Frontend shows "NetworkError"
1. ✅ Ensure this backend is running (`npm start`)
2. ✅ Check MongoDB is connected (see console output)
3. ✅ Verify `.env` file exists with correct `MONGO_URI`
4. ✅ Backend should be accessible at http://localhost:5000

---

## 📚 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - Cross-origin requests
- **nodemon** - Development auto-restart

---

## 🔐 Security Notes

- Never commit `.env` file to Git (already in .gitignore)
- Change `JWT_SECRET` before production deployment
- Use strong passwords for MongoDB Atlas
- Enable MongoDB authentication in production

---

## 📖 Full Documentation

For complete setup instructions including:
- MongoDB Atlas cloud setup
- Frontend integration
- Automated deployment
- Troubleshooting guide

See: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🚀 Quick Start Script

Automated setup (Linux/Mac):
```bash
./start.sh
```

This will:
- Check/start MongoDB
- Create .env from template
- Install dependencies
- Start backend server
- Start frontend dev server (if available)

---

## 🧪 Testing the API

### Test Signup:
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Doctors:
```bash
curl http://localhost:5000/api/doctors
```

---

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🔗 Related Repositories

- **Frontend:** https://github.com/Mahirathore24/hospital-website-F
- **Backend:** https://github.com/Mahirathore24/hospital-websiteB (this repo)

---

## 📞 Support

If you encounter issues:

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed troubleshooting
2. Verify MongoDB is running: `sudo systemctl status mongodb`
3. Check server logs for error messages
4. Ensure `.env` file exists with correct configuration

---

Made with ❤️ for MediCare+ Hospital Management System
