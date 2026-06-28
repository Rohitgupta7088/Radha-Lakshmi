import express from "express"
import { allOrders, placeOrderCOD, placeOrderStripe, updateStatus, userOrders } from "../controllers/orderController.js"
import auth, { authUser } from "../middleware/authMiddleware.js"

const orderRouter = express.Router()

// For Admin
orderRouter.get('/', authUser, allOrders)
orderRouter.post('/status', authUser, updateStatus)

// For payment
orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.post('/stripe', authUser, placeOrderStripe)

// For user
orderRouter.get('/userorders', authUser, userOrders)

export default orderRouter