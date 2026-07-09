import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const GiftPoolStatus = () => {
  const { poolId } = useParams()
  const navigate = useNavigate()
  const { axios, getToken, user } = useAppContext()

  const [pool, setPool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [extending, setExtending] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState('')

  const fetchPool = async () => {
    try {
      const { data } = await axios.get(`/api/gift/${poolId}`)
      if (data.success) setPool(data.pool)
    } catch (err) { toast.error('Failed to load pool') }
    setLoading(false)
  }

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get('/api/address/get', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) setAddresses(data.addresses)
    } catch (err) {}
  }

  useEffect(() => {
    if (user) { fetchPool(); fetchAddresses() }
  }, [user])

  const handleExtend = async () => {
    setExtending(true)
    try {
      const { data } = await axios.post('/api/gift/extend', { poolId }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) { toast.success('Deadline extended by 7 days!'); fetchPool() }
      else toast.error(data.message)
    } catch (err) { toast.error('Something went wrong') }
    setExtending(false)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return toast.error('Select a delivery address')
    setPlacingOrder(true)
    try {
      const { data } = await axios.post('/api/gift/place-order', { poolId, addressId: selectedAddress }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success('Gift order placed! 🎉')
        fetchPool()
      } else toast.error(data.message)
    } catch (err) { toast.error('Something went wrong') }
    setPlacingOrder(false)
  }

  if (loading) return <div className='min-h-screen flex items-center justify-center'><p className='text-gray-400 animate-pulse'>Loading...</p></div>
  if (!pool) return <div className='min-h-screen flex items-center justify-center'><p className='text-gray-500'>Pool not found.</p></div>

  const progress = Math.min((pool.collectedAmount / pool.targetAmount) * 100, 100)
  const paidContributors = pool.contributors?.filter(c => c.isPaid) || []
  const daysLeft = Math.max(0, Math.ceil((new Date(pool.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
  const poolUrl = `${window.location.origin}/gift/${poolId}`
  const whatsappMsg = encodeURIComponent(`Hey! We're gifting ${pool.recipientName} beautiful bangles from Radha Lakshmi 💍 Contribute here: ${poolUrl} — Deadline: ${new Date(pool.deadline).toDateString()}`)

  return (
    <div className='min-h-screen bg-gray-100 pt-28 pb-16 px-4 lg:px-12'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-2xl font-bold text-[#41334e] mb-1'>Pool Status</h2>
        <div className='w-20 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] mb-6' />

        {/* Status badge */}
        <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold mb-4 ${
          pool.status === 'active' ? 'bg-green-100 text-green-700' :
          pool.status === 'completed' ? 'bg-blue-100 text-blue-700' :
          pool.status === 'ordered' ? 'bg-purple-100 text-purple-700' :
          'bg-red-100 text-red-500'
        }`}>
          {pool.status.toUpperCase()}
        </div>

        {/* Share link */}
        <div className='bg-white rounded-2xl p-5 shadow-sm mb-4'>
          <h3 className='font-bold text-gray-700 mb-2'>Share Pool Link</h3>
          <div className='flex gap-2'>
            <input readOnly value={poolUrl}
              className='flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50' />
            <button onClick={() => { navigator.clipboard.writeText(poolUrl); toast.success('Link copied!') }}
              className='px-4 py-2 bg-[#41334e] text-white text-xs font-semibold rounded-lg cursor-pointer'>
              Copy
            </button>
          </div>
          <a href={`https://wa.me/?text=${whatsappMsg}`} target='_blank' rel='noreferrer'
            className='mt-2 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all'>
            Share on WhatsApp 💬
          </a>
        </div>

        {/* Progress */}
        <div className='bg-white rounded-2xl p-5 shadow-sm mb-4'>
          <div className='flex justify-between text-sm font-semibold mb-2'>
            <span>₹{pool.collectedAmount} of ₹{pool.targetAmount}</span>
            <span>{daysLeft} days left</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-4 overflow-hidden'>
            <div className='h-4 rounded-full bg-gradient-to-r from-[#41334e] to-purple-400 transition-all' style={{ width: `${progress}%` }} />
          </div>
          <p className='text-xs text-gray-500 mt-1'>{Math.round(progress)}% funded · {paidContributors.length} contributors</p>
        </div>

        {/* Contributors */}
        {paidContributors.length > 0 && (
          <div className='bg-white rounded-2xl p-5 shadow-sm mb-4'>
            <h3 className='font-bold text-gray-700 mb-3'>Contributors 💜</h3>
            {paidContributors.map((c, idx) => (
              <div key={idx} className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
                <div className='flex items-center gap-2'>
                  <div className='w-7 h-7 rounded-full bg-[#41334e] text-white text-xs flex items-center justify-center font-bold'>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <span className='text-sm text-gray-700'>{c.name}</span>
                </div>
                <span className='text-sm font-bold text-[#41334e]'>₹{c.amount}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {pool.status === 'completed' && (
          <div className='bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm mb-4'>
            <h3 className='font-bold text-green-700 mb-3'>🎉 Goal Reached! Place the Order</h3>
            <select value={selectedAddress} onChange={e => setSelectedAddress(e.target.value)}
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none'>
              <option value=''>Select delivery address...</option>
              {addresses.map(addr => (
                <option key={addr._id} value={addr._id}>
                  {addr.firstName} {addr.lastName} — {addr.street}, {addr.city}
                </option>
              ))}
            </select>
            <button onClick={handlePlaceOrder} disabled={placingOrder || !selectedAddress}
              className='w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all cursor-pointer disabled:opacity-50'>
              {placingOrder ? 'Placing Order...' : '📦 Place Gift Order'}
            </button>
          </div>
        )}

        {(pool.status === 'active' || pool.status === 'expired') && pool.status !== 'ordered' && (
          <button onClick={handleExtend} disabled={extending}
            className='w-full py-3 rounded-xl border-2 border-[#41334e] text-[#41334e] font-semibold text-sm hover:bg-[#41334e] hover:text-white transition-all cursor-pointer disabled:opacity-50'>
            {extending ? 'Extending...' : '⏰ Extend Deadline by 7 Days'}
          </button>
        )}

        {pool.status === 'ordered' && (
          <div className='bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center'>
            <p className='text-2xl mb-2'>📦</p>
            <p className='font-bold text-purple-700'>Gift Order Placed Successfully!</p>
            <p className='text-sm text-gray-500 mt-1'>The gift is on its way to {pool.recipientName} 💜</p>
            <button onClick={() => navigate('/my-orders')}
              className='mt-4 px-6 py-2 rounded-xl bg-[#41334e] text-white text-sm font-semibold cursor-pointer'>
              View in My Orders
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GiftPoolStatus