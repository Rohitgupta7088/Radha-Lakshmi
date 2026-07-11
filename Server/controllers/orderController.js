// import transporter from "../config/nodemailer.js"
// import { MessageAttempt } from "svix/dist/api/messageAttempt.js"
// import Order from "../models/Order.js"
// import Product from "../models/Product.js"
// import User from "../models/User.js"
// import stripe from "stripe"

// const currency = "inr"
// const delivery_charges = 100
// const taxPercentage = 0.02

// export const placeOrderCOD = async(req, res)=>{
//     try {
//         const {items, address}=req.body;
//         const {userId} = req.auth()

//         if(!items || items.length === 0){
//             return res.json({success: false, message:"Please add Product First"})
//         }

//         let subtotal = 0
//         for(const item of items){
//             const product = await Product.findById(item.products);
//             if(!product){
//                 return res.json({success: false, message:"Product not found"})
//             }

//             const unitPrice = product.price[item.size]
            
//             if(!unitPrice){
//                 return res.json({success: false, message:"Invalid size Selected"})
//             }

//             subtotal += unitPrice * item.quantity
//         }

//         const taxAmount = subtotal * taxPercentage
//         const totalAmount = subtotal + taxAmount + delivery_charges

//         const order = await Order.create({
//             userId,
//             items,
//             amount: totalAmount,
//             address,
//             paymentMethod: "COD",
//         })

//         await User.findByIdAndUpdate(userId, {cartData: {}})

//         const populatedOrder = await Order.findById(order._id).populate("items.products").populate("address")
//         const user = await User.findById(userId)

//         const productTitles = populatedOrder.items.map(item => item.products?.title || "Unknown").join(", ")
//         const addressString = populatedOrder.address ? `${populatedOrder.address.street || "N/A"}, ${populatedOrder.address.city || "N/A"}, ${populatedOrder.address.state || "N/A"}, ${populatedOrder.address.country || "N/A"}` : "No Address";

//         const mailOptions = {
//             from: process.env.SMTP_SENDER_EMAIL,
//             to: user.email,
//             subject: "Order Details (COD)",
//             html: `
//                 <h2>Your Delivery Details</h2>
//                 <p>Thank You for your Order! Below are your Order details:</p>
//                 <li><strong>Order ID:</strong> ${populatedOrder._id}</li>
//                 <li><strong>Products Name: </strong> ${productTitles}</li>
//                 <li><strong>Address:</strong> ${addressString}</li>
//                 <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "$"}${populatedOrder.amount}</li>
//                 <p>You will get your delivery in 1-2 Days. Pay on delivery.</p>
//             `
//         }

//         await transporter.sendMail(mailOptions)

//         return res.json({success: true, message:"Order Placed"})

//     } catch (error) {
//         console.log(error.message)
//         res.json({success: false, message: error.message})
//     }
// }

// export const placeOrderStripe = async (req, res)=>{
//     try {
//         const {items, address}=req.body;
//         const {userId} = req.auth()
//         const {origin} = req.headers

//         if(!items || items.length === 0){
//             return res.json({success: false, message:"Please add Product First"})
//         }

//         let subtotal = 0
//         let productData = []

//         for(const item of items){
//             const product = await Product.findById(item.products);
//             if(!product){
//                 return res.json({success: false, message:"Product not found"})
//             }

//             const unitPrice = product.price[item.size]
            
//             if(!unitPrice){
//                 return res.json({success: false, message:"Invalid size Selected"})
//             }

//             subtotal += unitPrice * item.quantity

//             productData.push({
//                 name: product.title,
//                 price: unitPrice,
//                 quantity: item.quantity,
//             })
//         }

//         const taxAmount = subtotal * taxPercentage
//         const totalAmount = subtotal + taxAmount + delivery_charges

//         const order = await Order.create({
//             userId,
//             items,
//             amount: totalAmount,
//             address,
//             paymentMethod: "stripe",
//         })

//         const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

//         let line_items = productData.map(((item)=>({
//             price_data: {
//                 currency: currency,
//                 product_data:{
//                     name: item.name,
//                 },
//                 unit_amount: Math.round(item.price * 100),
//             },
//             quantity: item.quantity,
//         })))

//         line_items.push({
//             price_data: {
//                 currency,
//                 product_data: {name: "tax (2%)"},
//                 unit_amount: Math.round(taxAmount * 100),
//             },
//             quantity: 1,
//         })

//         line_items.push({
//             price_data: {
//                 currency,
//                 product_data: {name: "Delivery Charges"},
//                 unit_amount: Math.round(delivery_charges * 100),
//             },
//             quantity: 1,
//         })

//         const session = await stripeInstance.checkout.sessions.create({
//             line_items,
//             mode: "payment",
            
//             success_url: `${origin}/processing/my-orders`,

//             cancel_url: `${origin}/cart`,
            
//             metadata: {
//                 orderId: order._id.toString(),
//                 userId,
//             },
//         })

//         return res.json({success: true, url: session.url})

//     } catch (error) {
//         console.log("Stripe Error:", error.message)
//         res.json({success: false, message:error.message})
//     }
// }

// export const userOrders = async (req, res)=>{
//     try {
//         const {userId} = req.auth()
//         const orders = await Order.find({userId, $or:[
//             {paymentMethod: "COD"},
//             {isPaid: true}
//         ]}).populate("items.products").populate("address").sort({createdAt: -1})

//         res.json({success: true, orders})
//     } catch (error) {
//         console.log(error.message)
//         res.json({success: false, message: error.message})
//     }
// }

// export const allOrders = async (req, res)=>{
//     try {
//         const orders = await Order.find({$or:[
//             {paymentMethod: "COD"},
//             {isPaid: true}
//         ]}).populate("items.products").populate("address").sort({createdAt: -1})

//         const totalOrders = orders.length
//         const totalRevenue = orders.reduce((acc, o)=> acc + (o.isPaid ? o.amount : 0), 0)
//         res.json({success: true, dashboardData: {totalOrders, totalRevenue, orders}})

//     } catch (error) {
//         console.log(error.message)
//         res.json({success: false, message: error.message})
//     }
// }

// export const updateStatus = async (req, res)=>{
//     try {
//         const {orderId, status} = req.body
//         await Order.findByIdAndUpdate(orderId, {status})

//         res.json({success: true, message: "Order status updated"})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }


import { v2 as cloudinary } from "cloudinary"
import { upload } from "../middleware/multer.js"
import { getAuth } from "@clerk/express"
import transporter from "../config/nodemailer.js"
import { MessageAttempt } from "svix/dist/api/messageAttempt.js"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import User from "../models/User.js"
import GiftPool from "../models/GiftPool.js"
import stripe from "stripe"
import crypto from "crypto"
import { Cashfree, CFEnvironment } from "cashfree-pg"

const currency = "inr"
const delivery_charges = 100
const taxPercentage = 0.02

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY,
)

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

        // ── Email to Customer ──
        await transporter.sendMail({
            from: process.env.SMTP_SENDER_EMAIL,
            to: user.email,
            subject: `Order Placed – Radha Lakshmi (#${populatedOrder._id})`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                    <div style="background:#41334e;padding:24px;text-align:center;">
                        <h1 style="color:#fff;margin:0;font-size:22px;">Radha Lakshmi</h1>
                        <p style="color:#e0d8e8;margin:4px 0 0;">Order Confirmed!</p>
                    </div>
                    <div style="padding:28px;">
                        <p>Hi <strong>${user.name || "Customer"}</strong>,</p>
                        <p>Thank you for your order! Below are your order details:</p>
                        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                            <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td><td style="padding:10px;border:1px solid #eee;">${populatedOrder._id}</td></tr>
                            <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td><td style="padding:10px;border:1px solid #eee;">${productTitles}</td></tr>
                            <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Address</td><td style="padding:10px;border:1px solid #eee;">${addressString}</td></tr>
                            <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Total Amount</td><td style="padding:10px;border:1px solid #eee;">${process.env.CURRENCY || "₹"}${populatedOrder.amount}</td></tr>
                            <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Payment Method</td><td style="padding:10px;border:1px solid #eee;">COD (Cash on Delivery)</td></tr>
                        </table>
                        <p style="color:#555;">You will receive your delivery in 1–2 days. Pay on delivery.</p>
                        <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                    </div>
                </div>
            `
        })

        // ── Email to Admin ──
        if (process.env.ADMIN_EMAIL) {
            await transporter.sendMail({
                from: process.env.SMTP_SENDER_EMAIL,
                to: process.env.ADMIN_EMAIL,
                subject: `New COD Order Placed – #${populatedOrder._id}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                        <div style="background:#41334e;padding:24px;text-align:center;">
                            <h1 style="color:#fff;margin:0;font-size:22px;">New COD Order</h1>
                            <p style="color:#e0d8e8;margin:4px 0 0;">A new Cash on Delivery order has been placed</p>
                        </div>
                        <div style="padding:28px;">
                            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td><td style="padding:10px;border:1px solid #eee;">${populatedOrder._id}</td></tr>
                                <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Customer</td><td style="padding:10px;border:1px solid #eee;">${user.name || "Unknown"} (${user.email})</td></tr>
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td><td style="padding:10px;border:1px solid #eee;">${productTitles}</td></tr>
                                <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Address</td><td style="padding:10px;border:1px solid #eee;">${addressString}</td></tr>
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Amount</td><td style="padding:10px;border:1px solid #eee;">${process.env.CURRENCY || "₹"}${populatedOrder.amount}</td></tr>
                                <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Placed At</td><td style="padding:10px;border:1px solid #eee;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td></tr>
                            </table>
                            <p style="color:#555;font-size:13px;margin-top:16px;">Login to your <a href="${process.env.FRONTEND_URL}/owner" style="color:#41334e;">Dashboard</a> to process this order.</p>
                        </div>
                    </div>
                `
            })
        }

        return res.json({success: true, message:"Order Placed"})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const placeOrderUPIManual = async(req, res)=>{
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
            paymentMethod: "UPI",
        })

        await User.findByIdAndUpdate(userId, {cartData: {}})

        const populatedOrder = await Order.findById(order._id).populate("items.products").populate("address")
        const user = await User.findById(userId)

        const productTitles = populatedOrder.items.map(item => item.products?.title || "Unknown").join(", ")
        const addressString = populatedOrder.address ? `${populatedOrder.address.street || "N/A"}, ${populatedOrder.address.city || "N/A"}, ${populatedOrder.address.state || "N/A"}, ${populatedOrder.address.country || "N/A"}` : "No Address";

        // ── Email to Customer ──
        await transporter.sendMail({
            from: process.env.SMTP_SENDER_EMAIL,
            to: user.email,
            subject: `Order Placed – Radha Lakshmi (#${populatedOrder._id})`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                    <div style="background:#41334e;padding:24px;text-align:center;">
                        <h1 style="color:#fff;margin:0;font-size:22px;">Radha Lakshmi</h1>
                        <p style="color:#e0d8e8;margin:4px 0 0;">Order Received – Pending Payment Confirmation</p>
                    </div>
                    <div style="padding:28px;">
                        <p>Hi <strong>${user.name || "Customer"}</strong>,</p>
                        <p>We have received your order and your UPI payment claim. We will confirm payment shortly. Below are your order details:</p>
                        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                            <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td><td style="padding:10px;border:1px solid #eee;">${populatedOrder._id}</td></tr>
                            <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td><td style="padding:10px;border:1px solid #eee;">${productTitles}</td></tr>
                            <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Address</td><td style="padding:10px;border:1px solid #eee;">${addressString}</td></tr>
                            <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Total Amount</td><td style="padding:10px;border:1px solid #eee;">${process.env.CURRENCY || "₹"}${populatedOrder.amount}</td></tr>
                            <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Payment Method</td><td style="padding:10px;border:1px solid #eee;">UPI</td></tr>
                        </table>
                        <p style="color:#555;">Your order will be processed once payment is confirmed.</p>
                        <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                    </div>
                </div>
            `
        })

        // ── Email to Admin ──
        if (process.env.ADMIN_EMAIL) {
            await transporter.sendMail({
                from: process.env.SMTP_SENDER_EMAIL,
                to: process.env.ADMIN_EMAIL,
                subject: `New UPI Order Placed – #${populatedOrder._id}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                        <div style="background:#41334e;padding:24px;text-align:center;">
                            <h1 style="color:#fff;margin:0;font-size:22px;">New UPI Order</h1>
                            <p style="color:#e0d8e8;margin:4px 0 0;">UPI payment confirmation required</p>
                        </div>
                        <div style="padding:28px;">
                            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td><td style="padding:10px;border:1px solid #eee;">${populatedOrder._id}</td></tr>
                                <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Customer</td><td style="padding:10px;border:1px solid #eee;">${user.name || "Unknown"} (${user.email})</td></tr>
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td><td style="padding:10px;border:1px solid #eee;">${productTitles}</td></tr>
                                <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Address</td><td style="padding:10px;border:1px solid #eee;">${addressString}</td></tr>
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Amount</td><td style="padding:10px;border:1px solid #eee;">${process.env.CURRENCY || "₹"}${populatedOrder.amount}</td></tr>
                                <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Placed At</td><td style="padding:10px;border:1px solid #eee;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td></tr>
                            </table>
                            <div style="background:#fff8e1;border-left:4px solid #f0a500;padding:12px 16px;border-radius:4px;margin:16px 0;">
                                <strong>Action Required:</strong> Please verify the UPI payment and mark it as paid in the <a href="${process.env.FRONTEND_URL}/owner" style="color:#41334e;">Dashboard</a>.
                            </div>
                        </div>
                    </div>
                `
            })
        }

        return res.json({success: true, message:"Order Placed - Pending Payment Confirmation"})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const placeOrderCashfree = async (req, res)=>{
    try {
        const {items, address} = req.body
        const {userId} = req.auth()
        const {origin} = req.headers

        if(!items || items.length === 0){
            return res.json({success: false, message: "Please add Product First"})
        }

        let subtotal = 0
        for(const item of items){
            const product = await Product.findById(item.products)
            if(!product){
                return res.json({success: false, message: "Product not found"})
            }
            const unitPrice = product.price[item.size]
            if(!unitPrice){
                return res.json({success: false, message: "Invalid size Selected"})
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
            paymentMethod: "cashfree",
        })

        const user = await User.findById(userId)
        const addressDoc = await Order.findById(order._id).populate("address")

        const cashfreeOrder = await cashfree.PGCreateOrder({
            order_id: order._id.toString(),
            order_amount: parseFloat(totalAmount.toFixed(2)),
            order_currency: "INR",
            customer_details: {
                customer_id: userId.toString().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || "customer",
                customer_email: user.email,
                customer_phone: addressDoc?.address?.phone || "9999999999",
                customer_name: user.username,
            },
            order_meta: {
                return_url: `${origin}/cashfree-return?order_id=${order._id.toString()}`,
                notify_url: `${process.env.BACKEND_URL || origin}/api/orders/cashfree/webhook`,
            },
        })

        return res.json({
            success: true,
            payment_session_id: cashfreeOrder.data.payment_session_id,
            orderId: order._id,
        })

    } catch (error) {
        console.log("Cashfree Error:", error?.response?.data || error.message)
        res.json({success: false, message: error.message})
    }
}

export const verifyCashfreePayment = async (req, res)=>{
    try {
        const {orderId} = req.body

        const order = await Order.findById(orderId)
        if(!order){
            return res.json({success: false, message: "Order not found"})
        }

        // Fetch the order status directly from Cashfree
        const cfOrder = await cashfree.PGFetchOrder(orderId.toString())
        const orderStatus = cfOrder.data.order_status

        if(orderStatus === "PAID"){
            if(!order.isPaid){
                await Order.findByIdAndUpdate(orderId, {isPaid: true})
                await User.findByIdAndUpdate(order.userId, {cartData: {}})
                await sendOrderEmail(orderId, "Cashfree (UPI/QR)")
            }
            return res.json({success: true, isPaid: true})
        }
        else if(orderStatus === "ACTIVE"){
            return res.json({success: true, isPaid: false, status: "pending"})
        }
        else{
            // EXPIRED, TERMINATED etc.
            await Order.findByIdAndUpdate(orderId, {status: "Payment Failed"})
            return res.json({success: false, isPaid: false, status: orderStatus})
        }

    } catch (error) {
        console.log("Cashfree Verify Error:", error?.response?.data || error.message)
        res.json({success: false, message: error.message})
    }
}

export const cashfreeWebhook = async (req, res)=>{
    try {
        const signature = req.headers["x-webhook-signature"]
        const timestamp = req.headers["x-webhook-timestamp"]

        // Verify the webhook signature using Cashfree SDK
        let webhookEvent
        try {
            webhookEvent = cashfree.PGVerifyWebhookSignature(
                signature,
                req.rawBody,
                timestamp
            )
        } catch (err) {
            console.log("Cashfree Webhook Signature Error:", err.message)
            return res.status(400).json({success: false, message: "Invalid signature"})
        }

        const eventType = webhookEvent?.type
        const data = webhookEvent?.data

        if(eventType === "PAYMENT_SUCCESS_WEBHOOK"){
            const orderId = data?.order?.order_id
            if(!orderId) return res.json({received: true})

            const order = await Order.findById(orderId)
            if(!order || order.isPaid){
                return res.json({received: true})
            }

            await Order.findByIdAndUpdate(orderId, {isPaid: true})
            await User.findByIdAndUpdate(order.userId, {cartData: {}})
            await sendOrderEmail(orderId, "Cashfree (UPI/QR)")
        }

        res.json({received: true})

    } catch (error) {
        console.log("Cashfree Webhook Error:", error.message)
        res.status(500).json({received: false})
    }
}

// Helper: send confirmation email after payment
const sendOrderEmail = async (orderId, methodLabel)=>{
    try {
        const populatedOrder = await Order.findById(orderId).populate("items.products").populate("address")
        const user = await User.findById(populatedOrder.userId)
        if(!user || !populatedOrder) return

        const productTitles = populatedOrder.items.map(item => item.products?.title || "Unknown").join(", ")
        const addressString = populatedOrder.address
            ? `${populatedOrder.address.street || "N/A"}, ${populatedOrder.address.city || "N/A"}, ${populatedOrder.address.state || "N/A"}, ${populatedOrder.address.country || "N/A"}`
            : "No Address"

        // ── Email to Customer ──
        await transporter.sendMail({
            from: process.env.SMTP_SENDER_EMAIL,
            to: user.email,
            subject: `Order Placed – Radha Lakshmi (#${populatedOrder._id})`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                    <div style="background:#41334e;padding:24px;text-align:center;">
                        <h1 style="color:#fff;margin:0;font-size:22px;">Radha Lakshmi</h1>
                        <p style="color:#e0d8e8;margin:4px 0 0;">Order Confirmed!</p>
                    </div>
                    <div style="padding:28px;">
                        <p>Hi <strong>${user.name || "Customer"}</strong>,</p>
                        <p>Thank you for your order! Your payment via <strong>${methodLabel}</strong> was successful. Below are your order details:</p>
                        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                            <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td><td style="padding:10px;border:1px solid #eee;">${populatedOrder._id}</td></tr>
                            <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td><td style="padding:10px;border:1px solid #eee;">${productTitles}</td></tr>
                            <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Address</td><td style="padding:10px;border:1px solid #eee;">${addressString}</td></tr>
                            <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Total Amount</td><td style="padding:10px;border:1px solid #eee;">${process.env.CURRENCY || "₹"}${populatedOrder.amount}</td></tr>
                            <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Payment Method</td><td style="padding:10px;border:1px solid #eee;">${methodLabel}</td></tr>
                        </table>
                        <p style="color:#555;">You will receive your delivery in 1–2 days.</p>
                        <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                    </div>
                </div>
            `
        })

        // ── Email to Admin ──
        if (process.env.ADMIN_EMAIL) {
            await transporter.sendMail({
                from: process.env.SMTP_SENDER_EMAIL,
                to: process.env.ADMIN_EMAIL,
                subject: `New Order Placed – #${populatedOrder._id}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                        <div style="background:#41334e;padding:24px;text-align:center;">
                            <h1 style="color:#fff;margin:0;font-size:22px;">New Order Received</h1>
                            <p style="color:#e0d8e8;margin:4px 0 0;">A new order has been placed</p>
                        </div>
                        <div style="padding:28px;">
                            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td><td style="padding:10px;border:1px solid #eee;">${populatedOrder._id}</td></tr>
                                <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Customer</td><td style="padding:10px;border:1px solid #eee;">${user.name || "Unknown"} (${user.email})</td></tr>
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td><td style="padding:10px;border:1px solid #eee;">${productTitles}</td></tr>
                                <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Address</td><td style="padding:10px;border:1px solid #eee;">${addressString}</td></tr>
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Amount</td><td style="padding:10px;border:1px solid #eee;">${process.env.CURRENCY || "₹"}${populatedOrder.amount}</td></tr>
                                <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Payment Method</td><td style="padding:10px;border:1px solid #eee;">${methodLabel}</td></tr>
                                <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Placed At</td><td style="padding:10px;border:1px solid #eee;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td></tr>
                            </table>
                            <p style="color:#555;font-size:13px;margin-top:16px;">Login to your <a href="${process.env.FRONTEND_URL}/owner" style="color:#41334e;">Dashboard</a> to process this order.</p>
                        </div>
                    </div>
                `
            })
        }

    } catch (err) {
        console.log("Email Error:", err.message)
    }
}

export const userOrders = async (req, res)=>{
    try {
        const {userId} = req.auth()
        const orders = await Order.find({userId, $or:[
            {paymentMethod: "COD"},
            {paymentMethod: "UPI"},
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
        const orders = await Order.find({
            archivedByAdmin: { $ne: true },
            $or:[
            {paymentMethod: "COD"},
            {paymentMethod: "UPI"},
            {isPaid: true}
        ]}).populate("items.products").populate("address").sort({createdAt: -1})

        const activeOrders = orders.filter(o => o.status !== 'Cancelled')
        const totalOrders = activeOrders.length
        const totalRevenue = activeOrders.reduce((acc, o)=> acc + (o.isPaid ? o.amount : 0), 0)
        res.json({success: true, dashboardData: {totalOrders, totalRevenue, orders}})

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
                                 .populate('items.products')
                                 .populate('address')

        // Send delivery email when admin marks as Delivered
        if (status === 'Delivered' && order) {
            const user = await User.findById(order.userId)
            const productTitles = order.items.map(i => i.products?.title || 'Unknown').join(', ')

            if (user?.email) {
                await transporter.sendMail({
                    from: process.env.SMTP_SENDER_EMAIL,
                    to: user.email,
                    subject: `Your Order Has Been Delivered 🎉 – Radha Lakshmi`,
                    html: `
                        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                            <div style="background:#41334e;padding:24px;text-align:center;">
                                <h1 style="color:#fff;margin:0;font-size:22px;">Radha Lakshmi</h1>
                                <p style="color:#e0d8e8;margin:4px 0 0;">Your Order Has Been Delivered!</p>
                            </div>
                            <div style="padding:28px;">
                                <p style="font-size:16px;">Hi <strong>${user.name || 'Customer'}</strong>, 🎉</p>
                                <p style="color:#555;">Great news! Your order has been successfully delivered. We hope you love your bangles!</p>

                                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                                    <tr style="background:#f9f9f9;">
                                        <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td>
                                        <td style="padding:10px;border:1px solid #eee;">${orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td>
                                        <td style="padding:10px;border:1px solid #eee;">${productTitles}</td>
                                    </tr>
                                    <tr style="background:#f9f9f9;">
                                        <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Amount</td>
                                        <td style="padding:10px;border:1px solid #eee;">₹${order.amount}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Delivered To</td>
                                        <td style="padding:10px;border:1px solid #eee;">
                                            ${order.address?.street || ''}, ${order.address?.city || ''}, ${order.address?.state || ''}
                                        </td>
                                    </tr>
                                </table>

                                <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:12px 16px;border-radius:4px;margin:16px 0;">
                                    <strong>Not happy with your order?</strong><br/>
                                    You can request an exchange within <strong>24 hours</strong> of delivery from your 
                                    <a href="${process.env.FRONTEND_URL}/my-orders" style="color:#41334e;">My Orders</a> page.
                                </div>

                                <p style="color:#555;">Thank you for shopping with Radha Lakshmi. We'd love to see you again! 💜</p>
                                <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                            </div>
                        </div>
                    `
                })
            }
        }

        res.json({ success: true, message: 'Order status updated' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const markUPIPaid = async (req, res)=>{
    try {
        const {orderId} = req.body
        const order = await Order.findById(orderId)

        if(!order){
            return res.json({success: false, message: "Order not found"})
        }

        if(order.paymentMethod !== "UPI"){
            return res.json({success: false, message: "Not a UPI order"})
        }

        await Order.findByIdAndUpdate(orderId, {isPaid: true})

        res.json({success: true, message: "Order marked as paid"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
// ─── ADD THESE TWO FUNCTIONS at the bottom of orderController.js ───


// Replace your existing cancelOrder function in orderController.js with this.
// transporter, Order, User are already imported in your file — no new imports needed.

export const cancelOrder = async (req, res) => {
    try {
        const { orderId, reason } = req.body
        const { userId } = getAuth(req)

        if (!userId) return res.json({ success: false, message: "Not Authorized" })

        const order = await Order.findById(orderId).populate("items.products").populate("address")
        if (!order) return res.json({ success: false, message: "Order not found" })
        if (order.userId !== userId) return res.json({ success: false, message: "Unauthorized" })

        if (order.paymentMethod === "Gift Pool") {
            return res.json({ success: false, message: "Cancellation is not available for Gift Pool orders" })
        }

        const hoursSinceOrder = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60)
        if (hoursSinceOrder > 24) {
            return res.json({ success: false, message: "Cancellation window of 24 hours has passed" })
        }

        if (order.status === "Cancelled") {
            return res.json({ success: false, message: "Order is already cancelled" })
        }

        // Update order status
        await Order.findByIdAndUpdate(orderId, {
            status: "Cancelled",
            cancelReason: reason || "No reason provided"
        })

        // Fetch user for email
        const user = await User.findById(userId)

        const productTitles = order.items.map(item => item.products?.title || "Unknown").join(", ")
        const addressString = order.address
            ? `${order.address.street || "N/A"}, ${order.address.city || "N/A"}, ${order.address.state || "N/A"}, ${order.address.country || "N/A"}`
            : "No Address"

        // ── Email to Customer ──
        if (user?.email) {
            await transporter.sendMail({
                from: process.env.SMTP_SENDER_EMAIL,
                to: user.email,
                subject: `Order Cancelled – Radha Lakshmi (#${orderId})`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background-color: #41334e; padding: 24px; text-align: center;">
                            <h1 style="color: #fff; margin: 0; font-size: 22px;">Radha Lakshmi</h1>
                            <p style="color: #e0d8e8; margin: 4px 0 0;">Order Cancellation Confirmed</p>
                        </div>
                        <div style="padding: 28px;">
                            <p style="font-size: 16px;">Hi <strong>${user.name || "Customer"}</strong>,</p>
                            <p style="color: #555;">Your order has been successfully cancelled. Here are the details:</p>

                            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Order ID</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${orderId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Products</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${productTitles}</td>
                                </tr>
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Amount</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${process.env.CURRENCY || "₹"}${order.amount}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Delivery Address</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${addressString}</td>
                                </tr>
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Cancellation Reason</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${reason || "Not specified"}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Payment Method</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${order.paymentMethod}</td>
                                </tr>
                            </table>

                            ${order.isPaid ? `
                            <div style="background: #fff8e1; border-left: 4px solid #f0a500; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
                                <strong>Refund Notice:</strong> Since your payment was completed, your refund will be processed within <strong>5–7 business days</strong> to your original payment method.
                            </div>` : ""}

                            <p style="color: #555; margin-top: 20px;">If you have any questions, please reach out via our <a href="${process.env.FRONTEND_URL}/Contact" style="color: #41334e;">Contact page</a>.</p>
                            <p style="color: #999; font-size: 13px; margin-top: 24px;">— Team Radha Lakshmi</p>
                        </div>
                    </div>
                `
            })
        }

        // ── Email to Admin/Owner ──
        if (process.env.ADMIN_EMAIL) {
            await transporter.sendMail({
                from: process.env.SMTP_SENDER_EMAIL,
                to: process.env.ADMIN_EMAIL,
                subject: `⚠️ Order Cancelled by Customer – #${orderId}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background-color: #c0392b; padding: 24px; text-align: center;">
                            <h1 style="color: #fff; margin: 0; font-size: 22px;">Order Cancelled</h1>
                            <p style="color: #f5c6c2; margin: 4px 0 0;">A customer has cancelled their order</p>
                        </div>
                        <div style="padding: 28px;">
                            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Order ID</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${orderId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Customer</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${user?.name || "Unknown"} (${user?.email || "No email"})</td>
                                </tr>
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Products</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${productTitles}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Amount</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${process.env.CURRENCY || "₹"}${order.amount}</td>
                                </tr>
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Cancellation Reason</td>
                                    <td style="padding: 10px; border: 1px solid #eee; color: #c0392b;"><strong>${reason || "Not specified"}</strong></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Payment Status</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${order.isPaid ? "✅ Paid — Refund required" : "❌ Not Paid — No refund needed"}</td>
                                </tr>
                                <tr style="background: #f9f9f9;">
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Delivery Address</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${addressString}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; font-weight: bold; border: 1px solid #eee;">Cancelled At</td>
                                    <td style="padding: 10px; border: 1px solid #eee;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
                                </tr>
                            </table>

                            <p style="color: #555; font-size: 13px; margin-top: 16px;">Login to your <a href="${process.env.FRONTEND_URL}/owner" style="color: #41334e;">Dashboard</a> to review this order.</p>
                        </div>
                    </div>
                `
            })
        }

        // ── If this is a Gift Pool order, also notify all paid contributors ──
        if (order.paymentMethod === 'Gift Pool') {
            const giftPool = await GiftPool.findOne({ orderId: orderId })
            if (giftPool) {
                const paidContributors = giftPool.contributors.filter(c => c.isPaid && !c.isOrganizer && c.email)
                for (const contributor of paidContributors) {
                    await transporter.sendMail({
                        from: process.env.SMTP_SENDER_EMAIL,
                        to: contributor.email,
                        subject: `Gift Pool Order Cancelled – Radha Lakshmi`,
                        html: `
                            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                                <div style="background:#c0392b;padding:24px;text-align:center;">
                                    <h1 style="color:#fff;margin:0;font-size:22px;">Radha Lakshmi</h1>
                                    <p style="color:#f5c6c2;margin:4px 0 0;">Gift Pool Order Cancelled</p>
                                </div>
                                <div style="padding:28px;">
                                    <p>Hi <strong>${contributor.name}</strong>,</p>
                                    <p>The gift pool order for <strong>${giftPool.recipientName}</strong> that you contributed to has been cancelled.</p>
                                    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                                        <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Pool ID</td><td style="padding:10px;border:1px solid #eee;">${giftPool.poolId}</td></tr>
                                        <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td><td style="padding:10px;border:1px solid #eee;">${orderId}</td></tr>
                                        <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Gift</td><td style="padding:10px;border:1px solid #eee;">${productTitles}</td></tr>
                                        <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Your Contribution</td><td style="padding:10px;border:1px solid #eee;">&#8377;${contributor.amount}</td></tr>
                                        <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Cancellation Reason</td><td style="padding:10px;border:1px solid #eee;">${reason || "Not specified"}</td></tr>
                                    </table>
                                    <div style="background:#fff8e1;border-left:4px solid #f0a500;padding:12px 16px;border-radius:4px;margin:16px 0;">
                                        <strong>Refund Notice:</strong> Since this was a paid Gift Pool order, your contribution refund will be processed within <strong>5–7 business days</strong>.
                                    </div>
                                    <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                                </div>
                            </div>
                        `
                    })
                }
            }
        }

        return res.json({ success: true, message: "Order cancelled successfully" })

    } catch (error) {
        console.log("cancelOrder error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

export const requestExchange = async (req, res) => {
    try {
        const { orderId, reason, description } = req.body
        const { userId } = getAuth(req)
 
        if (!userId) return res.json({ success: false, message: "Not Authorized" })
 
        const order = await Order.findById(orderId).populate("items.products").populate("address")
        if (!order) return res.json({ success: false, message: "Order not found" })
        if (order.userId !== userId) return res.json({ success: false, message: "Unauthorized" })
 
        if (order.paymentMethod === "Gift Pool") {
            return res.json({ success: false, message: "Exchange is not available for Gift Pool orders" })
        }
 
        if (order.status !== "Delivered") {
            return res.json({ success: false, message: "Exchange is only available after delivery" })
        }
 
        const hoursSinceDelivery = (Date.now() - new Date(order.updatedAt).getTime()) / (1000 * 60 * 60)
        if (hoursSinceDelivery > 24) {
            return res.json({ success: false, message: "Exchange window of 24 hours has passed" })
        }
 
        // Upload proof image to Cloudinary
        let imageUrl = ""
        if (req.file) {
            cloudinary.config({
                cloud_name: process.env.CLDN_NAME,
                api_key: process.env.CLDN_API_KEY,
                api_secret: process.env.CLDN_API_SECRET,
            })
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "image", folder: "exchange_proofs" })
            imageUrl = result.secure_url
        }
 
        // Update order status
        await Order.findByIdAndUpdate(orderId, {
            status: "Exchange Requested",
            exchangeReason: reason,
            exchangeDescription: description,
            exchangeImageUrl: imageUrl,
        })
 
        const user = await User.findById(userId)
        const productTitles = order.items.map(i => i.products?.title || "Unknown").join(", ")
 
        // ── Email to Customer ──
        if (user?.email) {
            await transporter.sendMail({
                from: process.env.SMTP_SENDER_EMAIL,
                to: user.email,
                subject: `Exchange Request Received – Radha Lakshmi (#${orderId})`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                        <div style="background:#41334e;padding:24px;text-align:center;">
                            <h1 style="color:#fff;margin:0;font-size:22px;">Radha Lakshmi</h1>
                            <p style="color:#e0d8e8;margin:4px 0 0;">Exchange Request Received</p>
                        </div>
                        <div style="padding:28px;">
                            <p style="font-size:16px;">Hi <strong>${user.name || "Customer"}</strong>,</p>
                            <p style="color:#555;">We have received your exchange request. Our team will review it and get back to you shortly.</p>
 
                            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                                <tr style="background:#f9f9f9;">
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td>
                                    <td style="padding:10px;border:1px solid #eee;">${orderId}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td>
                                    <td style="padding:10px;border:1px solid #eee;">${productTitles}</td>
                                </tr>
                                <tr style="background:#f9f9f9;">
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Reason</td>
                                    <td style="padding:10px;border:1px solid #eee;">${reason}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Description</td>
                                    <td style="padding:10px;border:1px solid #eee;">${description}</td>
                                </tr>
                            </table>
 
                            <div style="background:#e8f4fd;border-left:4px solid #41334e;padding:12px 16px;border-radius:4px;margin:16px 0;">
                                <strong>What happens next?</strong><br/>
                                Our team will review your request within <strong>24–48 hours</strong> and notify you via email with the decision.
                            </div>
 
                            <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                        </div>
                    </div>
                `
            })
        }
 
        // ── Email to Admin ──
        if (process.env.ADMIN_EMAIL) {
            await transporter.sendMail({
                from: process.env.SMTP_SENDER_EMAIL,
                to: process.env.ADMIN_EMAIL,
                subject: `🔄 Exchange Request – Order #${orderId}`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                        <div style="background:#b45309;padding:24px;text-align:center;">
                            <h1 style="color:#fff;margin:0;font-size:22px;">Exchange Request</h1>
                            <p style="color:#fde68a;margin:4px 0 0;">A customer has requested a product exchange</p>
                        </div>
                        <div style="padding:28px;">
                            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                                <tr style="background:#f9f9f9;">
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td>
                                    <td style="padding:10px;border:1px solid #eee;">${orderId}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Customer</td>
                                    <td style="padding:10px;border:1px solid #eee;">${user?.name || "Unknown"} (${user?.email || "No email"})</td>
                                </tr>
                                <tr style="background:#f9f9f9;">
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td>
                                    <td style="padding:10px;border:1px solid #eee;">${productTitles}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Reason</td>
                                    <td style="padding:10px;border:1px solid #eee;color:#b45309;"><strong>${reason}</strong></td>
                                </tr>
                                <tr style="background:#f9f9f9;">
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Description</td>
                                    <td style="padding:10px;border:1px solid #eee;">${description}</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px;font-weight:bold;border:1px solid #eee;">Amount</td>
                                    <td style="padding:10px;border:1px solid #eee;">₹${order.amount}</td>
                                </tr>
                            </table>
 
                            ${imageUrl ? `
                            <div style="margin:16px 0;">
                                <p style="font-weight:bold;margin-bottom:8px;">Proof Image:</p>
                                <img src="${imageUrl}" alt="proof" style="max-width:100%;border-radius:8px;border:1px solid #eee;" />
                            </div>` : ''}
 
                            <p style="color:#555;font-size:13px;margin-top:16px;">
                                Login to your <a href="${process.env.FRONTEND_URL}/owner" style="color:#41334e;">Dashboard</a> to Accept or Decline this request.
                            </p>
                        </div>
                    </div>
                `
            })
        }
 
        return res.json({ success: true, message: "Exchange request submitted successfully" })
 
    } catch (error) {
        console.log("requestExchange error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

export const handleExchangeDecision = async (req, res) => {
    try {
        const { orderId, decision, adminNote } = req.body
        // decision: "Exchange Accepted" | "Exchange Declined"
 
        const order = await Order.findById(orderId).populate("items.products")
        if (!order) return res.json({ success: false, message: "Order not found" })
 
        await Order.findByIdAndUpdate(orderId, {
            status: decision,
            adminExchangeNote: adminNote || ""
        })
 
        const user = await User.findById(order.userId)
        const productTitles = order.items.map(i => i.products?.title || "Unknown").join(", ")
        const isAccepted = decision === "Exchange Accepted"
 
        // ── Email to Customer ──
        if (user?.email) {
            await transporter.sendMail({
                from: process.env.SMTP_SENDER_EMAIL,
                to: user.email,
                subject: `Exchange Request ${isAccepted ? "Accepted ✅" : "Declined ❌"} – Radha Lakshmi (#${orderId})`,
                html: `
                    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
                        <div style="background:${isAccepted ? "#41334e" : "#c0392b"};padding:24px;text-align:center;">
                            <h1 style="color:#fff;margin:0;font-size:22px;">Radha Lakshmi</h1>
                            <p style="color:#e0d8e8;margin:4px 0 0;">Exchange Request ${isAccepted ? "Accepted" : "Declined"}</p>
                        </div>
                        <div style="padding:28px;">
                            <p style="font-size:16px;">Hi <strong>${user.name || "Customer"}</strong>,</p>
                            <p style="color:#555;">
                                Your exchange request for <strong>${productTitles}</strong> has been 
                                <strong style="color:${isAccepted ? "#16a34a" : "#c0392b"};">${isAccepted ? "accepted" : "declined"}</strong>.
                            </p>
 
                            ${adminNote ? `
                            <div style="background:${isAccepted ? "#f0fdf4" : "#fff5f5"};border-left:4px solid ${isAccepted ? "#16a34a" : "#c0392b"};padding:12px 16px;border-radius:4px;margin:16px 0;">
                                <strong>Note from Radha Lakshmi:</strong><br/>
                                <p style="margin:6px 0 0;color:#555;">${adminNote}</p>
                            </div>` : ""}
 
                            ${isAccepted ? `
                            <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:12px 16px;border-radius:4px;margin:16px 0;">
                                <strong>What happens next?</strong><br/>
                                Our delivery team will contact you to arrange the exchange. Please keep the original product ready for pickup.
                            </div>` : `
                            <div style="background:#fff5f5;border-left:4px solid #c0392b;padding:12px 16px;border-radius:4px;margin:16px 0;">
                                We're sorry we couldn't process your exchange this time. If you have further questions, please contact us via our <a href="${process.env.FRONTEND_URL}/Contact">Contact page</a>.
                            </div>`}
 
                            <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                        </div>
                    </div>
                `
            })
        }
 
        return res.json({ success: true, message: `Exchange ${isAccepted ? "accepted" : "declined"} successfully` })
 
    } catch (error) {
        console.log("handleExchangeDecision error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

export const clearDashboard = async (req, res) => {
    try {
        await Order.updateMany(
            { status: { $in: ['Delivered', 'Cancelled'] } },
            { archivedByAdmin: true }
        )
        res.json({ success: true, message: "Dashboard cleared successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}