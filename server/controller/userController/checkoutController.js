const userModel = require('../../model/userModel')
const cartModel = require('../../model/cartModel')
const productModel = require('../../model/productModel')
const addressModel = require('../../model/addressModel')
const orderModel = require('../../model/orderModel')
const catModel = require('../../model/categModel')
const walletModel = require('../../model/walletModel')
const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});



const checkout = async (req, res) => {
  try {
    const userId = req.session.userId;
    req.session.checkoutSave = true;
    const categories = await catModel.find()
    const address = await addressModel.findOne({ userId: userId })
    const data = await cartModel.findOne({ userId }).populate({
      path: 'item.productId',
      select: 'name image'
    })
    for (const cartItem of data.item || []) {
      const pro = cartItem.productId;
      const product = await productModel.findOne({ _id: pro._id })
      const size = product.stock.findIndex(s => s.size == cartItem.size);
      if (product.stock[size].quantity < cartItem.quantity) {
        console.log('Selected quantity exceeds available stock for productId:', product._id);
        return res.redirect('/cart');
      }
    }
    if (data.item.length == 0) {
      return res.redirect('/cart')
    }
    res.render('user/checkout', { data: data, address: address, categories })
  } catch (error) {
    console.log(error);
    res.render("user/serverError");
  }
}

const order = async (req, res) => {
  try {
    const categories = await catModel.find()
    const { address, pay } = req.body
    let wallet = parseInt(req.body.wallet)
    let amount = req.body.amount;
    console.log(typeof amount,typeof wallet); // Log type of amount
    const userId = req.session.userId;
    const cart = await cartModel.findOne({ userId: userId })
    const useraddress = await addressModel.findOne({ userId: userId })
    const selectedaddress = useraddress.address[address]
    const items = cart.item.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
      price: item.price,
    }))
    for (const item of items) {
      const product = await productModel.findOne({ _id: item.productId })
      const size = product.stock.findIndex(size => size.size == item.size)
      product.stock[size].quantity -= item.quantity
      await product.save()
    }
    const order = new orderModel({
      userId: userId,
      items: items,
      amount: amount,
      wallet: wallet,
      payment: pay,
      address: selectedaddress,
      createdAt: new Date(),
      updated: new Date()
    })
    cart.item = []
    cart.total = 0
    if (wallet > 0) {
      const userWallet = await walletModel.findOne({ userId: userId })
      userWallet.history.push({
        transaction: "Debited",
        amount: wallet,
        date: new Date()
      })
      await userWallet.save();
      const user = await userModel.findOne({ _id: userId })
      user.wallet -= wallet;
      await user.save();

    }
    const savedOrder = await order.save()
    await cart.save()
    const orderconfirmation = await orderModel.findOne({ orderId: savedOrder.orderId }).populate({
      path: 'items.productId',
      select: 'name'
    })
    res.render('user/thankyou', { order: orderconfirmation, categories })
  } catch (error) {
    console.log(error);
    res.render("user/serverError");
  }
}

const upi = async (req, res) => {
  var options = {
    amount: req.body.amount,
    currency: "INR",
    receipt: "order_rcpt"
  };
  instance.orders.create(options, function (err, order) {
    res.send({ orderId: order.id })
  })
}

const wallet = async (req, res) => {
  try {
    const amount = req.body.amount
    const user = await userModel.findOne({ _id: req.session.userId })
    if (user.wallet >= amount) {
      res.json({ success: true })
    }
    else {
      res.json({ success: false, amount: user.wallet })
    }
  } catch (error) {
    console.log(error);
    res.render("user/serverError");
  }
}

module.exports = { checkout, order, upi, wallet }
