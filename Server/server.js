import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import clerkWebhooks from "./controllers/ClerkWebhooks.js"
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import addressRouter from "./routes/addressRoute.js"
import cartRouter from "./routes/cartRoute.js"
import connectCloudinary from "./config/cloudinary.js"
import { clerkMiddleware } from "@clerk/express"
import orderRouter from "./routes/orderRoute.js"

await connectDB()
await connectCloudinary()

const app = express()

app.use(cors())
app.use(clerkMiddleware())

// // Log every incoming request so we can see what's hitting the server
// app.use((req, res, next) => {
//     console.log(`[REQUEST] ${req.method} ${req.path} | Auth: ${req.headers.authorization ? req.headers.authorization.substring(0, 30) + '...' : 'NONE'}`)
//     const originalJson = res.json.bind(res)
//     res.json = (data) => {
//         console.log(`[RESPONSE] ${req.method} ${req.path} | status: ${res.statusCode} | success: ${data?.success}`)
//         return originalJson(data)
//     }
//     next()
// })

// Webhook route — needs raw body BEFORE express.json()
app.post("/api/clerk", express.raw({ type: "*/*" }), clerkWebhooks)

// Cashfree webhook — needs raw body for signature verification
app.use('/api/orders/cashfree/webhook', (req, res, next) => {
    express.raw({ type: '*/*' })(req, res, (err) => {
        if(err) return next(err)
        req.rawBody = req.body.toString()
        next()
    })
})

app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/addresses', addressRouter)
app.use('/api/cart', cartRouter)
app.use('/api/orders', orderRouter)

app.get('/', (req, res) => {
    res.send("API Successfully Connected")
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`))