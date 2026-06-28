import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import ProductDescription from '../components/ProductDescription'
import ProductFeatures from '../components/ProductFeatures'
import RelatedProduct from '../components/RelatedProduct'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/data'

const ProductDetails = () => {

    const{product, currency, addToCart} = useAppContext()
    const [image, setimage] = useState(null)
    const {productId} = useParams()
    const products = product?.find((item)=> item._id === productId)
    const [size, setSize] = useState(null)

    useEffect(() =>{
      if(products){
        setimage(products.images[0])
        setSize(products.sizes[0])
      }
    },[products])

  return (
    products && (
      <div className='mx-auto max-w-[1440px] px-4 lg:px-12 pt-20'>

        <div className='flex gap-10 flex-col xl:flex-row mt-3 m-6'>

          <div className='flex flex-1 gap-x-2 max-w-[533px]'>
            <div className='flex items-center flex-col gap-2 flex-wrap'>
              {products.images.map((item, i)=>(
               <div key={i} className='bg-gray-100 rounded-xl'>
                <img onClick={()=>setimage(item)} src={item} alt="productimage" className='w-20 h-20 object-cover aspect-square'/>
               </div>
              ))}
            </div>

            <div className='flex flex-[4] bg-gray-100 rounded-2xl p-5'>
             <img src={image} alt="" className='object-cover rounded-2xl'/>
            </div>
          </div>

          {/* product info */}
          <div className='flex-1 px-5 py-3 bg-gray-200 rounded-2xl'>

              <h2 className='leading-none font-bold text-2xl'>{products.title}</h2>
          
            <div className='text-[17px] md:text-[19px] font-bold flex items-baseline gap-4 my-2'>
                <h3 classname='text-[24px] md:text-[28px] text-2xl font-bold text-[#41334e]'>{currency}{products.price[size]}.00</h3>
            </div>

            <p className='max-w-[555px]'>{products.description}</p>

            <div className='flex flex-col gap-4 my-4 mb-5'>
              <div className='flex gap-2'>
                {[...products.sizes].map((item,i)=>(
                  <button key={i} onClick={()=>setSize(item)}
                   className={`${item === size ? "bg-gray-300" : "bg-white"} text-[14px] font-[500] h-8 w-16 ring-1 ring-slate-900/10 rounded-lg cursor-pointer`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className='flex items-center gap-x-4'>
              <button onClick={()=>addToCart(products._id, size)} className='text-[14px] font-[500] bg-black/80 text-white px-7 py-3 rounded-full cursor-pointer sm:w-1/2 flex items-center justify-center gap-x-2 capitalize'>
              Add To Cart
              <img src={assets.cartAdd} alt="" width={20}/>
              </button>
              <button className='text-[14px] font-[500] ring-1 ring-slate-900/10 bg-white px-7 py-3 rounded-full cursor-pointer'>
                <img src={assets.heartAdd} alt="#" width={20}/>
              </button>
            </div>

            <div className='flex items-center gap-x-2 mt-3'>
              <img src={assets.delivery} alt="" width={18}/>
              <span className='text-[14px] font-[500]'>Free Delivery on order above ₹2000/-</span>
            </div>

            <hr className='my-3 w-2/3'/>
            <div classname='mt-2 flex flex-col gap-1 text-gray-50 text-[14px]'>
              <p>Authenticy You Can Trust</p>
              <p>Enjoy Cash on Delivery for Your Convenience</p>
              <p>Easy Returns and Exchanges Within 7 Days</p>
            </div>
          </div>

        </div>

        <ProductDescription />
        <ProductFeatures />
        <RelatedProduct products={products} productId={productId}/>
      </div>
    )
  )
}

export default ProductDetails