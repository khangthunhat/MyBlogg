const express = require('express');
const cors = require('cors');
const User = require('./models/User');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();


const salt = bcrypt.genSaltSync(10);
const secret = 'adsadsadasfa217asfasjfh';

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://amb:08unzaNPq0LbKmB7@cluster.vmseknh.mongodb.net/?retryWrites=true&w=majority').then(()=>{
   console.log('connected to MongoDB');
}).catch((reportError)=>{
   console.log(reportError);
});

app.post('/register', async (req,res) =>{
   const {username,password} = req.body;
   try {
      const userDoc = await User.create({
         username,
         password: bcrypt.hashSync(password,salt),
      });
      res.json(userDoc);
   }catch(e){
      console.log(e);
      res.status(400).json(e);
   }
});

app.post('/login', async (req,res)=>{
   const {username,password} = req.body;
   const userDoc = await User.findOne({username});
   const passOK = bcrypt.compareSync(password, userDoc.password)
   if (passOK) {
      //logged in
      jwt.sign({username, id:userDoc._id}, secret, {}, (err,token) =>{
         if (err) throw err;
         res.cookie('token', token).json({
            id:userDoc._id,
            username,
         });
      });
   }else {
      res.status(400).json('something wrong');
   }
});


app.get('/profile', (req,res) => {
   const {token} = req.cookies;
   jwt.verify(token, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);
   });
});

app.post('/logout', (req,res) =>{
   res.cookie('token', '').json('ok');
})

app.listen(4000);
///hQZ0DmCgtCotU686
//08unzaNPq0LbKmB7