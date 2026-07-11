// import React, { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { useAppContext } from '../context/AppContext'
// import toast from 'react-hot-toast'

// const OCCASION_EMOJI = { Wedding: '💍', Birthday: '🎂', Festival: '🪔', Anniversary: '💑', 'Baby Shower': '👶' }

// const GiftPoolPage = () => {
//   const { poolId } = useParams()
//   const navigate = useNavigate()
//   const { axios } = useAppContext()

//   const [pool, setPool] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [form, setForm] = useState({ name: '', amount: '' })
//   const [submitting, setSubmitting] = useState(false)
//   const [contributed, setContributed] = useState(false)

//   const fetchPool = async () => {
//     try {
//       const { data } = await axios.get(`/api/gift/${poolId}`)
//       if (data.success) setPool(data.pool)
//       else toast.error(data.message)
//     } catch (err) {
//       toast.error('Pool not found')
//     }
//     setLoading(false)
//   }

//   useEffect(() => { fetchPool() }, [poolId])

//   const handleContribute = async () => {
//     if (!form.name.trim()) return toast.error('Enter your name')
//     if (!form.amount || Number(form.amount) <= 0) return toast.error('Enter a valid amount')
//     if (pool.minContribution > 0 && Number(form.amount) < pool.minContribution) {
//       return toast.error(`Minimum contribution is ₹${pool.minContribution}`)
//     }

//     setSubmitting(true)
//     try {
//       const { data } = await axios.post(`/api/gift/${poolId}/contribute`, {
//         name: form.name,
//         amount: Number(form.amount),
//         paymentMethod: 'COD',
//       })
//       if (data.success) {
//         toast.success('Contribution added! Thank you 💜')
//         setContributed(true)
//         fetchPool()
//       } else {
//         toast.error(data.message)
//       }
//     } catch (err) {
//       toast.error('Something went wrong')
//     }
//     setSubmitting(false)
//   }

//   if (loading) return (
//     <div className='min-h-screen flex items-center justify-center'>
//       <p className='text-gray-400 animate-pulse'>Loading gift pool...</p>
//     </div>
//   )

//   if (!pool) return (
//     <div className='min-h-screen flex items-center justify-center'>
//       <p className='text-gray-500'>Gift pool not found.</p>
//     </div>
//   )

//   const progress = Math.min((pool.collectedAmount / pool.targetAmount) * 100, 100)
//   const paidContributors = pool.contributors?.filter(c => c.isPaid) || []
//   const daysLeft = Math.max(0, Math.ceil((new Date(pool.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
//   const isActive = pool.status === 'active' && daysLeft > 0
//   const whatsappMsg = encodeURIComponent(`Hey! We're gifting ${pool.recipientName} beautiful bangles from Radha Lakshmi 💍 Contribute here: ${window.location.href} — Deadline: ${new Date(pool.deadline).toDateString()}`)

//   return (
//     <div className='min-h-screen bg-gray-100 pt-28 pb-16 px-4 lg:px-12'>
//       <div className='max-w-4xl mx-auto'>

//         {/* Header banner */}
//         <div className='bg-[#41334e] rounded-2xl p-6 text-white text-center mb-6'>
//           <p className='text-3xl mb-2'>{OCCASION_EMOJI[pool.occasion] || '🎁'}</p>
//           <h1 className='text-2xl font-bold'>Gift for {pool.recipientName}</h1>
//           <p className='text-purple-200 mt-1'>{pool.occasion} Gift Pool</p>
//           {pool.personalMessage && (
//             <p className='mt-3 italic text-purple-100 text-sm max-w-lg mx-auto'>"{pool.personalMessage}"</p>
//           )}
//           {pool.wrapTogether && (
//             <div className='mt-3 inline-block bg-white/20 px-4 py-1 rounded-full text-xs'>🎀 Wrapped Together as One Bundle</div>
//           )}
//         </div>

//         <div className='flex flex-col lg:flex-row gap-6'>

//           {/* LEFT: Pool info */}
//           <div className='flex-1 flex flex-col gap-4'>

//             {/* Products */}
//             <div className='bg-white rounded-2xl p-6 shadow-sm'>
//               <h3 className='font-bold text-gray-700 mb-3 border-b pb-2'>🎁 Gift Items</h3>
//               {pool.products?.map((item, idx) => (
//                 <div key={idx} className='flex gap-3 items-center mb-3'>
//                   <img src={item.productId?.images?.[0]} alt='' className='w-16 h-16 object-contain rounded-xl bg-gray-100' />
//                   <div>
//                     <p className='text-sm font-bold text-gray-700'>{item.productId?.title}</p>
//                     <p className='text-xs text-gray-500'>Size: {item.size} · Qty: {item.quantity}</p>
//                     <p className='text-xs font-semibold text-[#41334e]'>₹{(item.productId?.price?.[item.size] || 0) * item.quantity}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Progress */}
//             <div className='bg-white rounded-2xl p-6 shadow-sm'>
//               <div className='flex justify-between text-sm font-semibold text-gray-700 mb-2'>
//                 <span>₹{pool.collectedAmount} collected</span>
//                 <span>₹{pool.targetAmount} goal</span>
//               </div>
//               <div className='w-full bg-gray-200 rounded-full h-4 overflow-hidden'>
//                 <div
//                   className='h-4 rounded-full bg-gradient-to-r from-[#41334e] to-purple-400 transition-all duration-700'
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//               <div className='flex justify-between mt-2 text-xs text-gray-500'>
//                 <span>{Math.round(progress)}% funded</span>
//                 <span>{daysLeft} days left</span>
//               </div>

//               {pool.status === 'completed' && (
//                 <div className='mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-center text-green-700 font-semibold text-sm'>
//                   🎉 Goal Reached! The organizer will place the order soon.
//                 </div>
//               )}
//               {pool.status === 'expired' && (
//                 <div className='mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-center text-red-500 font-semibold text-sm'>
//                   ⏰ This pool has expired.
//                 </div>
//               )}
//               {pool.status === 'ordered' && (
//                 <div className='mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center text-blue-700 font-semibold text-sm'>
//                   📦 Gift has been ordered! It's on its way to {pool.recipientName}.
//                 </div>
//               )}
//             </div>

//             {/* Contributor Wall */}
//             {paidContributors.length > 0 && (
//               <div className='bg-white rounded-2xl p-6 shadow-sm'>
//                 <h3 className='font-bold text-gray-700 mb-3 border-b pb-2'>💜 Contributors ({paidContributors.length})</h3>
//                 <div className='flex flex-wrap gap-2'>
//                   {paidContributors.map((c, idx) => (
//                     <div key={idx} className='flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-3 py-1'>
//                       <div className='w-6 h-6 rounded-full bg-[#41334e] text-white text-xs flex items-center justify-center font-bold'>
//                         {c.name.charAt(0).toUpperCase()}
//                       </div>
//                       <span className='text-xs text-gray-700 font-medium'>{c.name}</span>
//                       <span className='text-xs text-[#41334e] font-bold'>₹{c.amount}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* RIGHT: Contribute form */}
//           <div className='w-full lg:w-80'>
//             {isActive && !contributed ? (
//               <div className='bg-white rounded-2xl p-6 shadow-sm'>
//                 <h3 className='font-bold text-gray-700 mb-4 border-b pb-2'>Contribute 💝</h3>

//                 <div className='mb-3'>
//                   <p className='text-sm font-semibold text-gray-700 mb-1'>Your Name</p>
//                   <input type='text' value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//                     placeholder='Enter your name'
//                     className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
//                 </div>

//                 <div className='mb-4'>
//                   <p className='text-sm font-semibold text-gray-700 mb-1'>
//                     Amount (₹) {pool.minContribution > 0 && <span className='text-gray-400 font-normal text-xs'>min ₹{pool.minContribution}</span>}
//                   </p>
//                   <input type='number' value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
//                     placeholder={pool.minContribution > 0 ? `Min ₹${pool.minContribution}` : 'Any amount'}
//                     className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
//                 </div>

//                 <button
//                   onClick={handleContribute}
//                   disabled={submitting}
//                   className='w-full py-3 rounded-xl bg-[#41334e] hover:bg-[#5a4870] text-white font-semibold text-sm transition-all cursor-pointer disabled:opacity-50'
//                 >
//                   {submitting ? 'Processing...' : '💝 Contribute Now'}
//                 </button>

//                 <a
//                   href={`https://wa.me/?text=${whatsappMsg}`}
//                   target='_blank' rel='noreferrer'
//                   className='mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all'
//                 >
//                   Share on WhatsApp 💬
//                 </a>
//               </div>
//             ) : contributed ? (
//               <div className='bg-white rounded-2xl p-6 shadow-sm text-center'>
//                 <p className='text-4xl mb-2'>🎉</p>
//                 <h3 className='font-bold text-gray-700 mb-2'>Thank you!</h3>
//                 <p className='text-sm text-gray-500 mb-4'>Your contribution has been added to {pool.recipientName}'s gift pool.</p>
//                 <a href={`https://wa.me/?text=${whatsappMsg}`} target='_blank' rel='noreferrer'
//                   className='flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-green-500 text-white text-sm font-semibold'>
//                   Invite more friends 💬
//                 </a>
//               </div>
//             ) : (
//               <div className='bg-white rounded-2xl p-6 shadow-sm text-center'>
//                 <p className='text-gray-500 text-sm'>This pool is no longer accepting contributions.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default GiftPoolPage






import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const OCCASION_EMOJI = { Wedding: '💍', Birthday: '🎂', Festival: '🪔', Anniversary: '💑', 'Baby Shower': '👶' }

const GiftPoolPage = () => {
  const { poolId } = useParams()
  const navigate = useNavigate()
  const { axios, user } = useAppContext()

  const [pool, setPool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', amount: '' })
  const [submitting, setSubmitting] = useState(false)
  const [contributed, setContributed] = useState(false)

  const fetchPool = async () => {
    try {
      const { data } = await axios.get(`/api/gift/${poolId}`)
      if (data.success) setPool(data.pool)
      else toast.error(data.message)
    } catch (err) {
      toast.error('Pool not found')
    }
    setLoading(false)
  }

  useEffect(() => { fetchPool() }, [poolId])

  const handleContribute = async () => {
    if (!form.name.trim()) return toast.error('Enter your name')
    if (!form.amount || Number(form.amount) <= 0) return toast.error('Enter a valid amount')
    if (pool.minContribution > 0 && Number(form.amount) < pool.minContribution) {
      return toast.error(`Minimum contribution is ₹${pool.minContribution}`)
    }

    setSubmitting(true)
    try {
      const { data } = await axios.post(`/api/gift/${poolId}/contribute/init`, {
        name: form.name,
        email: form.email,
        amount: Number(form.amount),
        userId: user?.id || "",
      })

      if (!data.success) {
        toast.error(data.message)
        setSubmitting(false)
        return
      }

      // Open Cashfree Drop checkout for the friend's contribution
      const cashfree = window.Cashfree({ mode: 'sandbox' })
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: '_self',
      })
    } catch (err) {
      toast.error('Something went wrong')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center'>
      <p className='text-gray-400 animate-pulse'>Loading gift pool...</p>
    </div>
  )

  if (!pool) return (
    <div className='min-h-screen flex items-center justify-center'>
      <p className='text-gray-500'>Gift pool not found.</p>
    </div>
  )

  const progress = Math.min((pool.collectedAmount / pool.targetAmount) * 100, 100)
  const paidContributors = pool.contributors?.filter(c => c.isPaid) || []
  const daysLeft = Math.max(0, Math.ceil((new Date(pool.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
  const isActive = pool.status === 'active' && daysLeft > 0
  const whatsappMsg = encodeURIComponent(`Hey! We're gifting ${pool.recipientName} beautiful bangles from Radha Lakshmi 💍 Contribute here: ${window.location.href} — Deadline: ${new Date(pool.deadline).toDateString()}`)

  return (
    <div className='min-h-screen bg-gray-100 pt-28 pb-16 px-4 lg:px-12'>
      <div className='max-w-4xl mx-auto'>

        {/* Header banner */}
        <div className='bg-[#41334e] rounded-2xl p-6 text-white text-center mb-6'>
          <p className='text-3xl mb-2'>{OCCASION_EMOJI[pool.occasion] || '🎁'}</p>
          <h1 className='text-2xl font-bold'>Gift for {pool.recipientName}</h1>
          <p className='text-purple-200 mt-1'>{pool.occasion} Gift Pool</p>
          {pool.personalMessage && (
            <p className='mt-3 italic text-purple-100 text-sm max-w-lg mx-auto'>"{pool.personalMessage}"</p>
          )}
          {pool.wrapTogether && (
            <div className='mt-3 inline-block bg-white/20 px-4 py-1 rounded-full text-xs'>🎀 Wrapped Together as One Bundle</div>
          )}
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>

          {/* LEFT: Pool info */}
          <div className='flex-1 flex flex-col gap-4'>

            {/* Products */}
            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <h3 className='font-bold text-gray-700 mb-3 border-b pb-2'>🎁 Gift Items</h3>
              {pool.products?.map((item, idx) => (
                <div key={idx} className='flex gap-3 items-center mb-3'>
                  <img src={item.productId?.images?.[0]} alt='' className='w-16 h-16 object-contain rounded-xl bg-gray-100' />
                  <div>
                    <p className='text-sm font-bold text-gray-700'>{item.productId?.title}</p>
                    <p className='text-xs text-gray-500'>Size: {item.size} · Qty: {item.quantity}</p>
                    <p className='text-xs font-semibold text-[#41334e]'>₹{(item.productId?.price?.[item.size] || 0) * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className='bg-white rounded-2xl p-6 shadow-sm'>
              <div className='flex justify-between text-sm font-semibold text-gray-700 mb-2'>
                <span>₹{pool.collectedAmount} collected</span>
                <span>₹{pool.targetAmount} goal</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-4 overflow-hidden'>
                <div
                  className='h-4 rounded-full bg-gradient-to-r from-[#41334e] to-purple-400 transition-all duration-700'
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className='flex justify-between mt-2 text-xs text-gray-500'>
                <span>{Math.round(progress)}% funded</span>
                <span>{daysLeft} days left</span>
              </div>

              {pool.status === 'completed' && (
                <div className='mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-center text-green-700 font-semibold text-sm'>
                  🎉 Goal Reached! The organizer will place the order soon.
                </div>
              )}
              {pool.status === 'expired' && (
                <div className='mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-center text-red-500 font-semibold text-sm'>
                  ⏰ This pool has expired.
                </div>
              )}
              {pool.status === 'ordered' && (
                <div className='mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 text-center text-blue-700 font-semibold text-sm'>
                  📦 Gift has been ordered! It's on its way to {pool.recipientName}.
                </div>
              )}
            </div>

            {/* Contributor Wall */}
            {paidContributors.length > 0 && (
              <div className='bg-white rounded-2xl p-6 shadow-sm'>
                <h3 className='font-bold text-gray-700 mb-3 border-b pb-2'>💜 Contributors ({paidContributors.length})</h3>
                <div className='flex flex-wrap gap-2'>
                  {paidContributors.map((c, idx) => (
                    <div key={idx} className='flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-3 py-1'>
                      <div className='w-6 h-6 rounded-full bg-[#41334e] text-white text-xs flex items-center justify-center font-bold'>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span className='text-xs text-gray-700 font-medium'>{c.name}</span>
                      <span className='text-xs text-[#41334e] font-bold'>₹{c.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Contribute form */}
          <div className='w-full lg:w-80'>
            {isActive && !contributed ? (
              <div className='bg-white rounded-2xl p-6 shadow-sm'>
                <h3 className='font-bold text-gray-700 mb-4 border-b pb-2'>Contribute 💝</h3>

                <div className='mb-3'>
                  <p className='text-sm font-semibold text-gray-700 mb-1'>Your Name</p>
                  <input type='text' value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder='Enter your name'
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
                </div>

                <div className='mb-3'>
                  <p className='text-sm font-semibold text-gray-700 mb-1'>Your Email <span className='text-gray-400 text-xs font-normal'>(for payment receipt)</span></p>
                  <input type='email' value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder='you@email.com'
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
                </div>

                <div className='mb-4'>
                  <p className='text-sm font-semibold text-gray-700 mb-1'>
                    Amount (₹) {pool.minContribution > 0 && <span className='text-gray-400 font-normal text-xs'>min ₹{pool.minContribution}</span>}
                  </p>
                  <input type='number' value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder={pool.minContribution > 0 ? `Min ₹${pool.minContribution}` : 'Any amount'}
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
                </div>

                <button
                  onClick={handleContribute}
                  disabled={submitting}
                  className='w-full py-3 rounded-xl bg-[#41334e] hover:bg-[#5a4870] text-white font-semibold text-sm transition-all cursor-pointer disabled:opacity-50'
                >
                  {submitting ? 'Redirecting to Payment...' : `💳 Pay ₹${form.amount || '0'} & Contribute`}
                </button>

                <a
                  href={`https://wa.me/?text=${whatsappMsg}`}
                  target='_blank' rel='noreferrer'
                  className='mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all'
                >
                  Share on WhatsApp 💬
                </a>
              </div>
            ) : contributed ? (
              <div className='bg-white rounded-2xl p-6 shadow-sm text-center'>
                <p className='text-4xl mb-2'>🎉</p>
                <h3 className='font-bold text-gray-700 mb-2'>Thank you!</h3>
                <p className='text-sm text-gray-500 mb-4'>Your contribution has been added to {pool.recipientName}'s gift pool.</p>
                <a href={`https://wa.me/?text=${whatsappMsg}`} target='_blank' rel='noreferrer'
                  className='flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-green-500 text-white text-sm font-semibold'>
                  Invite more friends 💬
                </a>
              </div>
            ) : (
              <div className='bg-white rounded-2xl p-6 shadow-sm text-center'>
                <p className='text-gray-500 text-sm'>
                  {pool.status === 'pending_payment'
                    ? 'This gift pool is awaiting the organizer\'s activation payment.'
                    : 'This pool is no longer accepting contributions.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GiftPoolPage
