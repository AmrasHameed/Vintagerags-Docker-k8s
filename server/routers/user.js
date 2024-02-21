const express =require('express')
require('./../../googleAuth')
// const{passport,setSessionVariables}=require('../../googleAuth')
const passport=require('passport')
const userRouter=express.Router();
const userController = require("../controller/userController/userController");
const session=require('../../middleware/userAuth')
const {logged,ifLogged}=session 


userRouter.get('/googleSignIn',
passport.authenticate('google',{scope:['email','profile']})
)



userRouter.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/failure'
  }),
);

userRouter.get('/auth/failure',(req,res)=>{
    res.send('Something went wrong..')
  })

userRouter.get('/',userController.index);
// userRouter.get('/cart',userController.cart);
userRouter.get('/shop',userController.shop);
userRouter.get('/contact',userController.contact);
userRouter.get('/shop-single',userController.shopSingle);

userRouter.get('/login',ifLogged,userController.login);
userRouter.post('/login',userController.loginPost);

userRouter.get('/otp',userController.otp)
userRouter.post('/verifyotp',userController.verifyotp)
userRouter.post('/resendotp',userController.resendotp)

userRouter.get('/profile',logged,userController.profile)

userRouter.get('/signup',ifLogged,userController.signup);
userRouter.post('/signup',userController.signupPost)

userRouter.get('/logout',userController.logout)

module.exports= userRouter;
