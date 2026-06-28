import React, { useState } from 'react'
import { assets } from '../../assets/data'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const AddProduct = () => {
  const {axios, getToken} = useAppContext()
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
  })

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    popular: false,
  })

  const [sizePrices, setSizePrices] = useState([])
  const [newSize, setNewSize] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [loading, setLoading] = useState(false);
  const allCategories = ["Glass Bangle", "Kada Bangle", "Multi Set"]

  const allTypes = [
    "Bridal",
    "Casual",
    "Daily Wear",
    "Designer",
    "Ethnic",
    "Festive",
    "Party Wear",
    "Traditional",
  ]

  const addSizePrice = ()=>{
    if(!newSize || !newPrice){
      toast.error("plz enter Size & Price")
      return
    }
    if(sizePrices.some((sp) => sp.size === newSize)){
      toast.error("size Already Exists")
      return
    }
    setSizePrices([...sizePrices, {size: newSize, price: parseFloat(newPrice)}])
    setNewSize("")
    setNewPrice("")
  }

  const removeSizePrice = (size)=>{
    setSizePrices(sizePrices.filter((sp)=> sp.size !== size))
  }

  const onSubmitHandle = async (event) => {
    event.preventDefault()

    if(!inputs.title || 
      !inputs.description || 
      !inputs.category || 
      !inputs.type
    ){
      toast.error("Please fill all required fields")
      return;
    }

    if(sizePrices.length === 0){
      toast.error("Please add at least one size and price")
      return;
    }

    const hasImage = Object.values(images).some((img)=> img !== null)
    if(!hasImage){
      toast.error("Please upload at least one image")
      return;
    }

    setLoading(true)

    try {
      const token = await getToken()
      if (!token) {
        toast.error("Not authenticated. Please sign in again.")
        return;
      }

      const formData = new FormData()

      const prices = {};
      const sizes = []
      sizePrices.forEach((sp)=>{
        prices[sp.size] = sp.price
        sizes.push(sp.size)
      })

      const productData = {
        title: inputs.title,
        description: inputs.description,
        category: inputs.category,
        type: inputs.type,
        price: prices,
        sizes: sizes,
        popular: inputs.popular
      }

      formData.append("productData", JSON.stringify(productData))

      Object.keys(images).forEach((key)=>{
        if(images[key]){
          formData.append("images", images[key])
        }
      })

      const {data} = await axios.post("/api/products", formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if(data.success){
        toast.success(data.message)

        setInputs({
          title: "",
          description: "",
          category: "",
          type: "",
          popular: false,
        })
        setSizePrices([])
        setImages({
          1: null,
          2: null,
          3: null
        })

      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      console.error("AddProduct error:", error)
      toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className='m-8'>
      <form onSubmit={onSubmitHandle}>
        <div className='w-full'>
          <h5 className='text-[14px] md:text-[16px] font-bold'>Product name</h5>
          <input onChange={(e)=>setInputs({...inputs, title: e.target.value})} value={inputs.title} type="text" placeholder='Type Here' className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded-lg bg-white text-gray-600 mt-1 w-full text-[14px] font-[500]'/>
        </div>

        <div className='w-full'>
          <h5 className='text-[14px] md:text-[16px] font-bold'>Product Description</h5>
          <textarea onChange={(e)=>setInputs({...inputs, description: e.target.value})} value={inputs.description} type="text" placeholder='Type Here' className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded-lg bg-white text-gray-600 mt-1 w-full text-[14px] font-[500]'/>
        </div>

        <div className='flex gap-4 flex-wrap'>
          <div>
            <h5 className='text-[14px] md:text-[16px] font-bold'>Category</h5>
            <select onChange={(e)=>setInputs({...inputs, category: e.target.value})} value={inputs.category} className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded-lg bg-white text-gray-600 mt-1 w-38 text-[14px] font-[500]'>
              <option value="">
                Select category
              </option>
              {allCategories.map((cat, index)=>(
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <h5 className='text-[14px] md:text-[16px] font-bold'>Types</h5>
            <select onChange={(e)=>setInputs({...inputs, type: e.target.value})} value={inputs.type} className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded-lg bg-white text-gray-600 mt-1 w-38 text-[14px] font-[500]'>
              <option value="">
                Select Types
              </option>
              {allTypes.map((t, index)=>(
                <option key={index} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Size and prices */}
        <div className='w-full mt-4'>
          <h5 className='text-[14px] md:text-[16px] font-[500]'>Sizes and Prices</h5>
          <div className='flex gap-4 mt-2'>
            <input onChange={(e) =>
              setNewSize(e.target.value)} value={newSize} type="text" placeholder='Size...' className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded-lg bg-white text-gray-600 mt-1 w-32 text-[14px] font-[500]'/>

            <input onChange={(e) =>
              setNewPrice(e.target.value)} value={newPrice} type="number" placeholder='Prices' className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded-lg bg-white text-gray-600 mt-1 w-32 text-[14px] font-[500]'/>

            <button type='button' onClick={addSizePrice} className='bg-gray-800/80 font-semibold p-1.5 rounded-lg text-white'>Add</button>
          </div>

          <div className='mt-2'>
            {sizePrices.map((sp, index)=>(
              <div key={index}>
                <span>{sp.size}: ${sp.price}</span>
                <button type='button' onClick={()=> removeSizePrice(sp.size)}className='text-red-500'>Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className='flex gap-2 mt-2'>
          {Object.keys(images).map((key)=>(
            <label key={key} htmlFor={`productImages${key}`} className='ring-1 ring-slate-900/10 overflow-hidden rounded-lg'>
              <input onChange={(e)=>setImages({...images, [key]: e.target.files[0]})} type="file" accept='image/*' id={`productImages${key}`} hidden/>
              <div className='h-16 w-22 bg-white flex items justify-center'>
                <img src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadIcon} alt="" className='w-17 overflow-hidden object-contain'/>
              </div>
            </label>
          ))}
        </div>

        <div className='flex gap-2 mt-3'>
          <h5 className='text-[14px] md:text-[16px] font-[500]'>Add to Popular</h5>
          <input type="checkbox" checked={inputs.popular} onChange={(e)=> setInputs({...inputs, popular: e.target.checked})} className='bg-white rounded-xl'/>
        </div>

        <button type='submit' disabled={loading} className='bg-gray-800/80 font-semibold mt-3 p-2 max-w-36 sm:w-full rounded-xl text-white'>{loading ? "Adding" : "Add Product"}</button>
      </form>
    </div>
  )
}

export default AddProduct