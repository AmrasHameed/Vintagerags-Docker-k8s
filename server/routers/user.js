const express =require('express')
const userRouter=express.Router();
const userController = require("../controller/userController/userController");


userRouter.get('/',userController.index);
// userRouter.get('/cart',userController.cart);
userRouter.get('/shop',userController.shop);
userRouter.get('/contact',userController.contact);
userRouter.get('/shop-single',userController.shopSingle);

userRouter.get('/login',userController.login);
userRouter.post('/login',userController.loginPost);


userRouter.get('/signup',userController.signup);
userRouter.post('/signup',userController.signupPost)


userRouter.post('/login')

module.exports= userRouter;
