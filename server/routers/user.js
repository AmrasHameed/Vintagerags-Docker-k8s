const express = require('express')
require('./../../googleAuth')
const passport = require('passport')
const userRouter = express.Router();
const userController = require("../controller/userController/userController");
const productController=require('../controller/userController/productController');
const cartController=require('../controller/userController/cartController')
const session = require('../../middleware/userAuth')
const { logged, ifLogged,forgot,signed } = session


userRouter.get('/googleSignIn', userController.googleSignIn)
userRouter.get('/google/callback', userController.googleCallback);
userRouter.get('/auth/failure', userController.authFailure);

userRouter.get('/', userController.index);
userRouter.get('/contact', userController.contact);


userRouter.get('/shop', productController.shop);
userRouter.get('/shopSingle/:id', productController.shopSingle);

userRouter.get('/cart',logged,cartController.showcart)
userRouter.post('/addtoCart/:id',logged,cartController.addcart);



userRouter.get('/login', ifLogged, userController.login);
userRouter.post('/login', userController.loginPost);
userRouter.get('/forgotPassword',userController.forgotPassword)
userRouter.post('/forgotPasswordPost',userController.forgotPasswordPost)
userRouter.get('/newPassword',forgot,userController.newPassword)
userRouter.post('/newPasswordPost',forgot,userController.newPasswordPost)

userRouter.get('/otp',signed, userController.otp)
userRouter.post('/verifyotp', userController.verifyotp)
userRouter.post('/resendotp', userController.resendotp)


userRouter.get('/signup', ifLogged, userController.signup);
userRouter.post('/signup', userController.signupPost)

userRouter.get('/profile', logged, userController.profile)

userRouter.get('/logout', userController.logout)
module.exports = userRouter;
