// import express from "express"
// import {
//     createGiftPool,
//     getGiftPool,
//     addContribution,
//     placeGiftOrder,
//     extendDeadline,
//     getMyPools,
// } from "../controllers/giftController.js"
// import { authUser } from "../middleware/authMiddleware.js"

// const giftRouter = express.Router()

// // Organizer routes (auth required)
// giftRouter.post('/create', authUser, createGiftPool)
// giftRouter.post('/place-order', authUser, placeGiftOrder)
// giftRouter.post('/extend', authUser, extendDeadline)
// giftRouter.get('/my-pools', authUser, getMyPools)

// // Public routes (no auth needed)
// giftRouter.get('/:poolId', getGiftPool)
// giftRouter.post('/:poolId/contribute', addContribution)

// export default giftRouter






import express from "express"
import {
    createGiftPool,
    verifyOrganizerPayment,
    getGiftPool,
    initContribution,
    verifyContribution,
    placeGiftOrder,
    extendDeadline,
    getMyPools,
} from "../controllers/giftController.js"
import { authUser } from "../middleware/authMiddleware.js"

const giftRouter = express.Router()

// Organizer routes (auth required)
giftRouter.post('/create', authUser, createGiftPool)
giftRouter.post('/:poolId/organizer-payment/verify', authUser, verifyOrganizerPayment)
giftRouter.post('/place-order', authUser, placeGiftOrder)
giftRouter.post('/extend', authUser, extendDeadline)
giftRouter.get('/my-pools', authUser, getMyPools)

// Public routes (no auth needed)
giftRouter.get('/:poolId', getGiftPool)
giftRouter.post('/:poolId/contribute/init', initContribution)
giftRouter.post('/:poolId/contribute/verify', verifyContribution)

export default giftRouter