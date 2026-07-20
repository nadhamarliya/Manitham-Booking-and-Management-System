import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie parser
import dotenv from 'dotenv';
import connectToDatabase from './db/db.js';
import authRouter from './routes/auth.js';
import sponsorRouter from './routes/sponsor.js';
import patientRouter from './routes/patient.js';

dotenv.config();
connectToDatabase();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://manitham-portal.vercel.app"],
    credentials: true // Crucial: Allows frontend cross-origin requests to receive cookies
}));
app.use(express.json());
app.use(cookieParser()); // Initialize cookie parser middleware layer

app.use('/api/auth', authRouter);
app.use('/api/sponsor', sponsorRouter);
app.use('/api/patient', patientRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Manitham Server running successfully on port ${process.env.PORT || 3000}`);
});
