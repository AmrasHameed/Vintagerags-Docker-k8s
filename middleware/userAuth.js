const userModel= require("../server/model/userModel")

const logged= async (req,res,next)=>{
    try{
        const user=await userModel.findOne({_id:req.session.userId})
            if(req.session.isAuth&& user){
                next()
            }else{
                
            }
        
    }catch(err){
        console.log(err)
    }
}