import React from 'react'
import { blogs } from '../assets/data'

const Blog = () => {
  return (
    <div className='bg-gray-200 pt-28 pb-28'>
        <div className='mx-auto max-w-[1440px] px-4 lg:px-12'>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 gap-y-12'>
                {blogs.map((blog, index)=>(
                    <div key={index} className='relative'>
                        <div className='p-4 rounded-2xl'>
                            <img src={blog.image} alt="" className='shadow-xl shadow-slate-900/20 rounded-xl'/>
                        </div>
                        <p className='text-[14px] font-[500]'>{blog.category}</p>
                        <h5 className='text-[14px] md:text-[16px] font-bold pr-5 mb-1 line-clamp-2'>{blog.title}</h5>
                        <p>{blog.description}</p>
                    </div>
                ))}

            </div>
        </div>
    </div>
  )
}

export default Blog