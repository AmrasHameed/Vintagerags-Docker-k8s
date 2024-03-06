const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userDetails'
    },
    sessionId:String,
    item: [
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'productDetails',
                required: true
            },
            quantity:{
                type:Number,
                required:true
            },
            size:{
                type:String,
                required:true
            },
            stock:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            total:{
                type:Number,
                required:true
            },
        }
    ],
    total:Number,
});

const cartModel = mongoose.model('cart', cartSchema);

module.exports = cartModel;