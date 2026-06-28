import React, {useContext, useEffect, useState} from 'react'
import CartTotal from '../components/CartTotal'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const AddressForm = () => {
  const {navigate, user, method, setMethod, axios, getToken} = useAppContext()
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((data) => ({
      ...data,
      [name]: value
    }))
  }

  const onSubmitHandler = async(e)=>{
    e.preventDefault()
    try {
      const token = await getToken();

      if (!token) return;

      const { data } = await axios.post('/api/addresses/add', {address}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        toast.success(data.message);
        navigate('/cart')
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(!user){
      navigate('/cart')
    }
  }, [])

  return (
    <div className='mx-auto max-w-[1440px] px-4 lg:px-12'>
        {/* Container */}
      <div className='flex flex-col xl:flex-row xl:items-center gap-20 xl:gap-28'>
        {/* Left Side */}
        <form onSubmit={onSubmitHandler} className='flex flex-[2] flex-col gap-3 text-[95%]'>
          <div className='pb-10'>
            <h3 className='font-bold h3 capitalize text-3xl'>Delivery 
                <span className='font-light text-[#41334e]'> Information</span>
            </h3>

            <div className='w-60 h-[3px] rounded-full bg-gradient-to-r from-[#41334e]'/>
          </div>

          <div className='flex gap-5'>
            <input value={address.firstName} onChange={handleChange} type="text" name='firstName' placeholder='First Name' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2'/>

            <input value={address.lastName} onChange={handleChange} type="text" name='lastName' placeholder='Last Name' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2'/>
          </div>

          <input value={address.email} onChange={handleChange} type="text" name='email' placeholder='Enter E-Mail' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none'/>

          <input value={address.phone} onChange={handleChange} type="text" name='phone' placeholder='Enter Phone No.' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none'/>

          <input value={address.street} onChange={handleChange} type="text" name='street' placeholder='Enter Street.' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none'/>

          <div className='flex gap-2'>
            <input value={address.city} onChange={handleChange} type="text" name='city' placeholder='Enter City' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2'/>

            <input value={address.state} onChange={handleChange} type="text" name='state' placeholder='Enter State' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2'/>
          </div>

           <div className='flex gap-2'>
            <input value={address.zipcode} onChange={handleChange} type="text" name='zipcode' placeholder='Enter ZipCode' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2'/>

            <input value={address.country} onChange={handleChange} type="text" name='country' placeholder='Enter Country' className='ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2'/>
          </div>

          <button type='submit' className='text-[14px] font-[500] bg-black text-white px-7 py-3 rounded-md transition-all duration-300 cursor-pointer mt-5 hover:bg-gray-900/70 w-1/2'>
            Add Address
          </button>
        </form>
        {/* Right Side */}

        <div className='flex flex-1 flex-col p-10'>
          <div className='max-w-[379px] w-full bg-white p-5 py-10 max-md:mt-16 rounded-xl'>
            <CartTotal/>
          </div>
        </div>
      
      </div>
    </div>
  )
}

export default AddressForm