require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();
// DB connetion
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB CONNECTED');
  })
  .catch(() => {
    console.log('DB NOT CONNECTED');
  });

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My routes
app.use('/api', authRoutes);

// Port
const port = process.env.PORT || 8000;

// Starting a server
app.listen(port, () => {
  console.log(`Your app is running at:  http://localhost:${port}/`);
});
