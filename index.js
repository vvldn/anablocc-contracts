const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  return next();
});

// connect to database
const connectToDatabase = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(config.mongoUri);
    console.log('Connected to mongodb');
  } catch (err) {
    console.error(`Failed connecting to mongodb. Err: ${JSON.stringify(err)}`);
  }
}
connectToDatabase();

// Routes
app.get('/', (req, res) => {
  res.send('ANABLOCC server running');
});

app.use('/admin/', require('./routes/admin'));
app.use('/users/', require('./routes/users'));
app.use('/ownership/', require('./routes/ownership'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});
