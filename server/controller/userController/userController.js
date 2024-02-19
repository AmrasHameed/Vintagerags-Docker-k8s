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
        res.render('user/serverError')
    }
};

const sendmail= async(email,otp)=>{
    try{
        console.log(Email,pass);
        let transporter=nodemailer.createTransport({
            service:'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth:{
                user:Email,
                pass:pass,
            },
        })
        let mailOptions={
            from:'Vintagerags<vintageragsonline@gmail.com>',
            to:email,
            subject:'E-mail Verification',
            text:`Dear User,

            Thank you for signing up with Vintagerags! To complete your registration, please use the following OTP (One-Time Password):
            
            OTP: ${otp}
            
            Enter this OTP on our website to verify your email address and access your account.
            
            If you did not sign up for Vintagerags, please disregard this email.
            
            Welcome aboard!
            
            Best regards,
            The Vintagerags Team`
        }
        await transporter.sendMail(mailOptions);
        console.log("Email sent Successfully");
    }catch(err){
        console.log(err)
       
    }
}


const index= async (req,res)=>{
    try{
        res.render('user/index')
    }catch(error){
        console.log(error)
        res.render('user/serverError')
    }
}
// const cart= async (req,res)=>{
//     try{
//         res.render('user/cart')
//     }catch(error){
//         console.log(error)
//         res.render('user/serverError')
//     }
// }
const shop= async (req,res)=>{
    try{
        res.render('user/shop')
    }catch(error){
        console.log(error)
        res.render('user/serverError')
    }
}
const contact= async (req,res)=>{
    try{
        res.render('user/contact')
    }catch(error){
        console.log(error)
        res.render('user/serverError')
    }
}
const shopSingle= async (req,res)=>{
    try{
        res.render('user/shop-single')
    }catch(error){
        console.log(error)
        res.render('user/serverError')
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
        res.render('user/serverError')
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
        res.render('user/serverError')
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
            const user = {
                username: username,
                email: email,
                phone:phone,
                password: hashedPassword,
            }
            req.session.user=user;
            const otp=generateotp();
            // console.log(req.session.user)

            const currTime=Date.now();
            const expTime=currTime+ 60* 1000;
            await otpModel.updateOne({email:email},{$set:{email:email,otp:otp,expiry:new Date(expTime)}},{upsert:true});
            await sendmail(email,otp);
            res.redirect('/otp')
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

const otp=async (req,res)=>{
    try{
        const otp= await otpModel.findOne({email: req.session.user.email})
        res.render('user/otp')
    }catch(err){
        console.log(err);
        res.render('user/serverError')
    }
}

const loginPost=async(req,res)=>{
    try {
        const email = req.body.email;
        const password=req.body.password;

        const user = await userModel.findOne({ email: email });
        if (user && await bcrypt.compare(password, user.password)) {
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
module.exports={index,shop,contact,shopSingle,login,signup,signupPost,loginPost,otp};