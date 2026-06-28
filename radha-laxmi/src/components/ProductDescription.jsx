import React from 'react'

const ProductDescription = () => {
  return (
    <div className='mt-4'>
      <div className='flex bg-gray-200 rounded-t-2xl'>
        <button className='text-[14px] font-[500] border-b-2 border-[#41334e] p-3 w-32'>Descripition</button>
      </div>
      <hr className='h-[5px] w-full text-slate-900/20'/>

      <div className='flex flex-col gap-5 p-3'>
        <div>
          <h2 className='text-[20px] md:text-[14px] font-bold mb-2'>Detail</h2>
          <p className='text-sm'>Elegant and timeless, these bangles add a touch of grace to every outfit. Crafted with fine detailing and a comfortable fit, they are perfect for daily wear or special occasions.</p>
          <p className='text-sm'>Their versatile design complements both traditional and modern styles, making them a must-have accessory for every jewelry collection.</p>
        </div>

        <div>
          <h3 className='text-[20px] md:text-[14px] font-bold mb-2'>Benefit</h3>

          <ul className='list-disc pl-5 text-sm text-gray-30 flex flex-col gap-2'>
            <li>High-quality materials ensure long-lasting durability and comfort.</li>
            <li>Designed to meet the needs of modern, active lifestyles.</li>
            <li>Available in a wide range of colors and trendy colors.</li>
          </ul>
        </div>

      </div>

    </div>
  )
}

export default ProductDescription