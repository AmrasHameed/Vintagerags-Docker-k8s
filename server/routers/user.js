const express = require('express')
require('./../../googleAuth')
const passport = require('passport')
const userRouter = express.Router();
const userController = require("../controller/userController/userController");
const productController = require('../controller/userController/productController');
const cartController = require('../controller/userController/cartController')
const checkoutController=require('../controller/userController/checkoutController')
const profileController=require('../controller/userController/profileController')
const session = require('../../middleware/userAuth')
const { logged, ifLogged, forgot, signed ,checkoutValid} = session


userRouter.get('/googleSignIn', userController.googleSignIn)
userRouter.get('/google/callback', userController.googleCallback);
userRouter.get('/auth/failure', userController.authFailure);

userRouter.get('/', userController.index);
userRouter.get('/contact', userController.contact);


userRouter.get('/shop', productController.shop);
userRouter.get('/shopSingle/:id', productController.shopSingle);
userRouter.get('/search',productController.search)

userRouter.get('/orders',logged,profileController.order)
userRouter.get('/cancelorder/:id', logged, profileController.ordercancelling)
userRouter.get('/order-tracking/:id', logged, profileController.ordertracking)
userRouter.get('/resetpassword',logged,profileController.resetPassword)
userRouter.post('/passwordUpdating',logged,profileController.updatePassword)
userRouter.get('/address',logged,profileController.showaddress)
userRouter.get('/editAddress/:id',logged , profileController.editAddress)
userRouter.get('/deleteAddress/:id',logged, profileController.deleteAddress)
userRouter.post('/addressupdated/:id', logged, profileController.addressPost)
userRouter.get('/addAddress',logged , profileController.addAddress)
userRouter.post('/addressPost',logged , profileController.addaddressPost)

userRouter.get('/cart', logged, cartController.showcart)
userRouter.post('/addtoCart/:id', logged, cartController.addcart);
userRouter.post('/updateCartQuantity/:productId/:size', logged, cartController.updateCart)
userRouter.get('/deletcart/:id/:size', logged, cartController.deleteCart)


userRouter.get('/checkout',logged,checkoutValid,checkoutController.checkout)
userRouter.post('/order', logged, checkoutValid, checkoutController.order)


userRouter.get('/login', ifLogged, userController.login);
userRouter.post('/login', userController.loginPost);
userRouter.get('/forgotPassword', userController.forgotPassword)
userRouter.post('/forgotPasswordPost', userController.forgotPasswordPost)
userRouter.get('/newPassword', forgot, userController.newPassword)
userRouter.post('/newPasswordPost', forgot, userController.newPasswordPost)

userRouter.get('/otp', signed, userController.otp)
userRouter.post('/verifyotp', userController.verifyotp)
userRouter.post('/resendotp', userController.resendotp)


userRouter.get('/signup', ifLogged, userController.signup);
userRouter.post('/signup', userController.signupPost)

userRouter.get('/profile', logged, userController.profile)

userRouter.get('/logout', userController.logout)
module.exports = userRouter;
