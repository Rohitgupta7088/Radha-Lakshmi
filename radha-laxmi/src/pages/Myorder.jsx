// import React, { useEffect, useState} from 'react'
// import { useAppContext } from '../context/AppContext'

// const Myorder = () => {

//   const {currency, user, axios, getToken} = useAppContext()
//   const [orders, setOrders] = useState([])

//   const loadOrdersData = async () => {
//     if(!user){
//       return;
//     }

//     try {
//       const { data } = await axios.get('/api/orders/userorders', {
//         headers: {
//           Authorization: `Bearer ${await getToken()}`
//         }
//       });

//       if(data.success){
//         setOrders(data.orders)
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     if(user){
//       loadOrdersData()
//     }
//   },[user])

//   return (
//     <div className='mx-auto max-w-[1440px] px-4 lg:px-12 py-16 pt-28 bg-gray-200'>

//       <div>
//         <h3 className='font-bold h3 capitalize text-3xl'>My 
//             <span className='font-light text-[#41334e]'> Orders</span>
//         </h3>

//         <div className='w-24 h-[3px] rounded-full bg-gradient-to-r from-[#41334e]'/>
//         <p className='max-w-lg mt-2'>Discover cosmetic bangles that enhance, deliver radiance and bring confidence to your daily routine</p>
//       </div>

//       {orders.filter(order => order.items.some(item => item.products)).map((order)=> (
//         <div key={order._id} className='bg-white p-2 mt-3 rounded-2xl'>
//           {/* Order items */}
//           {order.items.filter(item => item.products).map((item, idx)=>(
//             <div key={idx} className='text-gray-700 flex flex-col lg:flex-row gap-4 mb-3'>
//               <div className='flex flex-[2] gap-x-2'>

//                 <div className='flex items-center justify-center bg-gray-200 rounded-xl'>
//                   <img src={item.products?.images?.[0] || ''} alt="" className='max-h-20 max-w-20 object-contain'/>
//                 </div>

//                 <div className='block w-full'>

//                   <h5 className='text-[14px] md:text-[16px] font-bold upperCase line-clamp-1'>{item.products?.title}</h5>

//                   <div className='flex fex-wrap gap-3 max-sm:gap-y-1 mt-1'>

//                     <div className='flex items-center gap-x-2'>
//                       <h5 className='text-[14px] font-[500]'>Price:</h5>
//                       <p>{currency}{item.products?.price?.[item.size]}</p>
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
//                   <h5 className='text-[14px] font-[500]'>Payment Status:</h5>
//                   <p className='text-gray-600 text-sm'>{order.isPaid ? "Completed" : "Pending"}</p>
//                   <div>
//                     <div className='flex items-center gap-x-2'>
//                       <h5 className='text-[14px] font-[500]'>Method:</h5>
//                       <p className='text-gray-600 text-sm'>{order.paymentMethod}</p>
//                     </div>
//                   </div>
//                  </div>
//               </div>

//               <div className='flex gap-4'>
//                 <div className='flex items-center gap-x-2'>
//                   <h5 className='text-[14px] font-[500]'>Date:</h5>
//                   <p className='text-gray-600 text-sm'>{new Date(order.createdAt).toDateString()}</p>
//                   <div>
//                     <div className='flex items-center gap-x-2'>
//                       <h5 className='text-[14px] font-[500]'>Amount:</h5>
//                       <p className='text-gray-600 text-sm'>{currency}{order.amount}</p>
//                     </div>
//                   </div>
//                  </div>
//               </div>

//             </div>

//             <div className='flex gap-3'>
//               <div className='flex items-center gap-2'>
//                 <h5 className='text-[14px] font-[500]'>Status:</h5>
//                 <div className='flex items-center gap-2'>
//                     <span className='min-w-2 h-2 rounded-full bg-green-500' />

//                     <p className='text-gray-600 text-[14px]'>{order.status}</p>
//                   </div>
//                 </div>

//                 <button onClick={loadOrdersData} className='text-[14px] font-[500] bg-gray-600 text-white px-3 transition-all cursor-pointer !py-1 !text-xs rounded-sm'>Track Order</button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default Myorder






import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Myorder = () => {

  const { currency, user, axios, getToken } = useAppContext()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  const loadOrdersData = async () => {
    if (!user) return
    try {
      const { data } = await axios.get('/api/orders/userorders', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) setOrders(data.orders)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) loadOrdersData()
  }, [user])

  // ─── Helper: hours elapsed since a given date ───
  const hoursElapsed = (date) => {
    return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60)
  }

  // ─── Cancel Logic ───
  // Active: within 24hr of createdAt AND not already cancelled/delivered/exchanged
  const canCancel = (order) => {
    const blocked = ['Cancelled', 'Delivered', 'Exchange Requested']
    return hoursElapsed(order.createdAt) <= 24 && !blocked.includes(order.status)
  }

  const cancelExpired = (order) => {
    const blocked = ['Cancelled', 'Delivered', 'Exchange Requested']
    return hoursElapsed(order.createdAt) > 24 && !blocked.includes(order.status)
  }

  // ─── Exchange Logic ───
  // Active: status is "Delivered" AND within 24hr of updatedAt (delivery time)
  const canExchange = (order) => {
    return order.status === 'Delivered' && hoursElapsed(order.updatedAt) <= 24
  }

  const exchangeExpired = (order) => {
    return order.status === 'Delivered' && hoursElapsed(order.updatedAt) > 24
  }

  // ─── Cancel Handler — navigate to cancel page with order data ───
  const handleCancel = (order) => {
    navigate('/cancel-order', { state: order })
  }

  // ─── Exchange Handler — navigate to exchange page with order data ───
  const handleExchange = (order) => {
    navigate('/exchange-order', { state: order })
  }

  return (
    <div className='mx-auto max-w-[1440px] px-4 lg:px-12 py-16 pt-28 bg-gray-200'>

      <div>
        <h3 className='font-bold h3 capitalize text-3xl'>My
          <span className='font-light text-[#41334e]'> Orders</span>
        </h3>
        <div className='w-24 h-[3px] rounded-full bg-gradient-to-r from-[#41334e]' />
        <p className='max-w-lg mt-2'>Discover cosmetic bangles that enhance, deliver radiance and bring confidence to your daily routine</p>
      </div>

      {orders.filter(order => order.items.some(item => item.products)).map((order) => (
        <div key={order._id} className='bg-white p-2 mt-3 rounded-2xl'>

          {/* Order items */}
          {order.items.filter(item => item.products).map((item, idx) => (
            <div key={idx} className='text-gray-700 flex flex-col lg:flex-row gap-4 mb-3'>
              <div className='flex flex-[2] gap-x-2'>

                <div className='flex items-center justify-center bg-gray-200 rounded-xl'>
                  <img src={item.products?.images?.[0] || ''} alt="" className='max-h-20 max-w-20 object-contain' />
                </div>

                <div className='block w-full'>
                  <h5 className='text-[14px] md:text-[16px] font-bold upperCase line-clamp-1'>{item.products?.title}</h5>

                  <div className='flex flex-wrap gap-3 max-sm:gap-y-1 mt-1'>
                    <div className='flex items-center gap-x-2'>
                      <h5 className='text-[14px] font-[500]'>Price:</h5>
                      <p>{currency}{item.products?.price?.[item.size]}</p>
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
              </div>

              <div className='flex gap-4'>
                <div className='flex items-center gap-x-2'>
                  <h5 className='text-[14px] font-[500]'>Payment Status:</h5>
                  <p className='text-gray-600 text-sm'>{order.isPaid ? "Completed" : "Pending"}</p>
                  <div className='flex items-center gap-x-2'>
                    <h5 className='text-[14px] font-[500]'>Method:</h5>
                    <p className='text-gray-600 text-sm'>{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex items-center gap-x-2'>
                  <h5 className='text-[14px] font-[500]'>Date:</h5>
                  <p className='text-gray-600 text-sm'>{new Date(order.createdAt).toDateString()}</p>
                  <div className='flex items-center gap-x-2'>
                    <h5 className='text-[14px] font-[500]'>Amount:</h5>
                    <p className='text-gray-600 text-sm'>{currency}{order.amount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Status + Buttons */}
            <div className='flex flex-col items-start lg:items-end gap-3'>

              {/* Status + Track */}
              <div className='flex gap-3 items-center'>
                <div className='flex items-center gap-2'>
                  <h5 className='text-[14px] font-[500]'>Status:</h5>
                  <div className='flex items-center gap-2'>
                    <span className={`min-w-2 h-2 rounded-full ${
                      order.status === 'Cancelled' ? 'bg-red-500' :
                      order.status === 'Delivered' ? 'bg-blue-500' :
                      order.status === 'Exchange Requested' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <p className='text-gray-600 text-[14px]'>{order.status}</p>
                  </div>
                </div>
                <button onClick={loadOrdersData} className='text-[14px] font-[500] bg-gray-600 text-white px-3 transition-all cursor-pointer !py-1 !text-xs rounded-sm'>
                  Track Order
                </button>
              </div>

              {/* ─── Cancel & Exchange Buttons ─── */}
              {order.status !== 'Cancelled' && order.status !== 'Exchange Requested' && (
                <div className='flex flex-wrap gap-2'>

                  {/* CANCEL BUTTON */}
                  <div className='flex flex-col gap-1'>
                    {canCancel(order) ? (
                      <button
                        onClick={() => handleCancel(order)}
                        className='text-xs font-[500] bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-sm transition-all cursor-pointer'
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <>
                        <button
                          disabled
                          className='text-xs font-[500] bg-gray-300 text-gray-400 px-3 py-1 rounded-sm cursor-not-allowed'
                        >
                          Cancel Order
                        </button>
                        {cancelExpired(order) && (
                          <p className='text-[10px] text-red-400 italic max-w-[160px] leading-tight'>
                            After 24 hrs we are not able to accept your cancellation request.
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* EXCHANGE BUTTON */}
                  <div className='flex flex-col gap-1'>
                    {canExchange(order) ? (
                      <button
                        onClick={() => handleExchange(order)}
                        className='text-xs font-[500] bg-[#41334e] hover:bg-[#5a4870] text-white px-3 py-1 rounded-sm transition-all cursor-pointer'
                      >
                        Request Exchange
                      </button>
                    ) : (
                      <>
                        <button
                          disabled
                          className='text-xs font-[500] bg-gray-300 text-gray-400 px-3 py-1 rounded-sm cursor-not-allowed'
                        >
                          Exchange
                        </button>
                        {exchangeExpired(order) && (
                          <p className='text-[10px] text-gray-400 italic max-w-[160px] leading-tight'>
                            After 24 hrs we are not able to accept your exchange request.
                          </p>
                        )}
                      </>
                    )}
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Myorder