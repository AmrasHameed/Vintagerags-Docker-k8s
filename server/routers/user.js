const express = require('express')
require('./../../googleAuth')
// const{passport,setSessionVariables}=require('../../googleAuth')
const passport = require('passport')
const userRouter = express.Router();
const userController = require("../controller/userController/userController");
const session = require('../../middleware/userAuth')
const { logged, ifLogged } = session


userRouter.get('/googleSignIn', userController.googleSignIn)
userRouter.get('/google/callback', userController.googleCallback);
userRouter.get('/auth/failure', userController.authFailure);

userRouter.get('/', userController.index);
// userRouter.get('/cart',userController.cart);
userRouter.get('/shop', userController.shop);
userRouter.get('/contact', userController.contact);
userRouter.get('/shopSingle/:id', userController.shopSingle);

userRouter.get('/login', ifLogged, userController.login);
userRouter.post('/login', userController.loginPost);

userRouter.get('/otp', userController.otp)
userRouter.post('/verifyotp', userController.verifyotp)
userRouter.post('/resendotp', userController.resendotp)


userRouter.get('/signup', ifLogged, userController.signup);
userRouter.post('/signup', userController.signupPost)

userRouter.get('/profile', logged, userController.profile)

userRouter.get('/logout', userController.logout)
module.exports = userRouter;
