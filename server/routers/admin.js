const express=require('express')
const adminRouter=express.Router()


const adminController=require('../controller/adminController/adminController')
const productController=require('../controller/adminController/productController')
const categoryController=require('../controller/adminController/categoryController')
const sessions=require('../../middleware/adminAuth')
const multer=require('multer')

const upload=multer({dest:'uploads/'})

adminRouter.use(express.urlencoded({extended:true}))

adminRouter.get('/',sessions.adLogout,adminController.login)
adminRouter.post("/adminlogin",adminController.loginPost)
adminRouter.get('/adminPanel',sessions.adAuth,adminController.adminPanel)

adminRouter.get('/users',sessions.adAuth,adminController.user)
adminRouter.get("/unblock/:id",sessions.adAuth,adminController.unblock)

adminRouter.get('/products',sessions.adAuth,productController.product)
adminRouter.get('/addProduct',sessions.adAuth,productController.addProduct)
adminRouter.post('/addProduct',sessions.adAuth,upload.array('images'),productController.addProductPost)
adminRouter.get("/unlist/:id",sessions.adAuth,productController.unlist)
adminRouter.get("/updateProduct/:id",sessions.adAuth,productController.updateProduct)
adminRouter.post("/updateProduct/:id",sessions.adAuth,productController.updateProductPost)
adminRouter.get("/editImage/:id",sessions.adAuth,productController.editImage)
adminRouter.get('/deleteImage',sessions.adAuth,productController.deleteImage)
adminRouter.post('/updateImage/:id',sessions.adAuth,upload.array('image'),productController.updateImage)

adminRouter.get('/categories',sessions.adAuth,categoryController.category)
adminRouter.get('/addCategory',sessions.adAuth,categoryController.addCategory)
adminRouter.post('/addCategory',sessions.adAuth,categoryController.addCategoryPost)
adminRouter.get('/unlistCat/:id',sessions.adAuth,categoryController.unlist)
adminRouter.get('/updateCategory/:id',sessions.adAuth,categoryController.updateCategory)
adminRouter.post('/updateCategory/:id',sessions.adAuth,categoryController.updateCategoryPost)

adminRouter.get('/adLogout',sessions.adAuth,adminController.adLogout)

module.exports=adminRouter