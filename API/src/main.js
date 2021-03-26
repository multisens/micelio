require('dotenv').config();
const express = require('express');
const Routes = require('./routes/routes');

if(!process.env.HTTP_PORT || !process.env.JWT_SECRET){
  throw new Error('Environment variables not set. Please, copy .env.example to .env and write variables values.');
}

const app = express();
app.use(express.json());
app.use(Routes);

app.listen(process.env.HTTP_PORT);
