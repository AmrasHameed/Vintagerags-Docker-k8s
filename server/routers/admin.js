const express=require('express')
const adminRouter=express.Router()
const adminController=require('../controller/adminController/adminController')
const productController=require('../controller/adminController/productController')
const sessions=require('../../middleware/adminAuth')
adminRouter.use(express.urlencoded({extended:true}))
const multer=require('multer')

const upload=multer({dest:'uploads/'})


adminRouter.get('/',sessions.adLogout,adminController.login)
adminRouter.post("/adminlogin",adminController.loginPost)
adminRouter.get('/adminPanel',sessions.adAuth,adminController.adminPanel)

adminRouter.get('/products',sessions.adAuth,productController.product)
adminRouter.get('/addProduct',sessions.adAuth,productController.addProduct)
adminRouter.post('/addProduct',sessions.adAuth,upload.array('images'),productController.addProductPost)

adminRouter.get('/adLogout',sessions.adAuth,adminController.adLogout)

module.exports=adminRouter