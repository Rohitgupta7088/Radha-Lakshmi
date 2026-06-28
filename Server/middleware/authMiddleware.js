// import { getAuth } from "@clerk/express"
// import User from "../models/User.js"

// export const authUser = async (req, res, next) => {
//     try {
//         const { userId } = getAuth(req)

//         if (!userId) {
//             return res.json({ success: false, message: "Not Authorized" })
//         }

        
//         let user = await User.findById(userId)

//         if (!user) {
//             return res.json({ success: false, message: "Not Authorized" })
//         }

//         const ownerEmail = process.env.ADMIN_EMAIL
//         const newRole = ownerEmail && user.email === ownerEmail ? "owner" : "user"

        
//         if (user.role !== newRole) {
//             user = await User.findByIdAndUpdate(
//                 userId,
//                 { role: newRole },
//                 { returnDocument: "after" }
//             )
//         }

//         req.user = user
//         next()

//     } catch (error) {
//         console.log(error)
//         return res.json({ success: false, message: error.message })
//     }
// }

// export default authUser

import { getAuth } from "@clerk/express"
import User from "../models/User.js"

export const authUser = async (req, res, next) => {
    try {
        const { userId } = getAuth(req)

        if (!userId) {
            return res.json({ success: false, message: "Not Authorized" })
        }

        let user = await User.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "User not found in DB" })
        }

        const ownerEmail = process.env.ADMIN_EMAIL
        const newRole = ownerEmail && user.email === ownerEmail ? "owner" : "user"

        if (user.role !== newRole) {
            user = await User.findByIdAndUpdate(userId, { role: newRole }, { returnDocument: "after" })
        }

        req.user = user
        next()

    } catch (error) {
        console.log("[authUser] error:", error.message)
        return res.json({ success: false, message: error.message })
    }
}

export default authUser