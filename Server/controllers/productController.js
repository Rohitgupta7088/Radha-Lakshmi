// // import {v2 as cloudinary} from "cloudinary"
// // import Product from "../models/Product.js"
// // export const createProduct = async (req,res)=>{
// //     try {
// //         const productData = JSON.parse(req.body.productData)
// //         const images = req.files


// //         const imageUrl = await Promise.all(
// //             images.map(async (item)=>{
// //                 const result = await cloudinary.uploader.upload(item.path, {resource_type: "image"})
// //                 return result.secure_url
// //             })
// //         )

// //         await Product.create({...productData, images: imageUrl})

// //         res.json({success: true, message: "Product Added"})
// //     } catch (error) {
// //         console.log(error.message)
// //         res.json({success:false, message: error.message})
// //     }
// // }

// // export const listProduct = async (req, res)=>{
// //     try {
// //         const products = await Product.find({})
// //         res.json({success:true, products})
// //     } catch (error) {
// //         console.log(error.message)
// //         res.json({success:false, message: error.message})
// //     }
// // }

// // export const singleProduct = async (req, res)=>{
// //     try {
// //         const {productId} = req.body
// //         const product = await Product.findById(productId)
// //         res.json({success:true, product})

// //     } catch (error) {
// //         console.log(error.message)
// //         res.json({success:false, message: error.message})
// //     }
// // }

// // export const toggleStock = async (req, res)=>{
// //     try {
// //         const {productId, inStock} = req.body
// //         await Product.findByIdAndUpdate(productId, {inStock})
// //         res.json({success:true, message: "Stock Updated"})
// //     } catch (error) {
// //         console.log(error.message)
// //         res.json({success:false, message: error.message})
// //     }
// // }


// import {v2 as cloudinary} from "cloudinary"
// import Product from "../models/Product.js"

// export const createProduct = async (req, res) => {
//     try {
//         const productData = JSON.parse(req.body.productData)
//         const images = req.files

//         console.log("[createProduct] files received:", images?.length)
//         console.log("[createProduct] Cloudinary config — cloud_name:", process.env.CLDN_NAME, "| api_key set:", !!process.env.CLDN_API_KEY)

//         const imageUrl = await Promise.all(
//             images.map(async (item) => {
//                 console.log("[createProduct] Uploading file:", item.originalname, item.path)
//                 const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" })
//                 console.log("[createProduct] Uploaded:", result.secure_url)
//                 return result.secure_url
//             })
//         )

//         await Product.create({...productData, images: imageUrl})
//         res.json({ success: true, message: "Product Added" })

//     } catch (error) {
//         console.log("[createProduct] ERROR:", error.message)
//         console.log("[createProduct] ERROR detail:", error.http_code || error.status || "no http code")
//         res.json({ success: false, message: error.message })
//     }
// }

// export const listProduct = async (req, res) => {
//     try {
//         const products = await Product.find({})
//         res.json({ success: true, products })
//     } catch (error) {
//         console.log(error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

// export const singleProduct = async (req, res) => {
//     try {
//         const {productId} = req.body
//         const product = await Product.findById(productId)
//         res.json({ success: true, product })
//     } catch (error) {
//         console.log(error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

// export const toggleStock = async (req, res) => {
//     try {
//         const {productId, inStock} = req.body
//         await Product.findByIdAndUpdate(productId, {inStock})
//         res.json({ success: true, message: "Stock Updated" })
//     } catch (error) {
//         console.log(error.message)
//         res.json({ success: false, message: error.message })
//     }
// }


import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
    try {
        const productData = JSON.parse(req.body.productData)
        const images = req.files

        if (!images || images.length === 0) {
            return res.json({ success: false, message: "No images uploaded" })
        }

        // Force cloudinary config from env (guards against Windows CLOUDINARY_URL override)
        cloudinary.config({
            cloud_name: process.env.CLDN_NAME,
            api_key: process.env.CLDN_API_KEY,
            api_secret: process.env.CLDN_API_SECRET,
            secure: true
        })

        const imageUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" })
                return result.secure_url
            })
        )

        await Product.create({ ...productData, images: imageUrl })
        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log("[createProduct] ERROR:", error.message)
        res.json({ success: false, message: error.message })
    }
}

export const listProduct = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ success: true, products})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await Product.findById(productId)
        res.json({ success: true, product })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const toggleStock = async (req, res) => {
    try {
        const { productId, inStock } = req.body
        await Product.findByIdAndUpdate(productId, { inStock })
        res.json({ success: true, message: "Stock Updated" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}