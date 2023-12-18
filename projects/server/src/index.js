require('dotenv/config');
const express = require('express');
const cors = require('cors');
const { join } = require('path');

const PORT = process.env.PORT || 8000;
const app = express();
app.use(
  cors({
    origin: [
      process.env.WHITELISTED_DOMAIN &&
        process.env.WHITELISTED_DOMAIN.split(','),
    ],
  })
);

app.use(express.json());

const db = require('./models');
db.sequelize.sync();

const userAuthRouter = require('./routes/userAuth');
const tenantAuthRouter = require('./routes/tenantAuth');
const categoryRouter = require('./routes/category');
const propertyRouter = require('./routes/property');
const roomRouter = require('./routes/room');
const availableDateRouter = require('./routes/availableDate');
const verifyRouter = require('./routes/verify');
const orderRouter = require('./routes/order');
const reviewRouter = require('./routes/review');

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.get('/api', (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get('/api/greetings', (req, res, next) => {
  res.status(200).json({
    message: 'Hello, Student !',
  });
});

app.use('/api/auth/user', userAuthRouter);
app.use('/api/auth/tenant', tenantAuthRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/available-dates', availableDateRouter);
app.use('/api/verify', verifyRouter);
app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRouter);

app.use('/images', express.static(__dirname + '/public'));

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes('/api/')) {
    res.status(404).send('Not found !');
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes('/api/')) {
    console.error('Error : ', err.stack);
    res.status(500).send('Error !');
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = '../../client/build';
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, clientPath, 'index.html'));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
