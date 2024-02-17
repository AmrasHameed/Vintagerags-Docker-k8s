const userModel=require('../../model/userModel')
const otpModel= require('../../model/otpModel')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const flash=require('express-flash')
const otpGenerator = require('otp-generator');
const nodemailer=require('nodemailer')

const Email=process.env.Email;
const pass=process.env.pass;

const generateotp = ()=>{
    try{
        const otp=otpGenerator.generate(4, { 
            upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false
        });
        console.log('OTP:', otp);
        return otp;
    }catch(err){
        console.log(err);
    }
};

console.log(generateotp());



const index= async (req,res)=>{
    try{
        res.render('user/index')
    }catch(error){
        console.log(error)
    }
}
// const cart= async (req,res)=>{
//     try{
//         res.render('user/cart')
//     }catch(error){
//         console.log(error)
//     }
// }
const shop= async (req,res)=>{
    try{
        res.render('user/shop')
    }catch(error){
        console.log(error)
    }
}
const contact= async (req,res)=>{
    try{
        res.render('user/contact')
    }catch(error){
        console.log(error)
    }
}
const shopSingle= async (req,res)=>{
    try{
        res.render('user/shop-single')
    }catch(error){
        console.log(error)
    }
}
const login= async (req,res)=>{
    try{
        res.render('user/login',{
            expressFlash: {
                invaliduser: req.flash('invaliduser'),
                invalidpassword: req.flash('invalidpassword'),
                userSuccess: req.flash('userSuccess')
            }
        })
    }catch(error){
        console.log(error)
    }
}
const signup= async (req,res)=>{
    try{
        res.render('user/signup',{
        expressFlash: {
            emailerror: req.flash('emailerror'),
            passworderror: req.flash('passworderror')
        }
    })
    }catch(error){
        console.log(error)
    }
}

const signupPost=async (req,res)=>{
    try {
        const username = req.body.username;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const cpassword = req.body.confirmPassword;
        const user = await userModel.findOne({ email: email})
        if (!user) {
            if (password !== cpassword) {
                req.flash('passworderror', "Passwords do not match. Please try again.")
                return res.redirect('/signup')
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const data = {
                username: username,
                email: email,
                phone:phone,
                password: hashedPassword,
            }

            await userModel.insertMany([data])
            res.redirect('/')
        } else {
            req.flash('emailerror', "User alredy exist")
            res.redirect('/signup')
        }

    }

    catch (error) {
        console.error("Error during signup:", error);
        req.flash('emailerror', "An error occurred during signup");
        res.redirect('/signup');
    }
}

const loginPost=async(req,res)=>{
    try {
        const email = req.body.email;
        const password=req.body.password;

        const user = await userModel.findOne({ email: email });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;
            req.session.isAuth = true;
            res.redirect('/');
        } else {
            req.flash('invalidpassword', "Invalid Email or Password");
            res.redirect('/login');
        }
    } catch {
        req.flash('invaliduser', "An unexpected error occurred");
        res.redirect('/login');
    }
}
module.exports={index,shop,contact,shopSingle,login,signup,signupPost,loginPost};