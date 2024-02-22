const userModel = require("../server/model/userModel")

const logged = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ _id: req.session.userId})
        if (req.session.isAuth && user) {
            next()
        } else {
            res.redirect('/login')
        }

    } catch (err) {
        console.log(err)
        res.render('user/serverError')
    }
}

const ifLogged= async (req,res,next)=>{
    try{
        if(req.session.isAuth){
            res.redirect('/')
        }else{
            next();
        }

    }catch(err){
        console.log(err);
        res.render('user/serverError')
    }
}

module.exports={logged,ifLogged}