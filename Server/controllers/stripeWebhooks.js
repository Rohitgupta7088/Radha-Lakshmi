// import stripe from "stripe"
// import Order from "../models/Order.js"
// import User from "../models/User.js"
// import { setFips } from "node:crypto"

// export const stripeWebhooks = async (request, response)=>{
//     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);    const sig = request.headers["stripe-signature"];
//     let event;

//     try {
//         event = stripeInstance.webhooks.constructEvent(
//             request.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET,
//         )
//     } catch (error) {
//         response.status(400).send(`Webhook Error: ${error.message}`)
//     }

//     if(event.type === "payment_intent.succeeded"){
//         const paymentIntent = event.data.object;
//         const paymentintentId = paymentintentId;

//         const session = await stripeInstance.checkout.sessions.list({
//             payment_intent: paymentintentId,
//         })

//         const {orderid, userId} = session.data[0].metadata

//         await Order.findByIdAndUpdate(orderId, {isPaid: true})

//         await User.findByIdAndUpdate(userId, {cartData: {}})
//     }
//     else{
//         console.log("Unhandled event type:", event.type)
//     }

//     response.json({received: true})
// }




import stripe from "stripe"
import Order from "../models/Order.js"
import User from "../models/User.js"
import transporter from "../config/nodemailer.js"
import { setFips } from "node:crypto"

export const stripeWebhooks = async (request, response)=>{
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        )
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`)
    }

    try {
        if(event.type === "payment_intent.succeeded"){
            const paymentIntent = event.data.object;
            const paymentintentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentintentId,
            })

            const {orderId, userId} = session.data[0].metadata

            await Order.findByIdAndUpdate(orderId, {isPaid: true})

            await User.findByIdAndUpdate(userId, {cartData: {}})

            const populatedOrder = await Order.findById(orderId).populate("items.products").populate("address")
            const user = await User.findById(userId)

            const productTitles = populatedOrder.items.map(item => item.products?.title || "Unknown").join(", ")
            const addressString = populatedOrder.address ? `${populatedOrder.address.street || "N/A"}, ${populatedOrder.address.city || "N/A"}, ${populatedOrder.address.state || "N/A"}, ${populatedOrder.address.country || "N/A"}` : "No Address";

            const mailOptions = {
                from: process.env.SMTP_SENDER_EMAIL,
                to: user.email,
                subject: "Order Details (Stripe Payment)",
                html: `
                    <h2>Your Delivery Details</h2>
                    <p>Thank You for your Order! Your payment was successful. Below are your Order details:</p>
                    <li><strong>Order ID:</strong> ${populatedOrder._id}</li>
                    <li><strong>Products Name: </strong> ${productTitles}</li>
                    <li><strong>Address:</strong> ${addressString}</li>
                    <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "$"}${populatedOrder.amount}</li>
                    <p>You will get your delivery in 1-2 Days.</p>
                `
            }

            await transporter.sendMail(mailOptions)
        }
        else{
            console.log("Unhandled event type:", event.type)
        }

        response.json({received: true})
    } catch (error) {
        console.log("Stripe webhook handler error:", error.message)
        response.status(500).json({received: false, message: error.message})
    }
}