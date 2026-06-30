import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

// Cashfree redirects the customer back here after payment attempt.
// We poll our backend to find out if payment actually succeeded or failed.

const CashfreeReturn = () => {
  const [searchParams] = useSearchParams()
  const { navigate, axios, getToken, setcartItems } = useAppContext()
  const [message, setMessage] = useState('Verifying your payment...')
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    if (!orderId) {
      setMessage('Invalid return URL. Redirecting...')
      setTimeout(() => navigate('/cart'), 2000)
      return
    }

    let attempts = 0
    const maxAttempts = 8 // poll up to 8 times (8 seconds total)

    const poll = async () => {
      try {
        attempts++
        const { data } = await axios.post('/api/orders/cashfree/verify', { orderId }, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })

        if (data.success && data.isPaid) {
          setMessage('Payment successful! Redirecting to your orders...')
          setcartItems({})
          setTimeout(() => navigate('/my-orders'), 1500)
        }
        else if (data.status === 'pending' && attempts < maxAttempts) {
          // Payment still processing — try again in 1 second
          setTimeout(poll, 1000)
        }
        else if (!data.success || (!data.isPaid && attempts >= maxAttempts)) {
          setMessage('Payment failed or was cancelled. Redirecting to cart...')
          setTimeout(() => navigate('/cart'), 2500)
        }
      } catch (error) {
        setMessage('Something went wrong verifying payment. Redirecting...')
        setTimeout(() => navigate('/cart'), 2500)
      }
    }

    // Start polling after a 1-second delay to give Cashfree time to process
    setTimeout(poll, 1000)
  }, [orderId])

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-6'>
      <div className='animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-[#41334e]' />
      <p className='text-[16px] text-gray-600 font-[500]'>{message}</p>
    </div>
  )
}

export default CashfreeReturn