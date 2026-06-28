import React, {useEffect, useMemo, useState} from 'react'
import Items from'../components/Items'
import { useAppContext } from '../context/AppContext'
import SearchButton from '../components/SearchButton'
import {assets} from '../assets/data'

const Collection = () => {
  const {product, searchQuery} = useAppContext();
  const [category, setcategory] = useState([])
  const [type, settype] = useState([])
  const [selectedSort, setselectedSort] = useState("relevant")
  const [filteredProducts, setfilteredProducts] = useState([])
  const [currentPage, setcurrentPage] = useState(1);
  const [availableTypes, setavailableType] = useState([])
  const itemsperPage = 8

  const allCategories = useMemo(() => ["Glass Bangle", "Kada Bangle", "Multi Set"], [])

  const toggleFilter = (value, setState) => {
    setState((prev) => prev.includes(value) ? prev.filter((item) => item !== value): [...prev, value])
  }

  useEffect(() => {
    const selectedCats = category.length > 0 ? category : allCategories;

    const filteredprods = product.filter((p) => selectedCats.includes(p.category));
    const typeSet = new Set(filteredprods.map((p) => p.type));
    const newAvailableTypes = [...typeSet].sort();
    setavailableType(newAvailableTypes)

    settype((prev) => prev.filter((t)=> typeSet.has(t)))
  },[category, product, allCategories])

  const applyFilters = () => {
    let filtered = [...product]
    filtered = filtered.filter(p=>p.inStock !== false)

    if (searchQuery && searchQuery.trim() !== "") {
      filtered = filtered.filter((product) =>
      product.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if(category.length){
      filtered = filtered.filter(product=> category.includes(product.category))
    }

    if(type.length){
      filtered = filtered.filter(product=> type.includes(product.type))
    }

    return filtered;
  }

  const applySorting = (productsList) => {
    switch (selectedSort) {
      case "low":
        return [...productsList].sort((a,b)=> Math.min(...Object.values(a.price)) - Math.min(...Object.values(b.price)))
        break;
      
      case "high":
        return [...productsList].sort((a,b)=> Math.min(...Object.values(b.price)) - Math.min(...Object.values(a.price)))
        break;

      default:
        return productsList
        break;
    }
  }

  useEffect(() => {
    let filtered = applyFilters()
    let sorted = applySorting(filtered)
    setfilteredProducts(sorted)
    setcurrentPage(1)
  },[category, type, selectedSort, product, searchQuery])

  const getPaginatedProducts = () => {
    const startIndex = (currentPage-1) * itemsperPage
    const endIndex = startIndex + itemsperPage
    return filteredProducts.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsperPage)

  return (
    <div className='mx-auto max-w-[1440px] px-4 lg:px-12 mt-20'>
      <div className='flex flex-col sm:flex-row gap-8 mb-16'>
        {/* filter Option */}
        <div className='min-w-72 bg-[#edf5ed]/50 p-4 pl-6 lg:pl-12 rounded-xl'>
          <SearchButton />
          <div className='px-4 py-3 mt-4 bg-white rounded-xl'>
            <h3 className='font-semibold mb-4'>Sort By Price</h3>
            <select onChange={(e) => setselectedSort(e.target.value)} className='border border-slate-900/10 outline-none text-gray-30 medium-14 h-8 w-full px-2 rounded-md'>
              <option value="relevant">Relevant</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className='mt-4 bg-white rounded-xl pl-5 py-5'>
            <h3 className='font-semibold mb-4'>Categories</h3>
            
            <div className='flex flex-col gap-2 text-sm font-light'>
              {allCategories.map((cat) => (
                <label key={cat} className='flex gap-2 text-[14px] font-[400] text-gray-30'>
                  <input onChange={(e) => toggleFilter(e.target.value, setcategory)} type="checkbox" value={cat} checked={category.includes(cat)} className='w-3'/>
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className='pl-5 mt-4 bg-white rounded-xl'>
              <h3 className='mb-4 font-semibold'>Types</h3>
              <div className='flex flex-col gap-2 text-sm font-light'>
                {availableTypes.map((typ) => (
                  <label key={typ} className='flex gap-2 medium-14 text-gray-30'>
                  <input
                    onChange={(e) => toggleFilter(e.target.value, settype)}
                      type='checkbox'
                    value={typ}
                    checked={type.includes(typ)}
                  className='w-3'
                  />
                  {typ}
                </label>
              ))}
              </div>
          </div>
        </div>

        {/* RightSide */}
        <div className='max-sm:px-10 sm:pr-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {getPaginatedProducts().length > 0 ? (getPaginatedProducts().map((product)=>(
                <Items product={product} key={product._id}/>
              ))
              ):(
                <p className='capitalize'>No products found for selected filters</p>
              )}
          </div>
          {/* Pagination */}
          <div className='flex items-center justify-center flex-wrap mt-14 mb-10 gap-4'>
            <button disabled={currentPage === 1} onClick={()=> setcurrentPage((prev)=> prev-1)} className={`bg-[#41334e] !py-1 !px-3 rounded-2xl text-white ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}>
              Previous
            </button>
            {Array.from({length: totalPages}, (_, index)=> (
              <button key={index+1} onClick={()=> setcurrentPage(index+1)} className={`btn-light !py-1 !px-3 ${currentPage === index+1 && "bg-[#000000dc] text-white rounded-full"}`}>{index+1}</button>
            ))}

            <button disabled={currentPage === totalPages} onClick={()=> setcurrentPage((prev)=> prev+1)} className={`bg-[#41334e] !py-1 !px-3 rounded-2xl text-white ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}>
                Next
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Collection