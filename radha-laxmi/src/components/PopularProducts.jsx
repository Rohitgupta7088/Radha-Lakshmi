import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import Items from './Items'

const PopularProducts = () => {

  const [popularProduct, setpopularProduct] = useState([]);
  const {product} = useAppContext();

  useEffect(()=>{
    const data = product.filter((items)=> items.popular && items.inStock)
    setpopularProduct(data.slice(0,4))
  },[product]);

  return (
    <section className='mx-auto max-w-[1440px] px-4 lg:px-12 mt-28'>
        <div>
          <h3 className='font-bold h3 capitalize text-3xl'>Popular
            <span className='font-light text-[#41334e]'> Products</span>
        </h3>

        <div className='w-50 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] to-[#DD9FF]'/>
        <p className='max-w-lg mt-2'>Discover cosmetic bangles that enhance, deliver radiance and bring confidence to your daily routine</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {popularProduct.map((product) =>(
        <div key={product._id}>
          <Items product={product}/>
        </div>
        ))}
        </div>
    </section>
  )
}

export default PopularProducts