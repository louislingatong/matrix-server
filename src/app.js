const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const dbConnect = require('./database/connect');
const router = require('./router');
const HandleRouteNotFoundMiddleware = require('./app/middlewares/handleRouteNotFoundMiddleware');
const HandleErrorMiddleware = require('./app/middlewares/handleErrorMiddleware');

const app = express();

// Connect to database
dbConnect();

// Read Json
app.use(express.json());
// Read Urls
app.use(express.urlencoded({extended: true}));
// Logger
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  app.use(logger('dev'));
}
// Cors
app.use(
  cors({
    origin: process.env.APP_DOMAIN,
    credentials: true
  })
);
// Routes
app.use('/', router);
// Route for storage
app.use('/avatar', express.static('storage/avatar/'));
app.use('/receipt', express.static('storage/receipt/'));
// Error Handlers
app.use(HandleRouteNotFoundMiddleware);
app.use(HandleErrorMiddleware);

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));