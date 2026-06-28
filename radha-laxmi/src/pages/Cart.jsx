import React, { useEffect, useState } from 'react'
import CartTotal from '../components/CartTotal'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/data'

const Cart = () => {
  const {navigate, product, currency, cartItems, updateQuantity, getcartAmount} = useAppContext();
  const [cartData, setcartdata] = useState([])

  useEffect(() => {
    if(product.length > 0){
      const tempData = [];
      for(const itemId in cartItems){
        for(const size in cartItems[itemId]){
          if(cartItems[itemId][size] > 0){
            tempData.push({
              _id: itemId,
              size: size
            })
          }
        }
      }
      setcartdata(tempData);
    }
  }, [product, cartItems]);

  const increment = (id, size) => {
    const currentQuantity = cartItems[id][size]
    updateQuantity(id, size, currentQuantity+1)
  };
  const decrement = (id, size) => {
    const currentQuantity = cartItems[id][size]
    if(currentQuantity > 1){
      updateQuantity(id, size, currentQuantity-1)
    }
  };

  return product && cartItems ? (
    <div className='mx-auto max-w-[1440px] px-4 lg:px-12 py-16 pt-28 bg-gray-200'>
      <div className='flex flex-col xl:flex-row gap-20 xl:gap-28'>
        {/* leftside */}
        <div className='flex flex-[2] flex-col gap-3 text-[95%]'>
            <div className='pb-10'>
              <h3 className='font-bold h3 capitalize text-3xl'>Cart 
                  <span className='font-light text-[#41334e]'> Overview</span>
              </h3>

              <div className='w-24 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] to-[#DD99FF]'/>
            </div>

            <div className='grid grid-cols-[6fr_2fr_1fr] font-medium bg-white p-2 rounded-2xl'>
              <h5 className='text-[14px] md:text-[16px] font-bold text-left'>Product Details</h5>
              <h5 className='text-[14px] md:text-[16px] font-bold text-center'>SubTotal</h5>
              <h5 className='text-[14px] md:text-[16px] font-bold text-center'>Action</h5>
            </div>

            {cartData.map((item, i)=>{
              const productdata = product.find((p)=>p._id === item._id)
              const quantity = cartItems[item._id]?.[item.size]

              if (!productdata || !quantity) return null;

              return (
                <div key={i} className='grid grid-cols-[6fr_2fr_1fr] items-center bg-white p-2 rounded-2xl'>
                  <div className='flex items-center md:gap-6 gap-3'>
                    <div className='flex bg-gray-200 rounded-2xl'>
                      <img src={productdata.images[0]} alt="" className='w-20'/>
                    </div>
                    <div>
                      <h1 className='hidden sm:block text-[14px] md:text-[16px] font-bold line-clamp-1'>{productdata.title}</h1>
                      <div className='bold-14 not-first:flex items-center justify-start gap-2 mb-1'>Size: <p>{item.size}</p></div>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center ring-1 ring-slate-900/15 rounded-full overflow-hidden bg-gray-200 p-1 gap-2'>
                          <button onClick={()=> decrement(item._id, item.size)} className='p-1.5 bg-gray-500 text-white rounded-full shadow-md cursor-pointer'><img src={assets.minus} alt="" width={11} className='invert'/></button>

                          <p className='px-2'>
                            {quantity}
                          </p>

                          <button onClick={()=> increment(item._id, item.size)} className='p-1.5 bg-gray-500 text-white rounded-full shadow-md cursor-pointer'><img src={assets.plus} alt="" width={11} className='invert'/></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='text-center bold-16'>
                    {currency}{productdata.price[item.size] * quantity}.00
                  </div>

                  <button onClick={()=> updateQuantity(item._id, item.size, 0)} className='cursor-pointer mx-auto'><img src={assets.cartRemove} alt="" width={22}/></button>


                </div>
              )
            })} 
        </div>

        {/* rightside */}
        <div className='flex flex-1 flex-col'>
          <div className='max-w-[379px] w-full bg-white p-5 py-10 max-md:mt-16 rounded-xl'>
            <CartTotal/>
          </div>
        </div>

      </div>

    </div>
  ):null
}
export default Cart