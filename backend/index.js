import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import booksRoute from './routes/booksRoute.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';
import bodyParser from "body-parser"; 
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
// Option 2: Allow Custom Origins
// app.use(cors({
//   origin: "https://book-store-app-mern-lal2.vercel.app", // Allow frontend
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true
// }));
// );

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Welcome To MERN Stack Tutorial');
});

app.use('/books', booksRoute);
app.use('/auth', authRoute);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

