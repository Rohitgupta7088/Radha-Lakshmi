import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import Title from './Title'
import { useAppContext } from '../context/AppContext';
import Items from './Items'

const NewArrial = () => {

const {product} = useAppContext()
const [newArrivals, setnewArrivals] = useState([])

useEffect(() => {
  const data = product.filter((items) => items.inStock).slice(0,10)
  setnewArrivals(data)
},[product])

  return (
    <section className='mx-auto max-w-[1440px] px-4 lg:px-12 mt-28'>
      <Title />

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
      {newArrivals.map((product) =>(
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

export default NewArrial