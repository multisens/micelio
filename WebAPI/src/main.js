const path = require('path');
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const Routes = require('./routes/routes');
const cors = require('cors');

if(   !process.env.HTTP_PORT
  ||  !process.env.JWT_SECRET
  ||  !process.env.DATABASE_HOST
  /*||  !process.env.DATABASE_PASSWORD*/
  ||  !process.env.DATABASE_USER
  ||  !process.env.DATABASE_CLIENT
  ||  !process.env.DATABASE
){

  throw new Error('Environment variables not set. Please, copy .env.example to .env and write variables values.');

}

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: true}));

const baseDir = path.join(__dirname, '..', '..', 'MicelioDashboard', 'build')
app.use(express.static(`${baseDir}`))
app.use('/api', Routes);
app.get('*', (req,res) => res.sendFile('index.html' , { root : baseDir }))



app.listen(process.env.HTTP_PORT);
