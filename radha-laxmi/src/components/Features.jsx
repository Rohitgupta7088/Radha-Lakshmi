import React from 'react'
import Bangle1 from '../assets/Bangle1.webp'
import Bangle2 from '../assets/Bangle2.jpg'

const Features = () => {
  return (
    <section className='mx-auto max-w-[1440px] px-4 lg:px-12 my-10 xl:my-22'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-6 gap-y-12 items-center rounded-xl'>
            <div><img src={Bangle1} alt="#bangle1" height={77} width={222} className='rounded-full' /></div>

            <div><img src={Bangle2} alt="#bangle2" height={77} width={222} className='rounded-full' /></div>

            <div className='p-4'>
                <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>Quality Product</h4>
                <p>Products crafted with care excellence.</p>
            </div>

            <div className='p-4'>
                <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>Fast Delivery</h4>
                <p>Product will be deliverd as soon as possible.</p>
            </div>

            <div className='p-4'>
                <h4 className='text-[17px] md:text-[19px] font-bold capitalize'>Secure Payment</h4>
                <p>payment with Seccessfully & Safety</p>
            </div>
        </div>
    </section>
  )
}

export default Features