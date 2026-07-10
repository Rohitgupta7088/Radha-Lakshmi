// import GiftPool from "../models/GiftPool.js"
// import Order from "../models/Order.js"
// import Product from "../models/Product.js"
// import User from "../models/User.js"
// import transporter from "../config/nodemailer.js"
// import { getAuth } from "@clerk/express"
// import { v2 as cloudinary } from "cloudinary"

// const FRONTEND_URL = process.env.FRONTEND_URL || "https://radha-lakshmi.vercel.app"

// // ─── Helper: send email ───
// const sendEmail = async (to, subject, html) => {
//     if (!to) return
//     await transporter.sendMail({ from: process.env.SMTP_SENDER_EMAIL, to, subject, html })
// }

// // ─── Helper: contributor wall HTML ───
// const contributorWallHtml = (contributors) => {
//     const names = contributors.filter(c => c.isPaid).map(c => c.name)
//     if (!names.length) return ""
//     return `<p style="color:#555;margin-top:8px;">💜 Contributed by: <strong>${names.join(", ")}</strong></p>`
// }

// // ─────────────────────────────────────────
// // 1. CREATE GIFT POOL
// // ─────────────────────────────────────────
// export const createGiftPool = async (req, res) => {
//     try {
//         const { userId } = getAuth(req)
//         if (!userId) return res.json({ success: false, message: "Not Authorized" })

//         const { products, wrapTogether, occasion, recipientName, recipientEmail, personalMessage, minContribution, deadline } = req.body

//         if (!products?.length) return res.json({ success: false, message: "Select at least one product" })

//         // Calculate target amount from product prices
//         let targetAmount = 0
//         for (const item of products) {
//             const product = await Product.findById(item.productId)
//             if (!product) return res.json({ success: false, message: `Product not found: ${item.productId}` })
//             const price = product.price?.[item.size]
//             if (!price) return res.json({ success: false, message: `Price not found for size ${item.size}` })
//             targetAmount += price * item.quantity
//         }

//         const pool = await GiftPool.create({
//             organizerUserId: userId,
//             products,
//             wrapTogether: wrapTogether || false,
//             occasion,
//             recipientName,
//             recipientEmail: recipientEmail || "",
//             personalMessage: personalMessage || "",
//             minContribution: minContribution || 0,
//             targetAmount,
//             deadline: new Date(deadline),
//         })

//         // Email to organizer
//         const organizer = await User.findById(userId)
//         const poolUrl = `${FRONTEND_URL}/gift/${pool.poolId}`
//         const whatsappMsg = encodeURIComponent(`Hey! We're gifting ${recipientName} beautiful bangles from Radha Lakshmi 💍 Contribute here: ${poolUrl} — Deadline: ${new Date(deadline).toDateString()}`)

//         await sendEmail(organizer?.email, `🎁 Your Gift Pool is Live – Radha Lakshmi`, `
//             <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
//                 <div style="background:#41334e;padding:24px;text-align:center;">
//                     <h1 style="color:#fff;margin:0;">Radha Lakshmi</h1>
//                     <p style="color:#e0d8e8;margin:4px 0 0;">Your Gift Pool is Live! 🎁</p>
//                 </div>
//                 <div style="padding:28px;">
//                     <p>Hi <strong>${organizer?.name || "Organizer"}</strong>,</p>
//                     <p>Your gift pool for <strong>${recipientName}</strong> is live! Share the link below with friends and family:</p>
//                     <div style="background:#f3f0f7;padding:16px;border-radius:8px;text-align:center;margin:16px 0;">
//                         <a href="${poolUrl}" style="color:#41334e;font-weight:bold;font-size:16px;">${poolUrl}</a>
//                     </div>
//                     <a href="https://wa.me/?text=${whatsappMsg}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;margin-bottom:16px;">Share on WhatsApp 💬</a>
//                     <table style="width:100%;border-collapse:collapse;margin:16px 0;">
//                         <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Recipient</td><td style="padding:10px;border:1px solid #eee;">${recipientName}</td></tr>
//                         <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Target Amount</td><td style="padding:10px;border:1px solid #eee;">₹${targetAmount}</td></tr>
//                         <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Occasion</td><td style="padding:10px;border:1px solid #eee;">${occasion}</td></tr>
//                         <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Deadline</td><td style="padding:10px;border:1px solid #eee;">${new Date(deadline).toDateString()}</td></tr>
//                     </table>
//                     <p style="color:#999;font-size:13px;">— Team Radha Lakshmi</p>
//                 </div>
//             </div>
//         `)

//         res.json({ success: true, poolId: pool.poolId, targetAmount })

//     } catch (error) {
//         console.log("createGiftPool error:", error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

// // ─────────────────────────────────────────
// // 2. GET POOL DETAILS (public)
// // ─────────────────────────────────────────
// export const getGiftPool = async (req, res) => {
//     try {
//         const { poolId } = req.params

//         const pool = await GiftPool.findOne({ poolId }).populate("products.productId")
//         if (!pool) return res.json({ success: false, message: "Gift pool not found" })

//         // Check if expired
//         if (pool.status === 'active' && new Date() > new Date(pool.deadline)) {
//             await GiftPool.findOneAndUpdate({ poolId }, { status: 'expired' })
//             pool.status = 'expired'
//         }

//         res.json({ success: true, pool })

//     } catch (error) {
//         console.log("getGiftPool error:", error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

// // ─────────────────────────────────────────
// // 3. ADD CONTRIBUTION (COD)
// // ─────────────────────────────────────────
// export const addContribution = async (req, res) => {
//     try {
//         const { poolId } = req.params
//         const { name, amount, paymentMethod } = req.body

//         const pool = await GiftPool.findOne({ poolId })
//         if (!pool) return res.json({ success: false, message: "Pool not found" })
//         if (pool.status !== 'active') return res.json({ success: false, message: `Pool is ${pool.status}` })
//         if (new Date() > new Date(pool.deadline)) return res.json({ success: false, message: "Pool deadline has passed" })
//         if (pool.minContribution > 0 && amount < pool.minContribution) {
//             return res.json({ success: false, message: `Minimum contribution is ₹${pool.minContribution}` })
//         }

//         const contributor = { name, amount, paymentMethod, isPaid: paymentMethod === 'COD', paidAt: paymentMethod === 'COD' ? new Date() : null }

//         pool.contributors.push(contributor)
//         if (paymentMethod === 'COD') pool.collectedAmount += amount

//         // Check if goal reached
//         if (pool.collectedAmount >= pool.targetAmount) pool.status = 'completed'

//         await pool.save()

//         // Email to contributor
//         const organizerUser = await User.findById(pool.organizerUserId)
//         await sendEmail(null, '', '') // placeholder — contributor email below

//         if (paymentMethod === 'COD') {
//             // Notify organizer
//             await sendEmail(organizerUser?.email, `💰 New Contribution – ${name} contributed ₹${amount}`, `
//                 <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;border:1px solid #eee;border-radius:10px;">
//                     <h2 style="color:#41334e;">New Contribution Received!</h2>
//                     <p><strong>${name}</strong> contributed <strong>₹${amount}</strong> to ${pool.recipientName}'s gift pool.</p>
//                     <p>Progress: ₹${pool.collectedAmount} of ₹${pool.targetAmount} collected.</p>
//                     ${pool.status === 'completed' ? `<div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:12px;border-radius:4px;"><strong>🎉 Goal Reached!</strong> You can now place the order.</div>` : ''}
//                     <a href="${FRONTEND_URL}/gift/${poolId}/status" style="display:inline-block;margin-top:16px;background:#41334e;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">View Pool Status</a>
//                 </div>
//             `)
//         }

//         res.json({ success: true, message: "Contribution added!", collectedAmount: pool.collectedAmount, status: pool.status })

//     } catch (error) {
//         console.log("addContribution error:", error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

// // ─────────────────────────────────────────
// // 4. PLACE ORDER AFTER GOAL REACHED
// // ─────────────────────────────────────────
// export const placeGiftOrder = async (req, res) => {
//     try {
//         const { userId } = getAuth(req)
//         if (!userId) return res.json({ success: false, message: "Not Authorized" })

//         const { poolId, addressId } = req.body

//         const pool = await GiftPool.findOne({ poolId }).populate("products.productId")
//         if (!pool) return res.json({ success: false, message: "Pool not found" })
//         if (pool.organizerUserId !== userId) return res.json({ success: false, message: "Only the organizer can place the order" })
//         if (pool.status !== 'completed') return res.json({ success: false, message: "Pool goal not reached yet" })

//         // Build order items
//         const items = pool.products.map(p => ({
//             products: p.productId._id,
//             quantity: p.quantity,
//             size: p.size,
//         }))

//         // Place order
//         const order = await Order.create({
//             userId,
//             items,
//             amount: pool.targetAmount,
//             address: addressId,
//             status: 'Order Placed',
//             paymentMethod: 'Gift Pool',
//             isPaid: true,
//         })

//         pool.orderId = order._id
//         pool.deliveryAddress = addressId
//         pool.status = 'ordered'
//         await pool.save()

//         // Email to all contributors
//         const paidContributors = pool.contributors.filter(c => c.isPaid)
//         const productNames = pool.products.map(p => p.productId?.title || "Bangle").join(", ")

//         for (const contributor of paidContributors) {
//             // We don't store contributor emails — notify organizer only in this version
//         }

//         // Email to organizer
//         const organizer = await User.findById(userId)
//         await sendEmail(organizer?.email, `📦 Gift Order Placed – Radha Lakshmi`, `
//             <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;border:1px solid #eee;border-radius:10px;">
//                 <div style="background:#41334e;padding:24px;text-align:center;border-radius:10px 10px 0 0;margin:-28px -28px 28px;">
//                     <h1 style="color:#fff;margin:0;">Order Placed! 🎁</h1>
//                 </div>
//                 <p>The gift order for <strong>${pool.recipientName}</strong> has been placed successfully.</p>
//                 <table style="width:100%;border-collapse:collapse;margin:16px 0;">
//                     <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td><td style="padding:10px;border:1px solid #eee;">${order._id}</td></tr>
//                     <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td><td style="padding:10px;border:1px solid #eee;">${productNames}</td></tr>
//                     <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Amount</td><td style="padding:10px;border:1px solid #eee;">₹${pool.targetAmount}</td></tr>
//                     <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Recipient</td><td style="padding:10px;border:1px solid #eee;">${pool.recipientName}</td></tr>
//                 </table>
//                 ${contributorWallHtml(paidContributors)}
//                 <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
//             </div>
//         `)

//         // Email to recipient if email provided
//         if (pool.recipientEmail) {
//             await sendEmail(pool.recipientEmail, `🎁 You have a gift coming! – Radha Lakshmi`, `
//                 <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;border:1px solid #eee;border-radius:10px;">
//                     <div style="background:#41334e;padding:24px;text-align:center;border-radius:10px 10px 0 0;margin:-28px -28px 28px;">
//                         <h1 style="color:#fff;margin:0;">You have a gift! 🎀</h1>
//                     </div>
//                     <p>Hi <strong>${pool.recipientName}</strong>,</p>
//                     <p>Your friends have sent you a beautiful gift from Radha Lakshmi!</p>
//                     ${pool.personalMessage ? `<div style="background:#f3f0f7;padding:16px;border-radius:8px;margin:16px 0;font-style:italic;">"${pool.personalMessage}"</div>` : ''}
//                     <p><strong>Occasion:</strong> ${pool.occasion}</p>
//                     <p><strong>Gift:</strong> ${productNames}</p>
//                     ${pool.wrapTogether ? `<p>🎀 Your gifts have been wrapped together as one special bundle!</p>` : ''}
//                     ${contributorWallHtml(paidContributors)}
//                     <p style="color:#555;margin-top:16px;">Your gift will be on its way soon. Stay excited! 💜</p>
//                     <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
//                 </div>
//             `)
//         }

//         res.json({ success: true, message: "Gift order placed successfully!", orderId: order._id })

//     } catch (error) {
//         console.log("placeGiftOrder error:", error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

// // ─────────────────────────────────────────
// // 5. EXTEND DEADLINE
// // ─────────────────────────────────────────
// export const extendDeadline = async (req, res) => {
//     try {
//         const { userId } = getAuth(req)
//         const { poolId } = req.body

//         const pool = await GiftPool.findOne({ poolId })
//         if (!pool) return res.json({ success: false, message: "Pool not found" })
//         if (pool.organizerUserId !== userId) return res.json({ success: false, message: "Unauthorized" })
//         if (pool.status === 'ordered') return res.json({ success: false, message: "Order already placed" })

//         const newDeadline = new Date(pool.deadline)
//         newDeadline.setDate(newDeadline.getDate() + 7)

//         await GiftPool.findOneAndUpdate({ poolId }, { deadline: newDeadline, status: 'active' })

//         res.json({ success: true, message: "Deadline extended by 7 days", newDeadline })

//     } catch (error) {
//         console.log("extendDeadline error:", error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

// // ─────────────────────────────────────────
// // 6. GET MY POOLS (organizer)
// // ─────────────────────────────────────────
// export const getMyPools = async (req, res) => {
//     try {
//         const { userId } = getAuth(req)
//         if (!userId) return res.json({ success: false, message: "Not Authorized" })

//         const pools = await GiftPool.find({ organizerUserId: userId })
//             .populate("products.productId")
//             .sort({ createdAt: -1 })

//         res.json({ success: true, pools })

//     } catch (error) {
//         console.log("getMyPools error:", error.message)
//         res.json({ success: false, message: error.message })
//     }
// }



import GiftPool from "../models/GiftPool.js"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import User from "../models/User.js"
import transporter from "../config/nodemailer.js"
import { getAuth } from "@clerk/express"
import { v2 as cloudinary } from "cloudinary"
import { nanoid } from "nanoid"
import { Cashfree, CFEnvironment } from "cashfree-pg"

const FRONTEND_URL = process.env.FRONTEND_URL || "https://radha-lakshmi.vercel.app"

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY,
)

// ─── Helper: send email ───
const sendEmail = async (to, subject, html) => {
    if (!to) return
    await transporter.sendMail({ from: process.env.SMTP_SENDER_EMAIL, to, subject, html })
}

// ─── Helper: contributor wall HTML ───
const contributorWallHtml = (contributors) => {
    const names = contributors.filter(c => c.isPaid).map(c => c.name)
    if (!names.length) return ""
    return `<p style="color:#555;margin-top:8px;">💜 Contributed by: <strong>${names.join(", ")}</strong></p>`
}

// ─── Helper: build a Cashfree order for a gift-pool payment ───
const createCashfreeOrder = async ({ orderId, amount, name, email, phone, returnUrl, origin }) => {
    const cfOrder = await cashfree.PGCreateOrder({
        order_id: orderId,
        order_amount: parseFloat(Number(amount).toFixed(2)),
        order_currency: "INR",
        customer_details: {
            customer_id: (email || orderId).toString().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 50) || "customer",
            customer_email: email || "guest@radhalakshmi.com",
            customer_phone: phone || "9999999999",
            customer_name: name || "Guest",
        },
        order_meta: {
            return_url: returnUrl,
            notify_url: `${process.env.BACKEND_URL || origin}/api/gift/cashfree/webhook`,
        },
    })
    return cfOrder
}

// ─── Helper: organizer "pool is live" email ───
const sendPoolLiveEmail = async (pool, organizer) => {
    const poolUrl = `${FRONTEND_URL}/gift/${pool.poolId}`
    const whatsappMsg = encodeURIComponent(`Hey! We're gifting ${pool.recipientName} beautiful bangles from Radha Lakshmi 💍 Contribute here: ${poolUrl} — Deadline: ${new Date(pool.deadline).toDateString()}`)

    await sendEmail(organizer?.email, `🎁 Your Gift Pool is Live – Radha Lakshmi`, `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:10px;overflow:hidden;">
            <div style="background:#41334e;padding:24px;text-align:center;">
                <h1 style="color:#fff;margin:0;">Radha Lakshmi</h1>
                <p style="color:#e0d8e8;margin:4px 0 0;">Your Gift Pool is Live! 🎁</p>
            </div>
            <div style="padding:28px;">
                <p>Hi <strong>${organizer?.username || "Organizer"}</strong>,</p>
                <p>Thanks for your contribution of <strong>₹${pool.organizerPayment.amount}</strong>! Your gift pool for <strong>${pool.recipientName}</strong> is now live. Share the link below with friends and family:</p>
                <div style="background:#f3f0f7;padding:16px;border-radius:8px;text-align:center;margin:16px 0;">
                    <a href="${poolUrl}" style="color:#41334e;font-weight:bold;font-size:16px;">${poolUrl}</a>
                </div>
                <a href="https://wa.me/?text=${whatsappMsg}" style="display:inline-block;background:#25D366;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;margin-bottom:16px;">Share on WhatsApp 💬</a>
                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                    <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Recipient</td><td style="padding:10px;border:1px solid #eee;">${pool.recipientName}</td></tr>
                    <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Your Contribution</td><td style="padding:10px;border:1px solid #eee;">₹${pool.organizerPayment.amount}</td></tr>
                    <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Target Amount</td><td style="padding:10px;border:1px solid #eee;">₹${pool.targetAmount}</td></tr>
                    <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Occasion</td><td style="padding:10px;border:1px solid #eee;">${pool.occasion}</td></tr>
                    <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Deadline</td><td style="padding:10px;border:1px solid #eee;">${new Date(pool.deadline).toDateString()}</td></tr>
                </table>
                <p style="color:#999;font-size:13px;">— Team Radha Lakshmi</p>
            </div>
        </div>
    `)
}

// ─────────────────────────────────────────
// 1. CREATE GIFT POOL (draft) + START ORGANIZER PAYMENT
// ─────────────────────────────────────────
export const createGiftPool = async (req, res) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) return res.json({ success: false, message: "Not Authorized" })

        const { origin } = req.headers
        const {
            products, wrapTogether, occasion, recipientName, recipientEmail,
            personalMessage, minContribution, deadline, contributionAmount,
        } = req.body

        if (!products?.length) return res.json({ success: false, message: "Select at least one product" })

        const payAmount = Number(contributionAmount)
        if (!payAmount || payAmount <= 0) return res.json({ success: false, message: "Enter the amount you want to contribute" })
        if (minContribution && payAmount < Number(minContribution)) {
            return res.json({ success: false, message: `Your contribution must be at least ₹${minContribution}` })
        }

        // Calculate target amount from product prices
        let targetAmount = 0
        for (const item of products) {
            const product = await Product.findById(item.productId)
            if (!product) return res.json({ success: false, message: `Product not found: ${item.productId}` })
            const price = product.price?.[item.size]
            if (!price) return res.json({ success: false, message: `Price not found for size ${item.size}` })
            targetAmount += price * item.quantity
        }

        const organizer = await User.findById(userId)
        const poolId = nanoid(8)
        const cashfreeOrderId = `gp_org_${poolId}`

        const pool = await GiftPool.create({
            poolId,
            organizerUserId: userId,
            products,
            wrapTogether: wrapTogether || false,
            occasion,
            recipientName,
            recipientEmail: recipientEmail || "",
            personalMessage: personalMessage || "",
            minContribution: minContribution || 0,
            targetAmount,
            deadline: new Date(deadline),
            status: 'pending_payment',
            organizerPayment: {
                name: organizer?.username || "",
                email: organizer?.email || "",
                amount: payAmount,
                cashfreeOrderId,
                isPaid: false,
            },
        })

        const returnUrl = `${FRONTEND_URL || origin}/gift/${poolId}/organizer-payment-return`

        let cfOrder
        try {
            cfOrder = await createCashfreeOrder({
                orderId: cashfreeOrderId,
                amount: payAmount,
                name: organizer?.username,
                email: organizer?.email,
                returnUrl,
                origin,
            })
        } catch (cfError) {
            // Don't leave an orphaned pending_payment pool behind if payment init fails
            await GiftPool.deleteOne({ poolId })
            throw cfError
        }

        res.json({
            success: true,
            poolId,
            targetAmount,
            payment_session_id: cfOrder.data.payment_session_id,
            cashfreeOrderId,
        })

    } catch (error) {
        const cfMessage = error?.response?.data?.message
        console.log("createGiftPool error:", error?.response?.data || error.message)
        res.json({ success: false, message: cfMessage || error.message })
    }
}

// ─────────────────────────────────────────
// 1b. VERIFY ORGANIZER PAYMENT → ACTIVATE POOL
// ─────────────────────────────────────────
export const verifyOrganizerPayment = async (req, res) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) return res.json({ success: false, message: "Not Authorized" })

        const { poolId } = req.params

        const pool = await GiftPool.findOne({ poolId })
        if (!pool) return res.json({ success: false, message: "Pool not found" })
        if (pool.organizerUserId !== userId) return res.json({ success: false, message: "Unauthorized" })

        // Already activated — nothing to do
        if (pool.organizerPayment.isPaid) {
            return res.json({ success: true, isPaid: true, status: pool.status, poolId: pool.poolId })
        }

        const cfOrder = await cashfree.PGFetchOrder(pool.organizerPayment.cashfreeOrderId)
        const orderStatus = cfOrder.data.order_status

        if (orderStatus === "PAID") {
            pool.organizerPayment.isPaid = true
            pool.organizerPayment.paidAt = new Date()
            pool.collectedAmount += pool.organizerPayment.amount
            pool.contributors.push({
                name: pool.organizerPayment.name || "Organizer",
                email: pool.organizerPayment.email,
                amount: pool.organizerPayment.amount,
                paymentMethod: 'cashfree',
                isPaid: true,
                paidAt: new Date(),
                cashfreeOrderId: pool.organizerPayment.cashfreeOrderId,
                isOrganizer: true,
            })
            pool.status = pool.collectedAmount >= pool.targetAmount ? 'completed' : 'active'
            await pool.save()

            const organizer = await User.findById(userId)
            await sendPoolLiveEmail(pool, organizer)

            return res.json({ success: true, isPaid: true, status: pool.status, poolId: pool.poolId })
        }
        else if (orderStatus === "ACTIVE") {
            return res.json({ success: true, isPaid: false, status: "pending" })
        }
        else {
            return res.json({ success: false, isPaid: false, status: orderStatus })
        }

    } catch (error) {
        console.log("verifyOrganizerPayment error:", error?.response?.data || error.message)
        res.json({ success: false, message: error.message })
    }
}

// ─────────────────────────────────────────
// 2. GET POOL DETAILS (public)
// ─────────────────────────────────────────
export const getGiftPool = async (req, res) => {
    try {
        const { poolId } = req.params

        const pool = await GiftPool.findOne({ poolId }).populate("products.productId")
        if (!pool) return res.json({ success: false, message: "Gift pool not found" })

        // Check if expired (only relevant once the pool has actually gone live)
        if (pool.status === 'active' && new Date() > new Date(pool.deadline)) {
            await GiftPool.findOneAndUpdate({ poolId }, { status: 'expired' })
            pool.status = 'expired'
        }

        res.json({ success: true, pool })

    } catch (error) {
        console.log("getGiftPool error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

// ─────────────────────────────────────────
// 3a. START A CONTRIBUTION PAYMENT (friend)
// ─────────────────────────────────────────
export const initContribution = async (req, res) => {
    try {
        const { poolId } = req.params
        const { name, email, amount, userId: contributorUserId } = req.body
        const { origin } = req.headers

        if (!name?.trim()) return res.json({ success: false, message: "Enter your name" })
        const payAmount = Number(amount)
        if (!payAmount || payAmount <= 0) return res.json({ success: false, message: "Enter a valid amount" })

        const pool = await GiftPool.findOne({ poolId })
        if (!pool) return res.json({ success: false, message: "Pool not found" })
        if (pool.status !== 'active') return res.json({ success: false, message: `Pool is not accepting contributions right now` })
        if (new Date() > new Date(pool.deadline)) return res.json({ success: false, message: "Pool deadline has passed" })
        if (pool.minContribution > 0 && payAmount < pool.minContribution) {
            return res.json({ success: false, message: `Minimum contribution is ₹${pool.minContribution}` })
        }

        const cashfreeOrderId = `gp_c_${poolId}_${nanoid(6)}`
        const returnUrl = `${FRONTEND_URL || origin}/gift/${poolId}/contribute-return?cid=${cashfreeOrderId}`

        const cfOrder = await createCashfreeOrder({
            orderId: cashfreeOrderId,
            amount: payAmount,
            name,
            email,
            returnUrl,
            origin,
        })

        // Record the contributor as "pending" — flipped to isPaid once payment is confirmed
        pool.contributors.push({
            name,
            email: email || "",
            userId: contributorUserId || "",
            amount: payAmount,
            paymentMethod: 'cashfree',
            isPaid: false,
            cashfreeOrderId,
        })
        await pool.save()

        res.json({
            success: true,
            payment_session_id: cfOrder.data.payment_session_id,
            cashfreeOrderId,
        })

    } catch (error) {
        const cfMessage = error?.response?.data?.message
        console.log("initContribution error:", error?.response?.data || error.message)
        res.json({ success: false, message: cfMessage || error.message })
    }
}

// ─────────────────────────────────────────
// 3b. VERIFY A CONTRIBUTION PAYMENT
// ─────────────────────────────────────────
export const verifyContribution = async (req, res) => {
    try {
        const { poolId } = req.params
        const { cashfreeOrderId } = req.body
        if (!cashfreeOrderId) return res.json({ success: false, message: "Missing payment reference" })

        const pool = await GiftPool.findOne({ poolId })
        if (!pool) return res.json({ success: false, message: "Pool not found" })

        const contributor = pool.contributors.find(c => c.cashfreeOrderId === cashfreeOrderId)
        if (!contributor) return res.json({ success: false, message: "Contribution not found" })

        if (contributor.isPaid) {
            return res.json({ success: true, isPaid: true, status: pool.status, collectedAmount: pool.collectedAmount })
        }

        const cfOrder = await cashfree.PGFetchOrder(cashfreeOrderId)
        const orderStatus = cfOrder.data.order_status

        if (orderStatus === "PAID") {
            contributor.isPaid = true
            contributor.paidAt = new Date()
            pool.collectedAmount += contributor.amount
            if (pool.collectedAmount >= pool.targetAmount && pool.status === 'active') pool.status = 'completed'
            await pool.save()

            // Notify organizer + contributor
            const organizerUser = await User.findById(pool.organizerUserId)
            await sendEmail(organizerUser?.email, `💰 New Contribution – ${contributor.name} contributed ₹${contributor.amount}`, `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;border:1px solid #eee;border-radius:10px;">
                    <h2 style="color:#41334e;">New Contribution Received!</h2>
                    <p><strong>${contributor.name}</strong> contributed <strong>₹${contributor.amount}</strong> to ${pool.recipientName}'s gift pool.</p>
                    <p>Progress: ₹${pool.collectedAmount} of ₹${pool.targetAmount} collected.</p>
                    ${pool.status === 'completed' ? `<div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:12px;border-radius:4px;"><strong>🎉 Goal Reached!</strong> You can now place the order.</div>` : ''}
                    <a href="${FRONTEND_URL}/gift/${poolId}/status" style="display:inline-block;margin-top:16px;background:#41334e;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">View Pool Status</a>
                </div>
            `)

            await sendEmail(contributor.email, `💜 Thank you for your contribution – Radha Lakshmi`, `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;border:1px solid #eee;border-radius:10px;">
                    <h2 style="color:#41334e;">Thank you, ${contributor.name}! 💜</h2>
                    <p>Your contribution of <strong>₹${contributor.amount}</strong> towards ${pool.recipientName}'s gift has been received successfully.</p>
                    <p>Progress: ₹${pool.collectedAmount} of ₹${pool.targetAmount} collected.</p>
                    <a href="${FRONTEND_URL}/gift/${poolId}" style="display:inline-block;margin-top:16px;background:#41334e;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">View Gift Pool</a>
                    <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                </div>
            `)

            return res.json({ success: true, isPaid: true, status: pool.status, collectedAmount: pool.collectedAmount })
        }
        else if (orderStatus === "ACTIVE") {
            return res.json({ success: true, isPaid: false, status: "pending" })
        }
        else {
            return res.json({ success: false, isPaid: false, status: orderStatus })
        }

    } catch (error) {
        console.log("verifyContribution error:", error?.response?.data || error.message)
        res.json({ success: false, message: error.message })
    }
}

// ─────────────────────────────────────────
// 3c. CASHFREE WEBHOOK (backup to polling, for both organizer + contributions)
// ─────────────────────────────────────────
export const giftCashfreeWebhook = async (req, res) => {
    try {
        const signature = req.headers["x-webhook-signature"]
        const timestamp = req.headers["x-webhook-timestamp"]

        let webhookEvent
        try {
            webhookEvent = cashfree.PGVerifyWebhookSignature(signature, req.rawBody, timestamp)
        } catch (err) {
            console.log("Gift Cashfree Webhook Signature Error:", err.message)
            return res.status(400).json({ success: false, message: "Invalid signature" })
        }

        const eventType = webhookEvent?.type
        const data = webhookEvent?.data

        if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
            const cfOrderId = data?.order?.order_id
            if (!cfOrderId) return res.json({ received: true })

            if (cfOrderId.startsWith('gp_org_')) {
                const poolId = cfOrderId.replace('gp_org_', '')
                const pool = await GiftPool.findOne({ poolId })
                if (pool && !pool.organizerPayment.isPaid) {
                    pool.organizerPayment.isPaid = true
                    pool.organizerPayment.paidAt = new Date()
                    pool.collectedAmount += pool.organizerPayment.amount
                    pool.contributors.push({
                        name: pool.organizerPayment.name || "Organizer",
                        email: pool.organizerPayment.email,
                        amount: pool.organizerPayment.amount,
                        paymentMethod: 'cashfree',
                        isPaid: true,
                        paidAt: new Date(),
                        cashfreeOrderId: cfOrderId,
                        isOrganizer: true,
                    })
                    pool.status = pool.collectedAmount >= pool.targetAmount ? 'completed' : 'active'
                    await pool.save()
                    const organizer = await User.findById(pool.organizerUserId)
                    await sendPoolLiveEmail(pool, organizer)
                }
            }
            else if (cfOrderId.startsWith('gp_c_')) {
                const poolId = cfOrderId.split('_')[2]
                const pool = await GiftPool.findOne({ poolId })
                if (pool) {
                    const contributor = pool.contributors.find(c => c.cashfreeOrderId === cfOrderId)
                    if (contributor && !contributor.isPaid) {
                        contributor.isPaid = true
                        contributor.paidAt = new Date()
                        pool.collectedAmount += contributor.amount
                        if (pool.collectedAmount >= pool.targetAmount && pool.status === 'active') pool.status = 'completed'
                        await pool.save()

                        const organizerUser = await User.findById(pool.organizerUserId)
                        await sendEmail(organizerUser?.email, `💰 New Contribution – ${contributor.name} contributed ₹${contributor.amount}`, `
                            <p><strong>${contributor.name}</strong> contributed <strong>₹${contributor.amount}</strong> to ${pool.recipientName}'s gift pool.</p>
                            <p>Progress: ₹${pool.collectedAmount} of ₹${pool.targetAmount} collected.</p>
                        `)
                        await sendEmail(contributor.email, `💜 Thank you for your contribution – Radha Lakshmi`, `
                            <p>Thank you, ${contributor.name}! Your contribution of <strong>₹${contributor.amount}</strong> has been received.</p>
                        `)
                    }
                }
            }
        }

        res.json({ received: true })

    } catch (error) {
        console.log("Gift Cashfree Webhook Error:", error.message)
        res.status(500).json({ received: false })
    }
}

// ─────────────────────────────────────────
// 4. PLACE ORDER AFTER GOAL REACHED
// ─────────────────────────────────────────
export const placeGiftOrder = async (req, res) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) return res.json({ success: false, message: "Not Authorized" })

        const { poolId, addressId } = req.body

        const pool = await GiftPool.findOne({ poolId }).populate("products.productId")
        if (!pool) return res.json({ success: false, message: "Pool not found" })
        if (pool.organizerUserId !== userId) return res.json({ success: false, message: "Only the organizer can place the order" })
        if (pool.status !== 'completed') return res.json({ success: false, message: "Pool goal not reached yet" })

        // Build order items
        const items = pool.products.map(p => ({
            products: p.productId._id,
            quantity: p.quantity,
            size: p.size,
        }))

        // Place order
        const order = await Order.create({
            userId,
            items,
            amount: pool.targetAmount,
            address: addressId,
            status: 'Order Placed',
            paymentMethod: 'Gift Pool',
            isPaid: true,
        })

        pool.orderId = order._id
        pool.deliveryAddress = addressId
        pool.status = 'ordered'
        await pool.save()

        const paidContributors = pool.contributors.filter(c => c.isPaid)
        const productNames = pool.products.map(p => p.productId?.title || "Bangle").join(", ")

        // Email to organizer
        const organizer = await User.findById(userId)
        await sendEmail(organizer?.email, `📦 Gift Order Placed – Radha Lakshmi`, `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;border:1px solid #eee;border-radius:10px;">
                <div style="background:#41334e;padding:24px;text-align:center;border-radius:10px 10px 0 0;margin:-28px -28px 28px;">
                    <h1 style="color:#fff;margin:0;">Order Placed! 🎁</h1>
                </div>
                <p>The gift order for <strong>${pool.recipientName}</strong> has been placed successfully.</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                    <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Order ID</td><td style="padding:10px;border:1px solid #eee;">${order._id}</td></tr>
                    <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Products</td><td style="padding:10px;border:1px solid #eee;">${productNames}</td></tr>
                    <tr style="background:#f9f9f9;"><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Amount</td><td style="padding:10px;border:1px solid #eee;">₹${pool.targetAmount}</td></tr>
                    <tr><td style="padding:10px;font-weight:bold;border:1px solid #eee;">Recipient</td><td style="padding:10px;border:1px solid #eee;">${pool.recipientName}</td></tr>
                </table>
                ${contributorWallHtml(paidContributors)}
                <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
            </div>
        `)

        // Email to every paying contributor who left an email address
        for (const contributor of paidContributors) {
            if (!contributor.email || contributor.isOrganizer) continue
            await sendEmail(contributor.email, `📦 The gift you contributed to has been ordered! – Radha Lakshmi`, `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;border:1px solid #eee;border-radius:10px;">
                    <p>Hi <strong>${contributor.name}</strong>,</p>
                    <p>Good news! The gift pool you contributed to for <strong>${pool.recipientName}</strong> has reached its goal and the order has been placed. 🎉</p>
                    <p><strong>Gift:</strong> ${productNames}</p>
                    ${contributorWallHtml(paidContributors)}
                    <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                </div>
            `)
        }

        // Email to recipient if email provided
        if (pool.recipientEmail) {
            await sendEmail(pool.recipientEmail, `🎁 You have a gift coming! – Radha Lakshmi`, `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:28px;border:1px solid #eee;border-radius:10px;">
                    <div style="background:#41334e;padding:24px;text-align:center;border-radius:10px 10px 0 0;margin:-28px -28px 28px;">
                        <h1 style="color:#fff;margin:0;">You have a gift! 🎀</h1>
                    </div>
                    <p>Hi <strong>${pool.recipientName}</strong>,</p>
                    <p>Your friends have sent you a beautiful gift from Radha Lakshmi!</p>
                    ${pool.personalMessage ? `<div style="background:#f3f0f7;padding:16px;border-radius:8px;margin:16px 0;font-style:italic;">"${pool.personalMessage}"</div>` : ''}
                    <p><strong>Occasion:</strong> ${pool.occasion}</p>
                    <p><strong>Gift:</strong> ${productNames}</p>
                    ${pool.wrapTogether ? `<p>🎀 Your gifts have been wrapped together as one special bundle!</p>` : ''}
                    ${contributorWallHtml(paidContributors)}
                    <p style="color:#555;margin-top:16px;">Your gift will be on its way soon. Stay excited! 💜</p>
                    <p style="color:#999;font-size:13px;margin-top:24px;">— Team Radha Lakshmi</p>
                </div>
            `)
        }

        res.json({ success: true, message: "Gift order placed successfully!", orderId: order._id })

    } catch (error) {
        console.log("placeGiftOrder error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

// ─────────────────────────────────────────
// 5. EXTEND DEADLINE
// ─────────────────────────────────────────
export const extendDeadline = async (req, res) => {
    try {
        const { userId } = getAuth(req)
        const { poolId } = req.body

        const pool = await GiftPool.findOne({ poolId })
        if (!pool) return res.json({ success: false, message: "Pool not found" })
        if (pool.organizerUserId !== userId) return res.json({ success: false, message: "Unauthorized" })
        if (pool.status === 'ordered') return res.json({ success: false, message: "Order already placed" })
        if (pool.status === 'pending_payment') return res.json({ success: false, message: "Pool is not active yet" })

        const newDeadline = new Date(pool.deadline)
        newDeadline.setDate(newDeadline.getDate() + 7)

        await GiftPool.findOneAndUpdate({ poolId }, { deadline: newDeadline, status: 'active' })

        res.json({ success: true, message: "Deadline extended by 7 days", newDeadline })

    } catch (error) {
        console.log("extendDeadline error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

// ─────────────────────────────────────────
// 6. GET MY POOLS (organizer)
// ─────────────────────────────────────────
export const getMyPools = async (req, res) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) return res.json({ success: false, message: "Not Authorized" })

        const pools = await GiftPool.find({ organizerUserId: userId })
            .populate("products.productId")
            .sort({ createdAt: -1 })

        res.json({ success: true, pools })

    } catch (error) {
        console.log("getMyPools error:", error.message)
        res.json({ success: false, message: error.message })
    }
}

// ─────────────────────────────────────────
// 7. GET MY GIFT ACTIVITY (organizer pools + contributor pools)
//    Used by /my-orders to show gift pool entries
// ─────────────────────────────────────────
export const getMyGiftActivity = async (req, res) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) return res.json({ success: false, message: "Not Authorized" })

        // Pools where user is organizer AND payment is confirmed (status != pending_payment)
        const organizedPools = await GiftPool.find({
            organizerUserId: userId,
            status: { $ne: 'pending_payment' },
        }).populate("products.productId").sort({ createdAt: -1 })

        // Pools where user contributed as a logged-in contributor (isPaid = true)
        const contributedPools = await GiftPool.find({
            organizerUserId: { $ne: userId }, // exclude pools they organized (already above)
            contributors: {
                $elemMatch: { userId, isPaid: true }
            },
        }).populate("products.productId").sort({ createdAt: -1 })

        res.json({ success: true, organizedPools, contributedPools })

    } catch (error) {
        console.log("getMyGiftActivity error:", error.message)
        res.json({ success: false, message: error.message })
    }
}
