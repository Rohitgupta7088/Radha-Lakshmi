// import React, {useEffect, useState} from 'react'
// import { useAppContext } from '../../context/AppContext'
// import { assets } from '../../assets/data'
// import toast from 'react-hot-toast'

// const dashboard = () => {
//   const { user, currency, axios, getToken } = useAppContext()
//   const [dashboardData, setDashboardData] = useState({
//     orders: [],
//     totalOrders: 0,
//     totalRevenue: 0,
//   })

//   const getDashboardData = async ()=>{
//     try {
//       const {data} = await axios.get("/api/orders/", {
//         headers: {
//           Authorization: `Bearer ${await getToken()}`
//         }
//       })

//       if(data.success){
//         setDashboardData(data.dashboardData)
//       }else{
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   const statusHandler = async(e, orderId)=>{
//     try {
//       const {data} = await axios.post("/api/orders/status", {orderId, status: e.target.value}, {
//         headers: {
//           Authorization: `Bearer ${await getToken()}`
//         }
//       })

//       if(data.success){
//         await getDashboardData()
//         toast.success(data.message)

//       }
//     } catch (error) {
//       console.log(error)
//       toast.error(error.message)
//     }
//   }

//   useEffect(()=>{
//     if(user){
//       getDashboardData()
//     }
//   },[user])

//   return (
//     <div className='md:px-8 py-6 xl:py-8 m-1 sm:m-3 h-[97vh] overflow-y-scroll lg:w-11/12 bg-white/50 shadow rounded-xl'>
//       <div className='grid grid-cols-2 gap-4'>

//         <div className='flex items-center justify-center gap-7 p-5 bg-[#fff4d2] lg:min-w-56 rounded-xl'>
//           <img src={assets.graph} alt="" className='hidden sm:flex w-10 h-10'/>
//           <div>
//             <h4 className='text-[14px] md:text-[16px] font-bold'>{dashboardData.orders.filter(order => order.items.some(item => item.products)).length.toString().padStart(2, "0")}</h4>
//             <h5 className='text-[14px] md:text-[16px] font-bold text-gray-800'>Total Sales</h5>
//           </div>
//         </div>

//         <div className='flex items-center justify-center gap-7 p-5 bg-[#fff4d2] lg:min-w-56 rounded-xl'>
//           <img src={assets.dollar} alt="" className='hidden sm:flex w-10 h-10'/>
//           <div>
//             <h4 className='text-[14px] md:text-[16px] font-bold'>{currency}{dashboardData?.totalRevenue ||  0}</h4>
//             <h5 className='text-[14px] md:text-[16px] font-bold text-gray-800'>Total Earning</h5>
//           </div>
//         </div>
//       </div>

//       {/* All Orders */}
//       <div className='mt-10'>
//         {dashboardData.orders.filter(order => order.items.some(item => item.products)).map((order)=>(
//           <div key={order._id} className='bg-white p-3 mb-4 rounded-2xl'>
//             {/* product list */}
//             {order.items.filter(item => item.products).map((item, idx)=>(
//             <div key={idx} className='text-gray-700 flex flex-col lg:flex-row gap-4 mb-3'>
//               <div className='flex flex-[2] gap-x-2'>

//                 <div className='flex items-center justify-center bg-gray-200 rounded-xl w-20 h-20 shrink-0'>
//                   {item.products?.images?.[0]
//                     ? <img src={item.products.images[0]} alt="" className='max-h-20 max-w-20 object-contain'/>
//                     : <span className='text-gray-400 text-[10px] text-center px-1'>No Image</span>
//                   }
//                 </div>

//                 <div className='block w-full'>

//                   <h5 className='text-[14px] md:text-[16px] font-bold upperCase line-clamp-1'>
//                     {item.products?.title || '⚠ Deleted Product'}
//                   </h5>

//                   <div className='flex fex-wrap gap-3 max-sm:gap-y-1 mt-1'>

//                     <div className='flex items-center gap-x-2'>
//                       <h5 className='text-[14px] font-[500]'>Price:</h5>
//                       <p>
//                       {item.products?.price?.[item.size] ? `${currency}${item.products.price[item.size]}` : 'N/A'}
//                       </p>
//                     </div>

//                     <div className='flex items-center gap-x-2'>
//                       <h5 className='text-[14px] font-[500]'>Quantity:</h5>
//                       <p>{item.quantity}</p>
//                     </div>

//                     <div className='flex items-center gap-x-2'>
//                       <h5 className='text-[14px] font-[500]'>Size:</h5>
//                       <p>{item.size}</p>
//                     </div>

                    
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* OrderItems */}
//           <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-t border-gray-300 pt-3'>
//             <div className='flex flex-col gap-1'>

//               <div className='flex items-center gap-x-2'>
//                 <h5 className='text-[14px] font-[500]'>Order-Id:</h5>
//                 <p className='text-gray-600 text-xs break-all'>{order._id}</p>
//               </div>

//               <div className='flex gap-4'>
//                 <div className='flex items-center gap-x-2'>
//                   <h5 className='text-[14px] font-[500]'>Customer:</h5>
//                   <p className='text-gray-600 text-sm'>{order.address.firstName} {order.address.lastName}</p>
//                   <div>
//                     <div className='flex items-center gap-x-2'>
//                       <h5 className='text-[14px] font-[500]'>Contact:</h5>
//                       <p className='text-gray-600 text-sm'>{order.address.phone}</p>
//                     </div>
//                   </div>
//                  </div>
//               </div>

//               <div className='flex gap-4'>
//                 <div className='flex items-center gap-x-2'>
//                   <h5 className='text-[14px] font-[500]'>Address:</h5>
//                   <p className='text-gray-600 text-sm'>{order.address.street}, {order.address.city}, {" "}, {order.address.state}, {order.address.country}, {" "}, {order.address.zipcode}</p>
//                 </div>
//               </div>

//               <div className='flex gap-4'>
//                 <div className='flex items-center gap-x-2'>
//                   <h5 className='text-[14px] font-[500]'>Payment Status:</h5>
//                   <p className='text-gray-600 text-sm'>{order.isPaid ? "Done" : "Pending"}</p>
//                 </div>

//                 <div className='flex items-center gap-x-2'>
//                   <h5 className='text-[14px] font-[500]'>Method:</h5>
//                   <p className='text-gray-600 text-sm'>{order.paymentMethod}</p>
//                 </div>
//               </div>

//               <div className='flex gap-4'>
//                 <div className='flex items-center gap-x-2'>
//                   <h5 className='text-[14px] font-[500]'>Date:</h5>
//                   <p className='text-gray-600 text-sm'>{new Date(order.createdAt).toDateString()}</p>
//                 </div>

//                 <div className='flex items-center gap-x-2'>
//                   <h5 className='text-[14px] font-[500]'>Amount:</h5>
//                   <p className='text-gray-600 text-sm'>{currency}{order.amount}</p>
//                 </div>
//               </div>
//             </div>

//             <div className='flex items-center gap-2'>
//               <h5 className='text-[14px] font-[500]'>Status:</h5>
//               <select onChange={(e)=>statusHandler(e, order._id)} value={order.status} className='text-xs font-semibold p-1 ring-1 ring-slate-900/5 rounded max-w-36 bg-white'>
//                 <option value="Order Placed">Order Placed</option>
//                 <option value="Packing">Packing</option>
//                 <option value="Shipping">Shipping</option>
//                 <option value="Out for delivery">Out for delivery</option>
//                 <option value="Delivered">Delivered</option>
//               </select>
//             </div>
//           </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default dashboard







import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/data'
import toast from 'react-hot-toast'

const OCCASION_LABEL = { Wedding: 'Wedding', Birthday: 'Birthday', Festival: 'Festival', Anniversary: 'Anniversary', 'Baby Shower': 'Baby Shower' }

const POOL_STATUS_CONFIG = {
  active:    { label: 'Collecting',   dot: 'bg-amber-500',  card: 'bg-amber-50 border border-amber-200' },
  completed: { label: 'Goal Reached', dot: 'bg-amber-500',  card: 'bg-amber-50 border border-amber-200' },
  ordered:   { label: 'Order Placed', dot: 'bg-green-500',  card: 'bg-white border border-gray-200' },
  cancelled: { label: 'Cancelled',    dot: 'bg-red-500',    card: 'bg-red-50 border border-red-200' },
  expired:   { label: 'Expired',      dot: 'bg-red-400',    card: 'bg-red-50 border border-red-200' },
}

const dashboard = () => {
  const { user, currency, axios, getToken } = useAppContext()

  const [dashboardData, setDashboardData] = useState({
    orders: [],
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [exchangeNotes, setExchangeNotes] = useState({})
  const [exchangeLoading, setExchangeLoading] = useState({})
  const [giftPools, setGiftPools] = useState([])

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/orders/', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getGiftPoolData = async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }

      // Trigger auto-process of expired pools first (no-op if nothing to process)
      await axios.post('/api/gift/admin/process-expired', {}, { headers })

      // Then fetch all pools
      const { data } = await axios.get('/api/gift/admin/all-pools', { headers })
      if (data.success) setGiftPools(data.pools)
    } catch (error) {
      console.log('getGiftPoolData error:', error.message)
    }
  }

  const statusHandler = async (e, orderId) => {
    try {
      const { data } = await axios.post('/api/orders/status', { orderId, status: e.target.value }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        await getDashboardData()
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const markPaidHandler = async (orderId) => {
    try {
      const { data } = await axios.post('/api/orders/upi/mark-paid', { orderId }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        await getDashboardData()
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const handleExchangeDecision = async (orderId, decision) => {
    setExchangeLoading(prev => ({ ...prev, [orderId]: true }))
    try {
      const { data } = await axios.post('/api/orders/exchange-decision', {
        orderId,
        decision,
        adminNote: exchangeNotes[orderId] || ''
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        await getDashboardData()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Something went wrong')
    }
    setExchangeLoading(prev => ({ ...prev, [orderId]: false }))
  }

  const handleClearDashboard = async () => {
    if (!window.confirm("Clear all delivered & cancelled orders from dashboard? Customer order history will not be affected.")) return
    try {
        const { data } = await axios.post('/api/orders/clear-dashboard', {}, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        })
        if (data.success) {
            toast.success("Dashboard cleared!")
            getDashboardData()
        } else {
            toast.error(data.message)
        }
    } catch (err) {
        toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    if (user) {
      getDashboardData()
      getGiftPoolData()
    }
  }, [user])

  // Sort: Exchange Requested on top, then rest by date
  const sortedOrders = [...(dashboardData.orders || [])]
    .filter(order => order.items.some(item => item.products))
    .sort((a, b) => {
      if (a.status === 'Exchange Requested' && b.status !== 'Exchange Requested') return -1
      if (b.status === 'Exchange Requested' && a.status !== 'Exchange Requested') return 1
      return 0
    })

  // Total sales = non-cancelled orders
  const activeSalesCount = sortedOrders.filter(o => o.status !== 'Cancelled').length

  return (
    <div className='md:px-8 py-6 xl:py-8 m-1 sm:m-3 h-[97vh] overflow-y-scroll lg:w-11/12 bg-white/50 shadow rounded-xl'>

      {/* Stats */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex items-center justify-center gap-7 p-5 bg-[#fff4d2] lg:min-w-56 rounded-xl'>
          <img src={assets.graph} alt='' className='hidden sm:flex w-10 h-10' />
          <div>
            <h4 className='text-[14px] md:text-[16px] font-bold'>{activeSalesCount.toString().padStart(2, '0')}</h4>
            <h5 className='text-[14px] md:text-[16px] font-bold text-gray-800'>Total Sales</h5>
          </div>
        </div>

        <div className='flex items-center justify-center gap-7 p-5 bg-[#fff4d2] lg:min-w-56 rounded-xl'>
          <img src={assets.dollar} alt='' className='hidden sm:flex w-10 h-10' />
          <div>
            <h4 className='text-[14px] md:text-[16px] font-bold'>{currency}{dashboardData?.totalRevenue || 0}</h4>
            <h5 className='text-[14px] md:text-[16px] font-bold text-gray-800'>Total Earning</h5>
          </div>
        </div>
      </div>

      {/* All Orders */}
      <div className='mt-10'>
        {sortedOrders.map((order) => (
          <div
            key={order._id}
            className={`p-3 mb-4 rounded-2xl ${
              order.status === 'Cancelled'
                ? 'bg-red-50 border border-red-200'
                : order.status === 'Exchange Requested'
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-white'
            }`}
          >

            {/* Product list */}
            {order.items.filter(item => item.products).map((item, idx) => (
              <div key={idx} className='text-gray-700 flex flex-col lg:flex-row gap-4 mb-3'>
                <div className='flex flex-[2] gap-x-2'>

                  <div className='flex items-center justify-center bg-gray-200 rounded-xl w-20 h-20 shrink-0'>
                    {item.products?.images?.[0]
                      ? <img src={item.products.images[0]} alt='' className='max-h-20 max-w-20 object-contain' />
                      : <span className='text-gray-400 text-[10px] text-center px-1'>No Image</span>
                    }
                  </div>

                  <div className='block w-full'>
                    <h5 className='text-[14px] md:text-[16px] font-bold uppercase line-clamp-1'>
                      {item.products?.title || '⚠ Deleted Product'}
                    </h5>
                    <div className='flex flex-wrap gap-3 max-sm:gap-y-1 mt-1'>
                      <div className='flex items-center gap-x-2'>
                        <h5 className='text-[14px] font-[500]'>Price:</h5>
                        <p>{item.products?.price?.[item.size] ? `${currency}${item.products.price[item.size]}` : 'N/A'}</p>
                      </div>
                      <div className='flex items-center gap-x-2'>
                        <h5 className='text-[14px] font-[500]'>Quantity:</h5>
                        <p>{item.quantity}</p>
                      </div>
                      <div className='flex items-center gap-x-2'>
                        <h5 className='text-[14px] font-[500]'>Size:</h5>
                        <p>{item.size}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

                {/* Order footer */}
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-t border-gray-300 pt-3'>

              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-x-2'>
                  <h5 className='text-[14px] font-[500]'>Order-Id:</h5>
                  <p className='text-gray-600 text-xs break-all'>{order._id}</p>
                  {order.paymentMethod === 'Gift Pool' && (
                    <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 ml-1'>Gift Pool</span>
                  )}
                </div>

                <div className='flex gap-4'>
                  <div className='flex items-center gap-x-2'>
                    <h5 className='text-[14px] font-[500]'>Customer:</h5>
                    <p className='text-gray-600 text-sm'>
                      {order.address
                        ? `${order.address.firstName || ''} ${order.address.lastName || ''}`.trim() || 'N/A'
                        : order.paymentMethod === 'Gift Pool' ? '(Gift Pool – address pending)' : 'N/A'
                      }
                    </p>
                    <div className='flex items-center gap-x-2'>
                      <h5 className='text-[14px] font-[500]'>Contact:</h5>
                      <p className='text-gray-600 text-sm'>{order.address?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex items-center gap-x-2'>
                    <h5 className='text-[14px] font-[500]'>Address:</h5>
                    <p className='text-gray-600 text-sm'>
                      {order.address
                        ? `${order.address.street || ''}, ${order.address.city || ''}, ${order.address.state || ''}, ${order.address.country || ''}, ${order.address.zipcode || ''}`
                        : order.paymentMethod === 'Gift Pool' ? 'Organizer will confirm delivery address' : 'No address'
                      }
                    </p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex items-center gap-x-2'>
                    <h5 className='text-[14px] font-[500]'>Payment Status:</h5>
                    <p className='text-gray-600 text-sm'>{order.isPaid ? 'Done' : 'Pending'}</p>
                  </div>
                  <div className='flex items-center gap-x-2'>
                    <h5 className='text-[14px] font-[500]'>Method:</h5>
                    <p className='text-gray-600 text-sm'>{order.paymentMethod}</p>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='flex items-center gap-x-2'>
                    <h5 className='text-[14px] font-[500]'>Date:</h5>
                    <p className='text-gray-600 text-sm'>{new Date(order.createdAt).toDateString()}</p>
                  </div>
                  <div className='flex items-center gap-x-2'>
                    <h5 className='text-[14px] font-[500]'>Amount:</h5>
                    <p className='text-gray-600 text-sm'>{currency}{order.amount}</p>
                  </div>
                </div>

                {/* Cancel reason */}
                {order.status === 'Cancelled' && order.cancelReason && (
                  <div className='flex items-center gap-x-2'>
                    <h5 className='text-[14px] font-[500] text-red-500'>Cancel Reason:</h5>
                    <p className='text-red-400 text-sm'>{order.cancelReason}</p>
                  </div>
                )}
              </div>

              {/* Right side: status dropdown + mark paid */}
              <div className='flex flex-col items-end gap-3'>
                <div className='flex items-center gap-2'>
                  {order.paymentMethod === 'UPI' && !order.isPaid && (
                    <button
                      onClick={() => markPaidHandler(order._id)}
                      className='text-xs font-semibold px-3 py-1.5 rounded bg-green-600 text-white cursor-pointer hover:bg-green-700'
                    >
                      Mark as Paid
                    </button>
                  )}
                  <h5 className='text-[14px] font-[500]'>Status:</h5>
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    disabled={order.status === 'Cancelled'}
                    className={`text-xs font-semibold p-1 ring-1 ring-slate-900/5 rounded max-w-36 ${
                      order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-400 cursor-not-allowed'
                        : 'bg-white'
                    }`}
                  >
                    <option value='Order Placed'>Order Placed</option>
                    <option value='Packing'>Packing</option>
                    <option value='Shipping'>Shipping</option>
                    <option value='Out for delivery'>Out for delivery</option>
                    <option value='Delivered'>Delivered</option>
                  </select>
                </div>

                <button
                      onClick={handleClearDashboard}
                      className='px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all cursor-pointer'
                  >
                      Clear Dashboard
                  </button>

                {/* Exchange Requested panel */}
                {order.status === 'Exchange Requested' && (
                  <div className='w-full max-w-sm mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl'>
                    <p className='text-xs font-bold text-amber-700 mb-2'>🔄 Exchange Requested</p>

                    <p className='text-xs text-gray-600 mb-1'>
                      <span className='font-semibold'>Reason:</span> {order.exchangeReason}
                    </p>
                    <p className='text-xs text-gray-600 mb-2'>
                      <span className='font-semibold'>Description:</span> {order.exchangeDescription}
                    </p>

                    {order.exchangeImageUrl && (
                      <img
                        src={order.exchangeImageUrl}
                        alt='proof'
                        className='w-28 h-28 object-cover rounded-lg border border-amber-200 mb-2'
                      />
                    )}

                    <textarea
                      value={exchangeNotes[order._id] || ''}
                      onChange={(e) => setExchangeNotes(prev => ({ ...prev, [order._id]: e.target.value }))}
                      placeholder='Add a note for the customer (optional)...'
                      rows={2}
                      className='w-full text-xs border border-gray-300 rounded-lg px-2 py-1 mb-2 focus:outline-none focus:border-amber-400 resize-none bg-white'
                    />

                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleExchangeDecision(order._id, 'Exchange Accepted')}
                        disabled={exchangeLoading[order._id]}
                        className='flex-1 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg transition-all disabled:opacity-50 cursor-pointer'
                      >
                        {exchangeLoading[order._id] ? '...' : '✅ Accept'}
                      </button>
                      <button
                        onClick={() => handleExchangeDecision(order._id, 'Exchange Declined')}
                        disabled={exchangeLoading[order._id]}
                        className='flex-1 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-lg transition-all disabled:opacity-50 cursor-pointer'
                      >
                        {exchangeLoading[order._id] ? '...' : '❌ Decline'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Gift Pools Section ── */}
      {giftPools.length > 0 && (
        <div className='mt-12'>
          <div className='mb-4'>
            <h3 className='font-bold text-2xl text-gray-800'>
              Gift <span className='font-light text-[#41334e]'>Pools</span>
            </h3>
            <div className='w-20 h-[3px] rounded-full bg-[#41334e] mt-1' />
            <p className='text-sm text-gray-500 mt-1'>
              {giftPools.filter(p => p.status === 'active' || p.status === 'completed').length} collecting &nbsp;&middot;&nbsp;
              {giftPools.filter(p => p.status === 'ordered').length} ordered &nbsp;&middot;&nbsp;
              {giftPools.filter(p => p.status === 'cancelled' || p.status === 'expired').length} cancelled
            </p>
          </div>

          {giftPools.map((pool) => {
            const cfg = POOL_STATUS_CONFIG[pool.status] || { label: pool.status, dot: 'bg-gray-400', card: 'bg-white border border-gray-200' }
            const paidContributors = pool.contributors?.filter(c => c.isPaid) || []
            const progress = pool.targetAmount > 0 ? Math.min(Math.round((pool.collectedAmount / pool.targetAmount) * 100), 100) : 0
            const isCollecting = pool.status === 'active' || pool.status === 'completed'
            const isCancelled = pool.status === 'cancelled' || pool.status === 'expired'

            return (
              <div key={pool.poolId} className={`p-4 mb-4 rounded-2xl ${cfg.card}`}>

                {/* Header */}
                <div className='flex flex-wrap items-start justify-between gap-2 mb-3'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h5 className='text-[15px] font-bold text-gray-800'>
                        Gift Pool — {pool.recipientName}
                      </h5>
                      <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#41334e]/10 text-[#41334e]'>
                        {OCCASION_LABEL[pool.occasion] || pool.occasion}
                      </span>
                    </div>
                    <p className='text-xs text-gray-500 mt-0.5'>
                      Pool ID: {pool.poolId} &nbsp;&middot;&nbsp; Created: {new Date(pool.createdAt).toDateString()}
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={`text-[13px] font-semibold ${isCancelled ? 'text-red-600' : 'text-gray-700'}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className='flex flex-wrap gap-2 mb-3'>
                  {pool.products?.map((item, idx) => (
                    <div key={idx} className='flex items-center gap-2 bg-white/70 rounded-xl px-2 py-1 border border-gray-100'>
                      <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden'>
                        {item.productId?.images?.[0]
                          ? <img src={item.productId.images[0]} alt={item.productId.title || ''} className='w-10 h-10 object-contain' />
                          : <span className='text-[9px] text-gray-400 text-center px-1'>No img</span>
                        }
                      </div>
                      <div>
                        <p className='text-xs font-semibold text-gray-700 line-clamp-1 max-w-[130px]'>
                          {item.productId?.title || 'Deleted Product'}
                        </p>
                        <p className='text-[10px] text-gray-400'>Size: {item.size} &nbsp;&middot;&nbsp; Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className='mb-3'>
                  <div className='flex justify-between text-xs text-gray-500 mb-1'>
                    <span>{currency}{pool.collectedAmount} collected</span>
                    <span>{currency}{pool.targetAmount} goal</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        isCancelled ? 'bg-red-400' : pool.status === 'ordered' ? 'bg-green-500' : 'bg-[#41334e]'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className='text-[10px] text-gray-400 mt-0.5'>{progress}% funded</p>
                </div>

                {/* Footer info */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-t border-gray-200 pt-3'>
                  <div className='flex flex-col gap-0.5 text-xs text-gray-500'>
                    <span>
                      <span className='font-semibold text-gray-700'>Deadline:</span> {new Date(pool.deadline).toDateString()}
                      {isCollecting && new Date(pool.deadline) > new Date() && (
                        <span className='ml-2 text-amber-600 font-semibold'>
                          ({Math.ceil((new Date(pool.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left)
                        </span>
                      )}
                    </span>
                    <span>
                      <span className='font-semibold text-gray-700'>Contributors:</span> {paidContributors.length} paid
                      {paidContributors.length > 0 && (
                        <span className='ml-1 text-gray-400'>
                          ({paidContributors.map(c => c.name).join(', ')})
                        </span>
                      )}
                    </span>
                    {pool.status === 'ordered' && pool.orderId && (
                      <span>
                        <span className='font-semibold text-gray-700'>Order ID:</span> {typeof pool.orderId === 'object' ? pool.orderId._id || pool.orderId : pool.orderId}
                      </span>
                    )}
                    {pool.recipientEmail && (
                      <span>
                        <span className='font-semibold text-gray-700'>Recipient Email:</span> {pool.recipientEmail}
                      </span>
                    )}
                    {pool.personalMessage && (
                      <span>
                        <span className='font-semibold text-gray-700'>Message:</span>{' '}
                        <span className='italic'>{pool.personalMessage}</span>
                      </span>
                    )}
                  </div>

                  {/* Status badge pill */}
                  <div className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 ${
                    isCancelled
                      ? 'bg-red-100 text-red-600'
                      : pool.status === 'ordered'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {cfg.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default dashboard
