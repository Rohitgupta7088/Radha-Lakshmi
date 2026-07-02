import React from 'react'
import {assets} from'../assets/data'

const ProductFeatures = () => {
  return (
    <div className='mt-12 bg-gray-200 rounded-2xl'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 rounded-xl p-5'>

        <div className='flex items-center justify-center gap-x-4 p-2 rounded-3xl'>
          <div><img src={assets.Broken} alt="" width={300} className='mb-3'/></div>
          <div>
            <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>Disclaimer Of Liability</h4>
            <p>Glass Bangles is not responsible for any damage, breakage,
            or flaws that occur to the glass bangles during
            transit/shipping or after delivery. Customers acccept
            all risks associated with purchasing and handling
            these fragile glass prtxiucts.</p>
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4 p-2 rounded-3xl'>
          <div><img src={assets.noReturn} alt="" width={200} className='mb-3'/></div>
          <div>
            <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>No Return Policy</h4>
            <p>Due to the breakable nature
            of glass, absolutely NO RETURNS OF EXCHANGES
            will accepted under any circumstances Once the
            order has been processed and shipped. All sales of
            glass bangles are final.</p>
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4 p-2 rounded-3xl'>
          <div><img src={assets.cancel} alt="" width={200} className='mb-3'/></div>
          <div>
            <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>24-Hour Order Cancellation Policy</h4>
            <p>Orders may only be canceled within 24 hours of purchase. After 24 hours, your order cannot be altered, canceled, or refunded. All sales are final after this period.</p>
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4 p-2 rounded-3xl'>
          <div><img src={assets.returnRequest} alt="" width={100} className='mb-3'/></div>
          <div>
            <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>Easy Exchange with Wrong Product with in 24 hr</h4>
            <p>The wrong size was delivered (different from what was ordered). Hassle-free exchanges with quick processing, ensuring a smooth, customer-friendly experience every time.</p>
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4 p-2 rounded-3xl'>
          <div><img src={assets.secure} alt="" width={100} className='mb-3 text-blue-500'/></div>
          <div>
            <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>Secure Payment</h4>
            <p>Safe and secure payments with trusted methods, ensuring your transactions are protected and worry-free always.</p>
          </div>
        </div>

        <div className='flex items-center justify-center gap-x-4 p-2 rounded-3xl'>
          <div><img src={assets.delivery} alt="" width={100} className='mb-3'/></div>
          <div>
            <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>Fast Delivery</h4>
            <p>Quick and reliable delivery ensures your order reaches you fast, fresh, and right on time.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductFeatures