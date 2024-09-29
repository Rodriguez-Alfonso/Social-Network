const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);


app.use(errorHandler);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
