import React, { useState } from 'react'
import { useAppContext} from '../context/AppContext'

const Items = ({product}) => {
  const {navigate, currency} = useAppContext()
  const [hovered, sethovered] = useState(false)
  const [size, setsize] = useState(product.sizes[0])

  const colors = ["#f2f2f2", "#f6f9f6", "#f6f8fe"]
  const bgcolor = colors[(parseInt(product._id?.slice(-4) || "0",16))%colors.length]
  return (
    <div>
       <div className='over-flow-hidden flex flex-col gap-5'>
      {/* images */}
          <div 
          onMouseEnter={() => sethovered(true)}
          onMouseLeave={() => sethovered(false)}
          className='h-[200px] flex items-center justify-center w-full transition-all duration-300 rounded-xl group relative bg-gray-100'
          // style={{backgroundColor: bgcolor}}
          >
            <img 
            src={
              product.images.length > 1 && hovered ? product.images[0] : product.images[0]
            }
             alt="" 
             height={150} 
             width={150}
             />

             <div className='absolute bottom-1 left-1 right-1 hidden group-hover:block'>
                <button onClick={() => {
                  navigate(`/collection/${product._id}`);
                  scrollTo(0,0);
                }}
                className = 'text-[14px] font-[500] bg-[#41334e] text-white px-7 rounded-full transition-all cursor-pointer !py-2  w-full !text-xs'
                >
                  Quick View
                </button>
             </div>
             <p className='absolute top-2 right-2 ring-slate-900/10 px-5 bg-white rounded-full'>{product.type}</p>
          </div>

          {/* Info */}
          <div className='pt-3 p-1 flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
                <h3 className='font-bold uppercase line-clanp-1'>{product.title}</h3>
                <p className='font-semibold'>{currency}{product.price[size]}.00</p>
            </div>
            <p>{product.description}</p>

          </div>
      </div>
    </div>
  )
}

export default Items