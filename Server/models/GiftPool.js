// import mongoose from "mongoose"
// import { nanoid } from "nanoid"

// const contributorSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     amount: { type: Number, required: true },
//     paymentMethod: { type: String, required: true },
//     isPaid: { type: Boolean, default: false },
//     paidAt: { type: Date },
//     cashfreeOrderId: { type: String, default: "" },
// }, { _id: false })

// const giftPoolSchema = new mongoose.Schema({
//     poolId: { type: String, default: () => nanoid(8), unique: true },
//     organizerUserId: { type: String, required: true },

//     // Products
//     products: [{
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//         size: { type: String, required: true },
//         quantity: { type: Number, required: true, default: 1 },
//     }],
//     wrapTogether: { type: Boolean, default: false },

//     // Gift details
//     occasion: { type: String, enum: ['Wedding', 'Birthday', 'Festival', 'Anniversary', 'Baby Shower'], required: true },
//     recipientName: { type: String, required: true },
//     recipientEmail: { type: String, default: "" },
//     personalMessage: { type: String, default: "" },
//     minContribution: { type: Number, default: 0 },

//     // Financials
//     targetAmount: { type: Number, required: true },
//     collectedAmount: { type: Number, default: 0 },

//     // Timeline
//     deadline: { type: Date, required: true },
//     status: { type: String, enum: ['active', 'completed', 'expired', 'ordered'], default: 'active' },

//     // Contributors
//     contributors: [contributorSchema],

//     // After goal reached
//     deliveryAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', default: null },
//     orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },

// }, { timestamps: true })

// const GiftPool = mongoose.models.GiftPool || mongoose.model("GiftPool", giftPoolSchema)
// export default GiftPool




import mongoose from "mongoose"
import { nanoid } from "nanoid"

const contributorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, default: "" },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    cashfreeOrderId: { type: String, default: "" },
    isOrganizer: { type: Boolean, default: false },
}, { _id: false })

const giftPoolSchema = new mongoose.Schema({
    poolId: { type: String, default: () => nanoid(8), unique: true },
    organizerUserId: { type: String, required: true },

    // Products
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
    }],
    wrapTogether: { type: Boolean, default: false },

    // Gift details
    occasion: { type: String, enum: ['Wedding', 'Birthday', 'Festival', 'Anniversary', 'Baby Shower'], required: true },
    recipientName: { type: String, required: true },
    recipientEmail: { type: String, default: "" },
    personalMessage: { type: String, default: "" },
    minContribution: { type: Number, default: 0 },

    // Financials
    targetAmount: { type: Number, required: true },
    collectedAmount: { type: Number, default: 0 },

    // Organizer's own upfront payment (required to activate the pool)
    organizerPayment: {
        name: { type: String, default: "" },
        email: { type: String, default: "" },
        amount: { type: Number, default: 0 },
        cashfreeOrderId: { type: String, default: "" },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
    },

    // Timeline
    deadline: { type: Date, required: true },
    // pending_payment -> organizer has filled the form but hasn't paid yet (pool/link not live)
    status: { type: String, enum: ['pending_payment', 'active', 'completed', 'expired', 'ordered'], default: 'pending_payment' },

    // Contributors
    contributors: [contributorSchema],

    // After goal reached
    deliveryAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', default: null },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },

}, { timestamps: true })

const GiftPool = mongoose.models.GiftPool || mongoose.model("GiftPool", giftPoolSchema)
export default GiftPool