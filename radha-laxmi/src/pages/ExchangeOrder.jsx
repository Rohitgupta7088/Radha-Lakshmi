import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const EXCHANGE_REASONS = [
  'Wrong product delivered',
  'Wrong color delivered',
  'Wrong size delivered',
]

const ExchangeOrder = () => {
  const { state: order } = useLocation()
  const navigate = useNavigate()
  const { currency, axios, getToken } = useAppContext()

  const [selectedReason, setSelectedReason] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!order) {
    navigate('/my-orders')
    return null
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return }
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!selectedReason) return toast.error('Please select a reason')
    if (!image) return toast.error('Please upload a product image as proof')
    if (!description.trim()) return toast.error('Please describe the issue')

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('orderId', order._id)
      formData.append('reason', selectedReason)
      formData.append('description', description)
      formData.append('image', image)

      const { data } = await axios.post('/api/orders/exchange', formData, {
        headers: { Authorization: `Bearer ${await getToken()}`, 'Content-Type': 'multipart/form-data' }
      })

      if (data.success) {
        toast.success('Exchange request submitted!')
        navigate('/my-orders')
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen bg-gray-100 pt-28 pb-16 px-4 lg:px-12'>
      <div className='max-w-5xl mx-auto'>
        <h2 className='text-2xl font-bold text-[#41334e] mb-1'>Request Exchange</h2>
        <div className='w-20 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] mb-8' />

        <div className='flex flex-col lg:flex-row gap-6'>

          {/* LEFT: Product Details */}
          <div className='flex-1 bg-white rounded-2xl p-6 shadow-sm'>
            <h3 className='text-lg font-bold text-gray-700 mb-4 border-b pb-2'>Order Details</h3>
            {order.items?.filter(item => item.products).map((item, idx) => (
              <div key={idx} className='flex gap-4 mb-4'>
                <div className='bg-gray-100 rounded-xl p-2 flex items-center justify-center'>
                  <img src={item.products?.images?.[0] || ''} alt='' className='w-20 h-20 object-contain' />
                </div>
                <div className='flex flex-col justify-center'>
                  <p className='font-bold text-gray-800 line-clamp-2'>{item.products?.title}</p>
                  <p className='text-sm text-gray-500 mt-1'>Size: <span className='font-medium text-gray-700'>{item.size}</span></p>
                  <p className='text-sm text-gray-500'>Qty: <span className='font-medium text-gray-700'>{item.quantity}</span></p>
                  <p className='text-sm text-gray-500'>Price: <span className='font-medium text-gray-700'>{currency}{item.products?.price?.[item.size]}</span></p>
                </div>
              </div>
            ))}
            <div className='border-t pt-4 mt-2 space-y-1 text-sm text-gray-600'>
              <p><span className='font-medium text-gray-700'>Order ID:</span> {order._id}</p>
              <p><span className='font-medium text-gray-700'>Date:</span> {new Date(order.createdAt).toDateString()}</p>
              <p><span className='font-medium text-gray-700'>Amount:</span> {currency}{order.amount}</p>
              <p><span className='font-medium text-gray-700'>Payment:</span> {order.paymentMethod} — {order.isPaid ? 'Completed' : 'Pending'}</p>
            </div>
          </div>

          {/* RIGHT: Reason + Proof */}
          <div className='flex-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5'>
            <div>
              <h3 className='text-lg font-bold text-gray-700 mb-4 border-b pb-2'>Reason for Exchange</h3>
              <div className='space-y-3'>
                {EXCHANGE_REASONS.map((reason) => (
                  <label key={reason} className='flex items-center gap-3 cursor-pointer'>
                    <input
                      type='radio' name='reason' value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className='accent-[#41334e] w-4 h-4 cursor-pointer'
                    />
                    <span className={`text-sm ${selectedReason === reason ? 'text-[#41334e] font-semibold' : 'text-gray-600'}`}>
                      {reason}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {selectedReason && (
              <div className='flex flex-col gap-4 border-t pt-4'>
                <div>
                  <p className='text-sm font-semibold text-gray-700 mb-1'>Upload Proof Image <span className='text-red-400'>*</span></p>
                  <p className='text-xs text-gray-400 mb-3'>Upload a clear photo showing the issue with your product.</p>
                  <label className='flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-[#41334e] transition-colors'>
                    {imagePreview
                      ? <img src={imagePreview} alt='preview' className='max-h-40 object-contain rounded-lg' />
                      : (
                        <>
                          <span className='text-3xl text-gray-300 mb-2'>📷</span>
                          <span className='text-sm text-gray-400'>Click to upload image</span>
                          <span className='text-xs text-gray-300 mt-1'>Max 5MB</span>
                        </>
                      )}
                    <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
                  </label>
                  {imagePreview && (
                    <button onClick={() => { setImage(null); setImagePreview(null) }} className='text-xs text-red-400 mt-2 hover:underline'>
                      Remove image
                    </button>
                  )}
                </div>

                <div>
                  <p className='text-sm font-semibold text-gray-700 mb-2'>Describe the Issue <span className='text-red-400'>*</span></p>
                  <textarea
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder='Describe the issue in detail...' rows={4}
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#41334e] resize-none'
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !selectedReason || !image || !description.trim()}
              className={`mt-auto w-full py-3 rounded-xl font-semibold text-white transition-all ${
                !loading && selectedReason && image && description.trim()
                  ? 'bg-[#41334e] hover:bg-[#5a4870] cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed text-gray-400'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Exchange Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExchangeOrder