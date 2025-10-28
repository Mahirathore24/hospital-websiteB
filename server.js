// Express + Mongoose backend with JWT auth
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Contact = require('./models/Contact');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medicare';
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(()=> console.log('Connected to MongoDB'))
	.catch(err=> console.error('MongoDB connection error', err));

// Helper: generate JWT
function generateToken(user){
	return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

// Auth middleware
async function auth(req,res,next){
	const header = req.headers.authorization || '';
	const token = header.split(' ')[1];
	if(!token) return res.status(401).json({ success:false, message:'Unauthorized' });
	try{
		const payload = jwt.verify(token, JWT_SECRET);
		req.user = payload;
		next();
	}catch(e){ return res.status(401).json({ success:false, message:'Invalid token' }); }
}

// Seed doctors if none exist
async function seedDoctors(){
	const count = await Doctor.countDocuments();
	if(count === 0){
		const seed = [
			{name:'Dr. Priya Sharma', specialization:'Dermatologist', experience:8, availableTimes:['09:00','10:00','14:00'], image:''},
			{name:'Dr. Raj Malhotra', specialization:'Cardiologist', experience:15, availableTimes:['09:30','11:00','15:00'], image:''},
			{name:'Dr. Neha Verma', specialization:'Neurologist', experience:12, availableTimes:['10:00','13:00','16:00'], image:''},
			{name:'Dr. Amit Singh', specialization:'Dentist', experience:9, availableTimes:['09:00','12:00','14:00'], image:''},
			{name:'Dr. Kavita Mehra', specialization:'Pediatrician', experience:7, availableTimes:['10:00','11:30','15:30'], image:''},
			{name:'Dr. Arjun Patel', specialization:'Orthopedic Surgeon', experience:20, availableTimes:['09:00','13:00','16:00'], image:''},
			{name:'Dr. Sneha Reddy', specialization:'Gynecologist', experience:11, availableTimes:['10:00','14:00','16:30'], image:''},
			{name:'Dr. Manish Kumar', specialization:'Physiotherapist', experience:6, availableTimes:['09:00','11:00','15:00'], image:''},
			{name:'Dr. Aditi Joshi', specialization:'Ophthalmologist', experience:10, availableTimes:['09:30','12:30','14:30'], image:''},
			{name:'Dr. Vikram Chauhan', specialization:'ENT Specialist', experience:13, availableTimes:['10:00','13:30','16:00'], image:''},
			{name:'Dr. Riya Das', specialization:'Psychiatrist', experience:9, availableTimes:['11:00','14:00','17:00'], image:''},
			{name:'Dr. Ankit Bansal', specialization:'Oncologist', experience:14, availableTimes:['09:00','12:00','15:00'], image:''}
		];
		await Doctor.insertMany(seed);
		console.log('Seeded doctors');
	}
}
seedDoctors().catch(e=>console.error(e));

// Routes
app.post('/api/signup', async (req,res)=>{
	try{
		const { name, email, password } = req.body || {};
		if(!name || !email || !password) return res.status(400).json({ success:false, message:'Missing fields' });
		const exists = await User.findOne({ email });
		if(exists) return res.status(409).json({ success:false, message:'Email already registered' });
		const hashed = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashed });
		const token = generateToken(user);
		return res.json({ success:true, message:'User created', token, user:{ id:user._id, name:user.name, email:user.email } });
	}catch(e){ console.error(e); return res.status(500).json({ success:false, message:'Server error' }); }
});

app.post('/api/login', async (req,res)=>{
	try{
		const { email, password } = req.body || {};
		if(!email || !password) return res.status(400).json({ success:false, message:'Missing fields' });
		const user = await User.findOne({ email });
		if(!user) return res.status(401).json({ success:false, message:'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.password);
		if(!ok) return res.status(401).json({ success:false, message:'Invalid credentials' });
		const token = generateToken(user);
		return res.json({ success:true, message:'Login successful', token, user:{ id:user._id, name:user.name, email:user.email } });
	}catch(e){ console.error(e); return res.status(500).json({ success:false, message:'Server error' }); }
});

app.get('/api/doctors', async (req,res)=>{
	try{
		const docs = await Doctor.find().lean();
		res.json({ success:true, doctors: docs });
	}catch(e){ console.error(e); res.status(500).json({ success:false, message:'Server error' }); }
});

app.post('/api/appointments', async (req,res)=>{
	try{
		const { name, email, phone, doctor, department, date, time, message } = req.body || {};
		if(!name || !email || !phone || !doctor || !date || !time) return res.status(400).json({ success:false, message:'Missing fields' });
		// doctor may be provided as id or as name - support both
		let doc = null;
			try{
				const { Types } = require('mongoose');
				if(Types.ObjectId.isValid(doctor)){
					doc = await Doctor.findById(doctor);
				}
			}catch(e){ /* ignore */ }
		if(!doc){
			// try find by name (case-insensitive)
			doc = await Doctor.findOne({ name: new RegExp('^' + doctor.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '$','i') });
		}
		if(!doc) return res.status(400).json({ success:false, message:'Doctor not found' });
		const appt = await Appointment.create({ name, email, phone, doctor: doc._id, department, date, time, message });
		// append to appointments.json for quick visibility (optional)
		try{ const file = path.join(__dirname,'appointments.json'); fs.writeFileSync(file, JSON.stringify(await Appointment.find().populate('doctor'),null,2)); }catch(e){/* ignore */}
		return res.json({ success:true, message:'Appointment saved', appointment: appt });
	}catch(e){ console.error(e); return res.status(500).json({ success:false, message:'Server error' }); }
});

// Contact submissions
app.post('/api/contact', async (req,res)=>{
	try{
		const { name, email, phone, message } = req.body || {};
		if(!name || !email || !message) return res.status(400).json({ success:false, message:'Missing fields' });
		const doc = await Contact.create({ name, email, phone, message });
		return res.json({ success:true, message:'Contact saved', contact: doc });
	}catch(e){ console.error(e); return res.status(500).json({ success:false, message:'Server error' }); }
});

// Admin: list all appointments (protected)
app.get('/api/appointments', auth, async (req,res)=>{
	try{
		const list = await Appointment.find().populate('doctor').sort({ createdAt:-1 });
		res.json({ success:true, appointments: list });
	}catch(e){ console.error(e); res.status(500).json({ success:false, message:'Server error' }); }
});

// Serve static (optional): allow frontend to request files if placed here
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, ()=> console.log(`MediCare+ backend running on http://localhost:${PORT}`));
