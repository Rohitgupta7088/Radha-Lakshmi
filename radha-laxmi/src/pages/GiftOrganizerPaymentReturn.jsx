import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

// Cashfree redirects the organizer back here after their upfront-contribution payment attempt.
// We poll our backend to confirm the payment, which then activates the pool and emails the organizer.

const GiftOrganizerPaymentReturn = () => {
  const { poolId } = useParams()
  const { navigate, axios, getToken } = useAppContext()
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    if (!poolId) {
      setMessage('Invalid return URL. Redirecting...')
      setTimeout(() => navigate('/gift/create'), 2000)
      return
    }

    let attempts = 0
    const maxAttempts = 10 // poll up to 10 times (10 seconds total)

    const poll = async () => {
      try {
        attempts++
        const { data } = await axios.post(`/api/gift/${poolId}/organizer-payment/verify`, {}, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })

        if (data.success && data.isPaid) {
          sessionStorage.removeItem('pendingGiftPoolId')
          setMessage('Payment successful! Your gift pool is now live 🎁')
          setTimeout(() => navigate(`/gift/${poolId}/status`), 1500)
        }
        else if (data.status === 'pending' && attempts < maxAttempts) {
          setTimeout(poll, 1000)
        }
        else if (!data.success || (!data.isPaid && attempts >= maxAttempts)) {
          setMessage('Payment failed or was cancelled. Redirecting...')
          setTimeout(() => navigate('/gift/create'), 2500)
        }
      } catch (error) {
        setMessage('Something went wrong verifying payment. Redirecting...')
        setTimeout(() => navigate('/gift/create'), 2500)
      }
    }

    setTimeout(poll, 1000)
  }, [poolId])

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-6'>
      <div className='animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-[#41334e]' />
      <p className='text-[16px] text-gray-600 font-[500] text-center px-6'>{message}</p>
    </div>
  )
}

export default GiftOrganizerPaymentReturn