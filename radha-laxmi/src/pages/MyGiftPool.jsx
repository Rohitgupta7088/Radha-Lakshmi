// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAppContext } from '../context/AppContext'
// import toast from 'react-hot-toast'

// const STATUS_STYLE = {
//   active: 'bg-green-100 text-green-700',
//   completed: 'bg-blue-100 text-blue-700',
//   ordered: 'bg-purple-100 text-purple-700',
//   expired: 'bg-red-100 text-red-500',
// }

// const MyGiftPools = () => {
//   const { axios, getToken, user, currency } = useAppContext()
//   const navigate = useNavigate()
//   const [pools, setPools] = useState([])
//   const [loading, setLoading] = useState(true)

//   const fetchPools = async () => {
//     try {
//       const { data } = await axios.get('/api/gift/my-pools', {
//         headers: { Authorization: `Bearer ${await getToken()}` }
//       })
//       if (data.success) setPools(data.pools)
//       else toast.error(data.message)
//     } catch (err) {
//       toast.error('Failed to load gift pools')
//     }
//     setLoading(false)
//   }

//   useEffect(() => { if (user) fetchPools() }, [user])

//   if (loading) return (
//     <div className='min-h-screen flex items-center justify-center'>
//       <p className='text-gray-400 animate-pulse'>Loading your gift pools...</p>
//     </div>
//   )

//   return (
//     <div className='min-h-screen bg-gray-100 pt-28 pb-16 px-4 lg:px-12'>
//       <div className='max-w-4xl mx-auto'>
//         <div className='flex items-center justify-between mb-1'>
//           <h2 className='text-2xl font-bold text-[#41334e]'>My Gift Pools 🎁</h2>
//           <button
//             onClick={() => navigate('/gift/create')}
//             className='text-xs font-semibold px-4 py-2 rounded-full bg-[#41334e] text-white hover:bg-[#5a4870] transition-all cursor-pointer'
//           >
//             + Create New Pool
//           </button>
//         </div>
//         <div className='w-20 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] mb-8' />

//         {pools.length === 0 ? (
//           <div className='bg-white rounded-2xl p-12 text-center shadow-sm'>
//             <p className='text-4xl mb-3'>🎁</p>
//             <p className='text-gray-500 mb-4'>You haven't created any gift pools yet.</p>
//             <button
//               onClick={() => navigate('/gift/create')}
//               className='px-6 py-3 rounded-xl bg-[#41334e] text-white font-semibold text-sm cursor-pointer hover:bg-[#5a4870] transition-all'
//             >
//               Create Your First Gift Pool
//             </button>
//           </div>
//         ) : (
//           <div className='flex flex-col gap-4'>
//             {pools.map(pool => {
//               const progress = Math.min((pool.collectedAmount / pool.targetAmount) * 100, 100)
//               const daysLeft = Math.max(0, Math.ceil((new Date(pool.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
//               const paidCount = pool.contributors?.filter(c => c.isPaid).length || 0

//               return (
//                 <div key={pool.poolId} className='bg-white rounded-2xl p-5 shadow-sm'>
//                   <div className='flex items-start justify-between mb-3'>
//                     <div>
//                       <h3 className='font-bold text-gray-800'>Gift for {pool.recipientName}</h3>
//                       <p className='text-xs text-gray-500'>{pool.occasion} · {new Date(pool.createdAt).toDateString()}</p>
//                     </div>
//                     <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[pool.status]}`}>
//                       {pool.status.toUpperCase()}
//                     </span>
//                   </div>

//                   {/* Products */}
//                   <div className='flex gap-2 mb-3 overflow-x-auto pb-1'>
//                     {pool.products?.map((item, idx) => (
//                       <div key={idx} className='flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1 shrink-0'>
//                         <img src={item.productId?.images?.[0]} alt='' className='w-8 h-8 object-contain rounded' />
//                         <div>
//                           <p className='text-xs font-semibold text-gray-700 line-clamp-1 max-w-[100px]'>{item.productId?.title}</p>
//                           <p className='text-xs text-gray-400'>Size: {item.size} · Qty: {item.quantity}</p>
//                         </div>
//                       </div>
//                     ))}
//                     {pool.wrapTogether && (
//                       <span className='text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full self-center shrink-0'>🎀 Wrapped</span>
//                     )}
//                   </div>

//                   {/* Progress */}
//                   <div className='mb-3'>
//                     <div className='flex justify-between text-xs text-gray-600 mb-1'>
//                       <span>{currency}{pool.collectedAmount} of {currency}{pool.targetAmount}</span>
//                       <span>{paidCount} contributors · {daysLeft} days left</span>
//                     </div>
//                     <div className='w-full bg-gray-200 rounded-full h-2.5 overflow-hidden'>
//                       <div className='h-2.5 rounded-full bg-gradient-to-r from-[#41334e] to-purple-400 transition-all' style={{ width: `${progress}%` }} />
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className='flex gap-2'>
//                     <button
//                       onClick={() => navigate(`/gift/${pool.poolId}/status`)}
//                       className='flex-1 py-2 text-xs font-semibold rounded-xl bg-[#41334e] text-white hover:bg-[#5a4870] transition-all cursor-pointer'
//                     >
//                       View Status
//                     </button>
//                     <button
//                       onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/gift/${pool.poolId}`); toast.success('Link copied!') }}
//                       className='px-4 py-2 text-xs font-semibold rounded-xl border border-[#41334e] text-[#41334e] hover:bg-gray-50 transition-all cursor-pointer'
//                     >
//                       Copy Link
//                     </button>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default MyGiftPools






import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  pending_payment: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  ordered: 'bg-purple-100 text-purple-700',
  expired: 'bg-red-100 text-red-500',
}

const MyGiftPools = () => {
  const { axios, getToken, user, currency } = useAppContext()
  const navigate = useNavigate()
  const [pools, setPools] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPools = async () => {
    try {
      const { data } = await axios.get('/api/gift/my-pools', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) setPools(data.pools)
      else toast.error(data.message)
    } catch (err) {
      toast.error('Failed to load gift pools')
    }
    setLoading(false)
  }

  useEffect(() => { if (user) fetchPools() }, [user])

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <p className='text-gray-400 animate-pulse'>Loading your gift pools...</p>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-100 pt-28 pb-16 px-4 lg:px-12'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-1'>
          <h2 className='text-2xl font-bold text-[#41334e]'>My Gift Pools 🎁</h2>
          <button
            onClick={() => navigate('/gift/create')}
            className='text-xs font-semibold px-4 py-2 rounded-full bg-[#41334e] text-white hover:bg-[#5a4870] transition-all cursor-pointer'
          >
            + Create New Pool
          </button>
        </div>
        <div className='w-20 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] mb-8' />

        {pools.length === 0 ? (
          <div className='bg-white rounded-2xl p-12 text-center shadow-sm'>
            <p className='text-4xl mb-3'>🎁</p>
            <p className='text-gray-500 mb-4'>You haven't created any gift pools yet.</p>
            <button
              onClick={() => navigate('/gift/create')}
              className='px-6 py-3 rounded-xl bg-[#41334e] text-white font-semibold text-sm cursor-pointer hover:bg-[#5a4870] transition-all'
            >
              Create Your First Gift Pool
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {pools.map(pool => {
              const progress = Math.min((pool.collectedAmount / pool.targetAmount) * 100, 100)
              const daysLeft = Math.max(0, Math.ceil((new Date(pool.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
              const paidCount = pool.contributors?.filter(c => c.isPaid).length || 0

              return (
                <div key={pool.poolId} className='bg-white rounded-2xl p-5 shadow-sm'>
                  <div className='flex items-start justify-between mb-3'>
                    <div>
                      <h3 className='font-bold text-gray-800'>Gift for {pool.recipientName}</h3>
                      <p className='text-xs text-gray-500'>{pool.occasion} · {new Date(pool.createdAt).toDateString()}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[pool.status]}`}>
                      {pool.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Products */}
                  <div className='flex gap-2 mb-3 overflow-x-auto pb-1'>
                    {pool.products?.map((item, idx) => (
                      <div key={idx} className='flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1 shrink-0'>
                        <img src={item.productId?.images?.[0]} alt='' className='w-8 h-8 object-contain rounded' />
                        <div>
                          <p className='text-xs font-semibold text-gray-700 line-clamp-1 max-w-[100px]'>{item.productId?.title}</p>
                          <p className='text-xs text-gray-400'>Size: {item.size} · Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {pool.wrapTogether && (
                      <span className='text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full self-center shrink-0'>🎀 Wrapped</span>
                    )}
                  </div>

                  {/* Progress */}
                  <div className='mb-3'>
                    <div className='flex justify-between text-xs text-gray-600 mb-1'>
                      <span>{currency}{pool.collectedAmount} of {currency}{pool.targetAmount}</span>
                      <span>{paidCount} contributors · {daysLeft} days left</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2.5 overflow-hidden'>
                      <div className='h-2.5 rounded-full bg-gradient-to-r from-[#41334e] to-purple-400 transition-all' style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-2'>
                    <button
                      onClick={() => navigate(`/gift/${pool.poolId}/status`)}
                      className='flex-1 py-2 text-xs font-semibold rounded-xl bg-[#41334e] text-white hover:bg-[#5a4870] transition-all cursor-pointer'
                    >
                      View Status
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/gift/${pool.poolId}`); toast.success('Link copied!') }}
                      className='px-4 py-2 text-xs font-semibold rounded-xl border border-[#41334e] text-[#41334e] hover:bg-gray-50 transition-all cursor-pointer'
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyGiftPools