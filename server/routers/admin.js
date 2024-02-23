const express=require('express')
const adminRouter=express.Router()
const adminController=require('../controller/adminController/adminController')
const productController=require('../controller/adminController/productController')
const sessions=require('../../middleware/adminAuth')
adminRouter.use(express.urlencoded({extended:true}))
const multer=require('multer')


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
    }
})

const upload = multer({
    storage:storage,
}).single('image');


adminRouter.get('/',sessions.adLogout,adminController.login)
adminRouter.post("/adminlogin",adminController.loginPost)
adminRouter.get('/adminPanel',sessions.adAuth,adminController.adminPanel)

adminRouter.get('/products',sessions.adAuth,productController.product)
adminRouter.get('/addProduct',sessions.adAuth,productController.addProduct)
adminRouter.post('/addProduct',sessions.adAuth,upload,productController.addProductPost)

adminRouter.get('/adLogout',sessions.adAuth,adminController.adLogout)

module.exports=adminRouter