import express from 'express';
import { mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import booksRoute from '../routes/booksRoute.js';
import authRoute from '../routes/authRoute.js';
import cors from 'cors';
import bodyParser from "body-parser"; 
import dotenv from "dotenv";
import { createServer } from 'http';
dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use(cors({
  origin: "https://book-store-app-mern-phi.vercel.app", // Allow frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));
// );

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Welcome to mern-book-store-api');
});

app.use('/books', booksRoute);
app.use('/auth', authRoute);

mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
const server = createServer(app);

export default server;