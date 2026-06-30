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

import transporter from "../config/nodemailer.js"
import { MessageAttempt } from "svix/dist/api/messageAttempt.js"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import User from "../models/User.js"
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

        const mailOptions = {
            from: process.env.SMTP_SENDER_EMAIL,
            to: user.email,
            subject: "Order Details (UPI Payment - Pending Confirmation)",
            html: `
                <h2>Your Delivery Details</h2>
                <p>Thank You for your Order! We've received your UPI payment claim and will confirm it shortly. Below are your Order details:</p>
                <li><strong>Order ID:</strong> ${populatedOrder._id}</li>
                <li><strong>Products Name: </strong> ${productTitles}</li>
                <li><strong>Address:</strong> ${addressString}</li>
                <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "$"}${populatedOrder.amount}</li>
                <p>Your order will be processed once payment is confirmed.</p>
            `
        }

        await transporter.sendMail(mailOptions)

        return res.json({success: true, message:"Order Placed - Pending Payment Confirmation"})

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

        await transporter.sendMail({
            from: process.env.SMTP_SENDER_EMAIL,
            to: user.email,
            subject: `Order Details (${methodLabel})`,
            html: `
                <h2>Your Delivery Details</h2>
                <p>Thank You for your Order! Your payment was successful. Below are your Order details:</p>
                <li><strong>Order ID:</strong> ${populatedOrder._id}</li>
                <li><strong>Products Name:</strong> ${productTitles}</li>
                <li><strong>Address:</strong> ${addressString}</li>
                <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "₹"}${populatedOrder.amount}</li>
                <p>You will get your delivery in 1-2 Days.</p>
            `
        })
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
        const orders = await Order.find({$or:[
            {paymentMethod: "COD"},
            {paymentMethod: "UPI"},
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