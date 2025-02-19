import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import booksRoute from '../routes/booksRoute.js';
import authRoute from '../routes/authRoute.js';
import cors from 'cors';
import bodyParser from "body-parser"; 
import { createServer } from 'http';

// const PORT = process.env.PORT || 5555; 
const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use(cors({
  // origin: [
  //   "https://book-store-app-mern-phi.vercel.app",  // Frontend URL
  //   "https://book-store-app-mern-api.vercel.app/",  // Latest backend URL
  // ],
  origin: '*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

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
// server.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });
export default server;