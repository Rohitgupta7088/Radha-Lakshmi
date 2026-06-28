import React from 'react'
import {assets} from'../assets/data'

const ProductFeatures = () => {
  return (
    <div className='mt-12 bg-gray-200 rounded-2xl'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 rounded-xl p-5'>

        <div className='flex items-center justify-center gap-x-4 p-2 rounded-3xl'>
          <div><img src={assets.returnRequest} alt="" width={100} className='mb-3'/></div>
          <div>
            <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>Easy return</h4>
            <p>Hassle-free returns with quick processing, ensuring a smooth, customer-friendly experience every time</p>
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