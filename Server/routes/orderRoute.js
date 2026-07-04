// import express from "express"
// import { allOrders, placeOrderCOD, placeOrderStripe, updateStatus, userOrders } from "../controllers/orderController.js"
// import auth, { authUser } from "../middleware/authMiddleware.js"

// const orderRouter = express.Router()

// // For Admin
// orderRouter.get('/', authUser, allOrders)
// orderRouter.post('/status', authUser, updateStatus)

// // For payment
// orderRouter.post('/cod', authUser, placeOrderCOD)
// orderRouter.post('/stripe', authUser, placeOrderStripe)

// // For user
// orderRouter.get('/userorders', authUser, userOrders)

// export default orderRouter




// import express from "express"
// import { allOrders, cashfreeWebhook, markUPIPaid, placeOrderCOD, placeOrderCashfree, placeOrderStripe, placeOrderUPIManual, updateStatus, userOrders, verifyCashfreePayment } from "../controllers/orderController.js"
// import auth, { authUser } from "../middleware/authMiddleware.js"

// const orderRouter = express.Router()

// // For Admin
// orderRouter.get('/', authUser, allOrders)
// orderRouter.post('/status', authUser, updateStatus)
// orderRouter.post('/upi/mark-paid', authUser, markUPIPaid)

// // For payment
// orderRouter.post('/cod', authUser, placeOrderCOD)
// orderRouter.post('/stripe', authUser, placeOrderStripe)
// orderRouter.post('/upi', authUser, placeOrderUPIManual)
// orderRouter.post('/cashfree', authUser, placeOrderCashfree)
// orderRouter.post('/cashfree/verify', authUser, verifyCashfreePayment)
// orderRouter.post('/cashfree/webhook', cashfreeWebhook)

// // For user
// orderRouter.get('/userorders', authUser, userOrders)

// export default orderRouter




import express from "express"
import { 
    allOrders, cashfreeWebhook, markUPIPaid, 
    placeOrderCOD, placeOrderCashfree, placeOrderStripe, 
    placeOrderUPIManual, updateStatus, userOrders, 
    verifyCashfreePayment, cancelOrder, requestExchange, handleExchangeDecision
} from "../controllers/orderController.js"
import auth, { authUser } from "../middleware/authMiddleware.js"
import { upload } from "../middleware/multer.js"

const orderRouter = express.Router()

// For Admin
orderRouter.get('/', authUser, allOrders)
orderRouter.post('/status', authUser, updateStatus)
orderRouter.post('/upi/mark-paid', authUser, markUPIPaid)
orderRouter.post('/exchange-decision', authUser, handleExchangeDecision)

// For payment
orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/upi', authUser, placeOrderUPIManual)
orderRouter.post('/cashfree', authUser, placeOrderCashfree)
orderRouter.post('/cashfree/verify', authUser, verifyCashfreePayment)
orderRouter.post('/cashfree/webhook', cashfreeWebhook)

// For user
orderRouter.get('/userorders', authUser, userOrders)
orderRouter.post('/cancel', authUser, cancelOrder)
orderRouter.post('/exchange', authUser, upload.single('image'), requestExchange)

export default orderRouter