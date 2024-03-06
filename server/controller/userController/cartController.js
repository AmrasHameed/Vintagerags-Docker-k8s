const productModel=require('../../model/productModel')
const catModel=require('../../model/categModel')
const cartModel=require('../../model/cartModel')


const showcart=async(req,res)=>{
    try{
        const id=req.session.userId;
        const sessionId=req.session.id;
        const categories=await catModel.find();
        let cart;
        if(id){
            cart=await cartModel.findOne({userId:id}).populate({
                path:'item.productId',
                select:'image name price'
            })
        }else if(!cart || !cart.item){
            cart=new cartModel({
                sessionId:req.session.id,
                item:[],
                total:0
            })
        }
        req.session.checkout=true
        res.render('user/cart',{cart,categories})
    }catch(error){
        console.log(error);
        res.render('user/serverError');
    }
}

const addcart = async (req, res) => {
    try {
        const pid = req.params.id;
        const product = await productModel.findOne({ _id: pid });
        const userId = req.session.userId;
        const price = product.price;
        const stock = product.stock;
        console.log(typeof req.body.size)
        const quantity = 1;
        if (stock === 0) {
            res.redirect('/cart');
        } else {
            let cart;

            if (userId) {
                cart = await cartModel.findOne({ userId });
            }

            if (!cart) {
                cart = await cartModel.findOne({ sessionId: req.session.id });
            }

            if (!cart) {
                cart = new cartModel({
                    sessionId: req.session.id,
                    item: [],
                    total: 0
                });
            }

            const productExist = cart.item.findIndex((item) => item.productId == pid);

            if (productExist !== -1) {
                cart.item[productExist].quantity += 1;
                cart.item[productExist].total = cart.item[productExist].quantity * price;
            } else {
                const newItem = {
                    productId: pid,
                    quantity: 1,
                    size:req.body.size,
                    price: price,
                    stock: stock,
                    total: quantity * price
                };
                console.log(newItem)
                cart.item.push(newItem);
            }

            if (userId && !cart.userId) {
                cart.userId = userId;
            }

            cart.total = cart.item.reduce((acc, item) => acc + item.total, 0);
            await cart.save();
            res.redirect('/cart');
        }
    } catch (err) {
        console.log(err);
        res.render('user/serverError');
    }
};


module.exports={showcart,addcart}