// // import express from "express"
// // import { getUserProfile } from "../controllers/userController.js"
// // import authUser from "../middleware/authMiddleware.js"

// // const userRouter = express.Router()

// // userRouter.get('/', authUser, getUserProfile)

// // export default userRouter


// import express from "express";
// import User from "../models/User.js";
// import authUser from "../middleware/authMiddleware.js";
// import { getUserProfile } from "../controllers/userController.js";

// const router = express.Router();

// router.post("/save-user", async (req, res) => {

//     try {

//         const { id, username, email, image } = req.body;

//         // Check existing user
//         let user = await User.findByIdUpdate(id);

//         if (!user) {

//             user = await User.create({
//                 _id: id,
//                 username,
//                 email,
//                 image,
//             });

//         }

//         res.json({
//             success: true,
//             user,
//         });

//     } catch (error) {

//         console.log(error);

//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// });

// export default router;




import express from "express";
import User from "../models/User.js";
import authUser from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// GET /api/users — returns role & cartData for the logged-in user
router.get("/", authUser, getUserProfile);

// POST /api/users/save-user — creates or updates user on every sign-in
router.post("/save-user", async (req, res) => {
    try {
        const { id, username, email, image } = req.body;

        // Safe username: fullName → email prefix → "User"
        const safeUsername =
            (username && username.trim()) ||
            (email ? email.split("@")[0] : null) ||
            "User";

        const user = await User.findByIdAndUpdate(
            id,
            { username: safeUsername, email, image },
            {
                returnDocument: "after",    // replaces deprecated { new: true }
                upsert: true,               // create if not found
                setDefaultsOnInsert: true,  // apply schema defaults on create
            }
        );

        res.json({ success: true, user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;