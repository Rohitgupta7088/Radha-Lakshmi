import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const CANCEL_REASONS = [
  'Wrong product ordered',
  'Selected by mistake',
  'Not interested in shopping anymore',
  'Found a better price elsewhere',
  'Delivery time is too long',
  'Ordered duplicate item',
  'Other',
]

const CancelOrder = () => {
  const { state: order } = useLocation()
  const navigate = useNavigate()
  const { currency, axios, getToken } = useAppContext()

  const [selectedReason, setSelectedReason] = useState('')
  const [otherText, setOtherText] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)

  if (!order) {
    navigate('/my-orders')
    return null
  }

  const finalReason = selectedReason === 'Other' ? otherText.trim() : selectedReason

  const handleConfirmCancel = async () => {
    if (confirmText !== 'Cancel my product') {
      toast.error('Please type exactly: Cancel my product')
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.post('/api/orders/cancel', {
        orderId: order._id,
        reason: finalReason,
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success('Order cancelled successfully')
        setShowPopup(false)
        navigate('/my-orders')
      } else {
        toast.error(data.message)
        setShowPopup(false)
      }
    } catch (err) {
      toast.error('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-gray-100 pt-28 pb-16 px-4 lg:px-12'>
      <div className='max-w-5xl mx-auto'>

        {/* Page Title */}
        <h2 className='text-2xl font-bold text-[#41334e] mb-1'>Cancel Order</h2>
        <div className='w-20 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] mb-8' />

        <div className='flex flex-col lg:flex-row gap-6'>

          {/* ── LEFT: Order Details ── */}
          <div className='flex-1 bg-white rounded-2xl p-6 shadow-sm'>
            <h3 className='text-lg font-bold text-gray-700 mb-4 border-b pb-2'>Order Details</h3>

            {/* Products */}
            {order.items?.filter(item => item.products).map((item, idx) => (
              <div key={idx} className='flex gap-4 mb-4'>
                <div className='bg-gray-100 rounded-xl p-2 flex items-center justify-center'>
                  <img
                    src={item.products?.images?.[0] || ''}
                    alt={item.products?.title}
                    className='w-20 h-20 object-contain'
                  />
                </div>
                <div className='flex flex-col justify-center'>
                  <p className='font-bold text-gray-800 line-clamp-2'>{item.products?.title}</p>
                  <p className='text-sm text-gray-500 mt-1'>Size: <span className='text-gray-700 font-medium'>{item.size}</span></p>
                  <p className='text-sm text-gray-500'>Qty: <span className='text-gray-700 font-medium'>{item.quantity}</span></p>
                  <p className='text-sm text-gray-500'>Price: <span className='text-gray-700 font-medium'>{currency}{item.products?.price?.[item.size]}</span></p>
                </div>
              </div>
            ))}

            <div className='border-t pt-4 mt-2 space-y-1 text-sm text-gray-600'>
              <p><span className='font-medium text-gray-700'>Order ID:</span> {order._id}</p>
              <p><span className='font-medium text-gray-700'>Date:</span> {new Date(order.createdAt).toDateString()}</p>
              <p><span className='font-medium text-gray-700'>Amount:</span> {currency}{order.amount}</p>
              <p><span className='font-medium text-gray-700'>Payment:</span> {order.paymentMethod} — {order.isPaid ? 'Completed' : 'Pending'}</p>
              <p><span className='font-medium text-gray-700'>Status:</span> {order.status}</p>
            </div>
          </div>

          {/* ── RIGHT: Cancel Reason ── */}
          <div className='flex-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between'>
            <div>
              <h3 className='text-lg font-bold text-gray-700 mb-4 border-b pb-2'>Reason for Cancellation</h3>

              <div className='space-y-3'>
                {CANCEL_REASONS.map((reason) => (
                  <label key={reason} className='flex items-center gap-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='reason'
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className='accent-[#41334e] w-4 h-4 cursor-pointer'
                    />
                    <span className={`text-sm ${selectedReason === reason ? 'text-[#41334e] font-semibold' : 'text-gray-600'} group-hover:text-[#41334e] transition-colors`}>
                      {reason}
                    </span>
                  </label>
                ))}
              </div>

              {/* Other textarea */}
              {selectedReason === 'Other' && (
                <textarea
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder='Please describe your reason...'
                  rows={4}
                  className='mt-4 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#41334e] resize-none'
                />
              )}
            </div>

            {/* Confirm Cancel Button */}
            <button
              disabled={!selectedReason || (selectedReason === 'Other' && !otherText.trim())}
              onClick={() => setShowPopup(true)}
              className={`mt-8 w-full py-3 rounded-xl font-semibold text-white transition-all ${
                selectedReason && !(selectedReason === 'Other' && !otherText.trim())
                  ? 'bg-red-500 hover:bg-red-600 cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed text-gray-400'
              }`}
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </div>

      {/* ── CONFIRMATION POPUP ── */}
      {showPopup && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
          <div className='bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl'>

            <h3 className='text-xl font-bold text-gray-800 mb-2'>Are you sure?</h3>
            <p className='text-sm text-gray-500 mb-1'>This action cannot be undone. To confirm, type exactly:</p>
            <p className='text-[#41334e] font-bold text-sm mb-4'>"Cancel my product"</p>

            <input
              type='text'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type here...'
              className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-6 focus:outline-none focus:border-red-400'
            />

            <div className='flex gap-3'>
              <button
                onClick={() => { setShowPopup(false); setConfirmText('') }}
                className='flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm font-medium transition-all'
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={loading || confirmText !== 'Cancel my product'}
                className={`flex-1 py-2 rounded-lg text-white text-sm font-semibold transition-all ${
                  confirmText === 'Cancel my product' && !loading
                    ? 'bg-red-500 hover:bg-red-600 cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CancelOrder