import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { useAppContext } from '../context/AppContext';
import Items from './Items'

const RelatedProduct = ({products, productId}) => {

const {product} = useAppContext()
const [relatedProduct, setrelatedProduct] = useState([])

useEffect(() => {
  if(product.length > 0){
    let productCopy = product.slice()
    productCopy = productCopy.filter((item)=> item.category === products.category && productId !== item._id);
    setrelatedProduct(productCopy.slice(0,6));
  }
},[product])

  return (
    <section className='mx-auto max-w-[1440px] px-4 lg:px-12 mt-28 mb-20'>
      <div className='pb-10'>
        <h3 className='font-bold h3 capitalize text-3xl'>Related 
            <span className='font-light text-[#41334e]'> Products</span>
        </h3>

        <div className='w-24 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] to-[#DD9FF]'/>
        <p className='max-w-lg mt-2'>Discover cosmetic bangles that enhance, deliver radiance and bring confidence to your daily routine</p>
      </div>

      {/* container */}
      {
        <Swiper
        spaceBetween={30}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          555: {
            slidesPerView: 1
          },
          600: {
            slidesPerView: 2
          },
          1022: {
            slidesPerView: 3
          },
          1350: {
            slidesPerView: 4
          },
        }}
        modules={[Autoplay]}
        className="min-h-[400px]"
      >
      {relatedProduct.map((product) =>(
        <SwiperSlide key={product._id}>
          <Items product={product}/>
        </SwiperSlide>
      ))
      }
      </Swiper>
      }
    </section>
  )
}

export default RelatedProduct