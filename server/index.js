import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import dotenv from 'dotenv';
import connectToDatabase from './db/db.js';
import authRouter from './routes/auth.js';
import sponsorRouter from './routes/sponsor.js';
import patientRouter from './routes/patient.js';

dotenv.config();
connectToDatabase();

const app = express();

// 1. Fully configured CORS block
app.use(cors({
    origin: ["http://localhost:5173", "https://manitham-portal.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser()); 

// 2. Added root route to prevent 404/CORS routing crashes
app.get('/', (req, res) => {
    res.status(200).send("Manitham Server API is live.");
});

app.use('/api/auth', authRouter);
app.use('/api/sponsor', sponsorRouter);
app.use('/api/patient', patientRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Manitham Server running successfully on port ${process.env.PORT || 3000}`);
});
