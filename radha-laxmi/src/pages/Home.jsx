import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import NewArrival from '../components/NewArrial'
import PopularProduct from '../components/PopularProducts'
import Textmonials from '../components/Textmonials'

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <NewArrival />
      <PopularProduct />
      <div className="hidden sm:block mx-auto max-w-[1440px] px-4 lg:px-12 mt-28 bg-[url('/src/assets/banner.png')] bg-cover bg-center bg-no-repeat h-[350px]" ></div>
      <Textmonials />
    </>
  )
}

export default Home