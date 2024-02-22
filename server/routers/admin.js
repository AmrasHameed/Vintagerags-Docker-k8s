const express=require('express')
const adminRouter=express.Router()
const adminController=require('../controller/adminController/adminController')
const sessions=require('../../middleware/adminAuth')
adminRouter.use(express.urlencoded({extended:true}))

adminRouter.get('/',sessions.adLogout,adminController.login)
adminRouter.post("/adminlogin",adminController.loginPost)

adminRouter.get('/adminPanel',sessions.adAuth,adminController.adminPanel)


adminRouter.get('/adLogout',sessions.adAuth,adminController.adLogout)

module.exports=adminRouter