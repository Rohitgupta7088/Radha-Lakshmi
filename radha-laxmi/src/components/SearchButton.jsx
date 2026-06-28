import React from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/data'

const SearchButton = () => {

  const {searchQuery, setsearchQuery} = useAppContext()
  return (
    <div className='py-4'>
      <div className='text-cenetr'>
        <div className='inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white ring-1 ring-slate-900/20 w-full'>
          <input type="text" value={searchQuery} onChange={(e) => setsearchQuery(e.target.value)} placeholder='Search Items' className='border-none outline-none w-full text-sm'/>
          <div>
            <img src={assets.search} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchButton