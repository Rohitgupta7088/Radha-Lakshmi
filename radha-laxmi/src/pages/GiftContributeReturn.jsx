import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const GiftContributeReturn = () => {
  const { poolId } = useParams()
  const [searchParams] = useSearchParams()
  const { navigate, axios } = useAppContext()
  const [message, setMessage] = useState('Verifying your payment...')
  const cashfreeOrderId = searchParams.get('cid')

  useEffect(() => {
    if (!poolId || !cashfreeOrderId) {
      setMessage('Invalid return URL. Redirecting...')
      setTimeout(() => navigate(`/gift/${poolId || ''}`), 2000)
      return
    }

    let attempts = 0
    const maxAttempts = 10

    const poll = async () => {
      try {
        attempts++
        const { data } = await axios.post(`/api/gift/${poolId}/contribute/verify`, { cashfreeOrderId })

        if (data.success && data.isPaid) {
          setMessage('Thank you! Your contribution has been added. Redirecting to your orders...')
          setTimeout(() => navigate('/my-orders'), 1500)   // <-- changed
        }
        else if (data.status === 'pending' && attempts < maxAttempts) {
          setTimeout(poll, 1000)
        }
        else if (!data.success || (!data.isPaid && attempts >= maxAttempts)) {
          setMessage('Payment failed or was cancelled. Redirecting...')
          setTimeout(() => navigate(`/gift/${poolId}`), 2500)
        }
      } catch (error) {
        setMessage('Something went wrong verifying payment. Redirecting...')
        setTimeout(() => navigate(`/gift/${poolId}`), 2500)
      }
    }

    setTimeout(poll, 1000)
  }, [poolId, cashfreeOrderId])

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-6'>
      <div className='animate-spin rounded-full h-20 w-20 border-4 border-gray-300 border-t-[#41334e]' />
      <p className='text-[16px] text-gray-600 font-[500] text-center px-6'>{message}</p>
    </div>
  )
}

export default GiftContributeReturn