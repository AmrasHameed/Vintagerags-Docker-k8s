const adminModel = require('../../model/userModel')
const orderModel = require('../../model/orderModel')
const fs = require('fs')
const os = require('os')
const path = require('path')
const puppeteer = require('puppeteer')
const exceljs=require('exceljs')
const bcrypt = require('bcrypt')
const flash = require('express-flash')

const login = (req, res) => {
    try {
        if (req.session.isAdAuth) {
            return res.redirect('/admin/adminPanel')
        }
        res.render('admin/adLogin', { passwordError: req.query.passwordError })
    } catch (error) {
        console.log(error);
        res.render("user/serverError");
    }
}

const loginPost = async (req, res) => {
    try {
        const password = req.body.password
        const user = await adminModel.findOne({ email: req.body.email });
        if (user.isAdmin == true && await bcrypt.compare(password, user.password)) {
            req.session.isAdAuth = true;
            res.redirect('/admin/adminPanel');
        } else {
            res.redirect("/admin?passwordError=Invalid%20password%2Fusername");
        }
    } catch (error) {
        console.log(error);
        res.render("user/serverError");
    }
}

const adminPanel = (req, res) => {
    try {

        res.render('admin/adminPanel', {
            expressFlash: {
                derror: req.flash('derror')
            }
        })
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const adLogout = (req, res) => {
    try {
        req.session.isAdAuth = false;
        res.redirect('/admin')
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const user = async (req, res) => {
    try {
        const user = await adminModel.find({})
        res.render('admin/users', { users: user })
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const unblock = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await adminModel.findById(id);
        user.blocked = !user.blocked;
        req.session.isAuth = false;
        await user.save();
        res.redirect('/admin/users')
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const search = async (req, res) => {
    try {
        const searchName = req.body.search;
        const data = await adminModel.find({
            username: { $regex: new RegExp(`^${searchName}`, `i`) },
        });
        req.session.searchUser = data;
        res.redirect('/admin/searchView')
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const searchView = async (req, res) => {
    try {
        const user = req.session.searchUser;
        res.render('admin/users', { users: user })
    } catch (err) {
        console.log(err);
        res.render("user/serverError");
    }
}

const isFutureDate = (selectedDate) => {
    try {
        const selectedDateTime = new Date(selectedDate);
        const currentDate = new Date();
        return selectedDateTime >= currentDate;

    } catch (error) {
        console.log(error);
        res.render("users/serverError")
    }
}

const chartData = async (req, res) => {
    try {
        const selected = req.body.selected
        if (selected == 'month') {
            const orderByMonth = await orderModel.aggregate([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    }
                }
            ])
            const salesByMonth = await orderModel.aggregate([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                        },
                        
                        totalAmount: { $sum: '$amount' },

                    }
                }
            ])
            const responseData = {
                order: orderByMonth,
                sales: salesByMonth
            };


            res.status(200).json(responseData);
        }
        else if (selected == 'year') {
            const orderByYear = await orderModel.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    }
                }
            ])
            const salesByYear = await orderModel.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                        },
                        totalAmount: { $sum: '$amount' },
                    }
                }
            ])
            const responseData = {
                order: orderByYear,
                sales: salesByYear,
            }
            res.status(200).json(responseData);
        }

    }
    catch (err) {
        console.log(err);
        res.send("Error Occured")
    }

}

const downloadsales = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        console.log(startDate, endDate);
        let sdate = isFutureDate(startDate)
        let edate = isFutureDate(endDate)

        if (sdate) {
            req.flash('derror', 'invalid date')
            return res.redirect('/admin/adminPanel')
        }
        if (edate) {
            req.flash('derror', 'invalid date')
            return res.redirect('/admin/adminPanel')

        }

        const salesData = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate),
                    },
                    status: {
                        $nin: ["Cancelled", "returned"]
                    }
                },
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }, 
                },
            },
        ]);
        


        console.log("ithu sales", salesData);

        const products = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate),
                    },
                },
            },
            {
                $unwind: '$items',
            },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                },
            },
            {
                $lookup: {
                    from: 'productdetails',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetailss',
                },
            },
            {
                $unwind: '$productDetailss',
            },
            {
                $project: {
                    _id: 1,
                    totalSold: 1,
                    productName: '$productDetailss.name',
                },
            },
            {
                $sort: { totalSold: -1 },
            },
        ]);
        console.log("ithu products", products);
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sales Report</title>
          <style>
              body {
                  margin-left: 20px;
              }
          </style>
      </head>
      <body>
          <h2 align="center"> Sales Report</h2>
          Start Date:${startDate}<br>
          End Date:${endDate}<br> 
          <center>
              <table style="border-collapse: collapse;">
                  <thead>
                      <tr>
                          <th style="border: 1px solid #000; padding: 8px;">Sl N0</th>
                          <th style="border: 1px solid #000; padding: 8px;">Product Name</th>
                          <th style="border: 1px solid #000; padding: 8px;">Quantity Sold</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${products
                .map(
                    (item, index) => `
                              <tr>
                                  <td style="border: 1px solid #000; padding: 8px;">${index + 1}</td>
                                  <td style="border: 1px solid #000; padding: 8px;">${item.productName}</td>
                                  <td style="border: 1px solid #000; padding: 8px;">${item.totalSold}</td>
                              </tr>`
                )
                .join("")}
                      <tr>
                          <td style="border: 1px solid #000; padding: 8px;"></td>
                          <td style="border: 1px solid #000; padding: 8px;">Total No of Orders</td>
                          <td style="border: 1px solid #000; padding: 8px;">${salesData[0]?.totalOrders || 0}</td>
                      </tr>
                      <tr>
                          <td style="border: 1px solid #000; padding: 8px;"></td>
                          <td style="border: 1px solid #000; padding: 8px;">Total Revenue</td>
                          <td style="border: 1px solid #000; padding: 8px;">${salesData[0]?.totalAmount || 0}</td>
                      </tr>
                  </tbody>
              </table>
          </center>
      </body>
      </html>
  `;


        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent);

        const pdfBuffer = await page.pdf();

        await browser.close();

        const downloadsPath = path.join(os.homedir(), 'Downloads');
        const pdfFilePath = path.join(downloadsPath, 'sales.pdf');


        fs.writeFileSync(pdfFilePath, pdfBuffer);


        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=sales.pdf');
        res.status(200).end(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.render("user/serverError");
    }
};


const bestProducts=async(req,res)=>{
    try{
        const bestProducts = await orderModel.aggregate([
            {
                $unwind: '$items',
            },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                },
            },
            {
                $lookup: {
                    from: 'productdetails',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productDetails.category', 
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            {
                $project: {
                    _id: 1,
                    totalSold: 1,
                    productName: '$productDetails.name',
                    productCategory: { $arrayElemAt: ['$categoryDetails.name', 0] }, 
                    productImage: '$productDetails.image',
                    stockLeft: '$productDetails.totalstock',
                },
            },
            {
                $sort: { totalSold: -1 },
            },
            {
                $limit: 10,
            },
        ]);
        
        console.log(bestProducts);
        res.render('admin/bestProduct',{bestProducts})
    }catch(error){
        console.error(error);
        res.render("user/serverError");
    }
}




module.exports = { login, loginPost, adminPanel, adLogout, user, unblock, search, searchView, downloadsales, chartData ,bestProducts}