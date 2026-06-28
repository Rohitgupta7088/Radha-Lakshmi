// import User from "../models/User.js";
// import { Webhook } from "svix";

// const clerkWebhooks = async (req, res)=>{
//     try {
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//         const headers = {
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         }

//         // await whook.verify(JSON.stringify(req.body), header)

//         // const {data, type} = req.body

//         //const payload = req.body.toString()

//         const evt = await whook.verify(req.body, headers)

//         // const { data, type } = JSON.parse(payload)

//         const { data, type } = evt;

//         switch (type) {
//             case "user.created": {

//                 console.log("INSIDE USER.CREATED")

//                 const userData = {
//                     _id: data.id,
//                     email: data.email_addresses[0].email_address || "",
//                     username:`${data.first_name || ""} ${data.last_name || ""}`.trim() || data.email_addresses?.[0]?.email_address?.split("@")[0] || "User",
//                     image: data.image_url || "",
//                 }

//                 //await User.create(userData)
//                 //console.log(userData)

//                 const savedUser = await User.create(userData)

//                 console.log("USER SAVED:", savedUser)
                
//                 break;
//             }

//             // case "user.updated": {
//             //     const userData = {
//             //         email: data.email_addresses[0].email_address,
//             //         username: data.first_name + " " + data.last_name,
//             //         image: data.image_url,
//             //     }

//             //     await User.findByIdAndUpdate(data.id, userData)
//             //     break;
//             // }

//             case "user.updated": {

//                 console.log("INSIDE USER.UPDATED");

//                 const userData = {
//                     email: data.email_addresses?.[0]?.email_address || "",
//                     username: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.email_addresses?.[0]?.email_address?.split("@")[0] || "User",
//                     image: data.image_url || "",
//                 };

//                 //console.log("UPDATE DATA:", userData);

//                 const updatedUser = await User.findByIdAndUpdate(
//                     data.id,
//                     userData,
//                     { new: true }
//                 );

//                 //console.log("UPDATED USER:", updatedUser);

//                 break;
//             }
            
//             case "user.deleted": {

//                 await User.findByIdAndDelete(data.id)
//                 break;
//             }
        
//             default:
//                 break;
//         }

//         res.json({success:true, message: "Webhook Received"})
//     } catch (error) {
//         console.log(error.message)
//         res.status(400).json({success:false, message: error.message})
//     }
// }

// export default clerkWebhooks





import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        }

        const evt = await whook.verify(req.body, headers)
        const { data, type } = evt;

        switch (type) {

            case "user.created": {
                console.log("INSIDE USER.CREATED")

                const safeUsername =
                    `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
                    data.email_addresses?.[0]?.email_address?.split("@")[0] ||
                    "User"

                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    username: safeUsername,
                    image: data.image_url || "",
                }

                const savedUser = await User.create(userData)
                console.log("USER SAVED:", savedUser)
                break;
            }

            case "user.updated": {
                console.log("INSIDE USER.UPDATED")

                const safeUsername =
                    `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
                    data.email_addresses?.[0]?.email_address?.split("@")[0] ||
                    "User"

                const userData = {
                    email: data.email_addresses?.[0]?.email_address || "",
                    username: safeUsername,
                    image: data.image_url || "",
                }

                const updatedUser = await User.findByIdAndUpdate(
                    data.id,
                    userData,
                    { returnDocument: "after" }  // replaces deprecated { new: true }
                )
                console.log("USER UPDATED:", updatedUser)
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id)
                console.log("USER DELETED:", data.id)
                break;
            }

            default:
                break;
        }

        res.json({ success: true, message: "Webhook Received" })

    } catch (error) {
        console.log(error.message)
        res.status(400).json({ success: false, message: error.message })
    }
}

export default clerkWebhooks