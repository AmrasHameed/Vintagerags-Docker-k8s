const express =require('express')
const userRouter=express.Router();
const userController = require("../controller/userController/userController");


userRouter.get('/',userController.index);
// userRouter.get('/cart',userController.cart);
userRouter.get('/shop',userController.shop);
userRouter.get('/contact',userController.contact);
userRouter.get('/shop-single',userController.shopSingle);
userRouter.get('/login',userController.login);
userRouter.get('/signup',userController.signup)

userRouter.post('/login')

module.exports= userRouter;
