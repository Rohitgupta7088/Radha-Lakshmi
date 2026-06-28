import transporter from "../config/nodemailer.js"
import { MessageAttempt } from "svix/dist/api/messageAttempt.js"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import User from "../models/User.js"
import stripe from "stripe"

const currency = "inr"
const delivery_charges = 100
const taxPercentage = 0.02

export const placeOrderCOD = async(req, res)=>{
    try {
        const {items, address}=req.body;
        const {userId} = req.auth()

        if(!items || items.length === 0){
            return res.json({success: false, message:"Please add Product First"})
        }

        let subtotal = 0
        for(const item of items){
            const product = await Product.findById(item.products);
            if(!product){
                return res.json({success: false, message:"Product not found"})
            }

            const unitPrice = product.price[item.size]
            
            if(!unitPrice){
                return res.json({success: false, message:"Invalid size Selected"})
            }

            subtotal += unitPrice * item.quantity
        }

        const taxAmount = subtotal * taxPercentage
        const totalAmount = subtotal + taxAmount + delivery_charges

        const order = await Order.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentMethod: "COD",
        })

        await User.findByIdAndUpdate(userId, {cartData: {}})

        const populatedOrder = await Order.findById(order._id).populate("items.products").populate("address")
        const user = await User.findById(userId)

        const productTitles = populatedOrder.items.map(item => item.products?.title || "Unknown").join(", ")
        const addressString = populatedOrder.address ? `${populatedOrder.address.street || "N/A"}, ${populatedOrder.address.city || "N/A"}, ${populatedOrder.address.state || "N/A"}, ${populatedOrder.address.country || "N/A"}` : "No Address";

        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: user.email,
            subject: "Order Details (COD)",
            html: `
                <h2>Your Delivery Details</h2>
                <p>Thank You for your Order! Below are your Order details:</p>
                <li><strong>Order ID:</strong> ${populatedOrder._id}</li>
                <li><strong>Products Name: </strong> ${productTitles}</li>
                <li><strong>Address:</strong> ${addressString}</li>
                <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "$"}${populatedOrder.amount}</li>
                <p>You will get your delivery in 1-2 Days. Pay on delivery.</p>
            `
        }

        await transporter.sendMail(mailOptions)

        return res.json({success: true, message:"Order Placed"})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const placeOrderStripe = async (req, res)=>{
    try {
        const {items, address}=req.body;
        const {userId} = req.auth()
        const {origin} = req.headers

        if(!items || items.length === 0){
            return res.json({success: false, message:"Please add Product First"})
        }

        let subtotal = 0
        let productData = []

        for(const item of items){
            const product = await Product.findById(item.products);
            if(!product){
                return res.json({success: false, message:"Product not found"})
            }

            const unitPrice = product.price[item.size]
            
            if(!unitPrice){
                return res.json({success: false, message:"Invalid size Selected"})
            }

            subtotal += unitPrice * item.quantity

            productData.push({
                name: product.title,
                price: unitPrice,
                quantity: item.quantity,
            })
        }

        const taxAmount = subtotal * taxPercentage
        const totalAmount = subtotal + taxAmount + delivery_charges

        const order = await Order.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentMethod: "stripe",
        })

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        let line_items = productData.map(((item)=>({
            price_data: {
                currency: currency,
                product_data:{
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        })))

        line_items.push({
            price_data: {
                currency,
                product_data: {name: "tax (2%)"},
                unit_amount: Math.round(taxAmount * 100),
            },
            quantity: 1,
        })

        line_items.push({
            price_data: {
                currency,
                product_data: {name: "Delivery Charges"},
                unit_amount: Math.round(delivery_charges * 100),
            },
            quantity: 1,
        })

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            
            success_url: `${origin}/processing/my-orders`,

            cancel_url: `${origin}/cart`,
            
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        })

        return res.json({success: true, url: session.url})

    } catch (error) {
        console.log("Stripe Error:", error.message)
        res.json({success: false, message:error.message})
    }
}

export const userOrders = async (req, res)=>{
    try {
        const {userId} = req.auth()
        const orders = await Order.find({userId, $or:[
            {paymentMethod: "COD"},
            {isPaid: true}
        ]}).populate("items.products").populate("address").sort({createdAt: -1})

        res.json({success: true, orders})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const allOrders = async (req, res)=>{
    try {
        const orders = await Order.find({$or:[
            {paymentMethod: "COD"},
            {isPaid: true}
        ]}).populate("items.products").populate("address").sort({createdAt: -1})

        const totalOrders = orders.length
        const totalRevenue = orders.reduce((acc, o)=> acc + (o.isPaid ? o.amount : 0), 0)
        res.json({success: true, dashboardData: {totalOrders, totalRevenue, orders}})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const updateStatus = async (req, res)=>{
    try {
        const {orderId, status} = req.body
        await Order.findByIdAndUpdate(orderId, {status})

        res.json({success: true, message: "Order status updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}