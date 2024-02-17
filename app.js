const express=require('express');
require('dotenv').config();

const path=require('path')
const app=express();
const userRouter=require('./server/routers/user')
const mongoose=require('mongoose')
const nocache=require('nocache')
const session= require('express-session')
const flash=require('express-flash')

mongoose.connect(process.env.MONGO_URL).then((s)=>{
    console.log("connected");
  }).catch((error)=>{
    console.log(error);
  })

app.use(flash())
app.use(nocache())
app.use(session({
    secret:'qwertyasdfghj',
    resave:false,
    saveUninitialized:true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/static', express.static(path.join(__dirname,'static')))
app.set('view engine','ejs');

app.use('/',userRouter)

app.listen(8000,()=>{
    console.log(`Server is running on http://localhost:8000/`);
})
