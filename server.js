const express = require('express');
const mongoose = require('mongoose');

const rtStudent = require('./routes/students');
const rtAdmin = require('./routes/admin');
const rtEnroll = require('./routes/enrolls')
const rtTeacher = require('./routes/teachers');

const config = require('./config/config');

const cors = require('cors');

// EXPRESS
const app = express();

//CORS
app.use(cors({
   origin: 'http://localhost:3000',
   methods: ['GET', 'POST','PUT','DELETE','OPTION'],
   allowedHeaders: ['Content-Type','x-auth-token','Authorization'],
   credentials: true
}));

// EXPRESS-JSON
app.use(express.json());

// BODY-PARSER
app.use(express.urlencoded({extended: true}));


// MONGOOSE
mongoose.connect(config.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   
})

const db = mongoose.connection;

db.once('open', () => {
   console.log('Connected to Database');
})

db.on('error', (err)=> {
   console.log(err);
})


// ROUTES
app.use('/students', rtStudent);
app.use('/auth/admin', rtAdmin);
app.use('/enrolls', rtEnroll);
app.use('/teachers', rtTeacher);

//PORT
app.listen(config.PORT, () => {
   console.log(`Server run on port ${config.PORT}`);
})