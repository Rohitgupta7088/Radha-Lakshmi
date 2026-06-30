// import React, { useEffect, useState } from 'react'
// import toast from 'react-hot-toast'
// import AddressForm from '../pages/AddressForm'
// import { useAppContext } from '../context/AppContext'

// const CartTotal = () => {
//   const { navigate, user, product, currency, cartItems, setcartItems, method, setMethod, delivery_charges, getCartCount, getcartAmount, axios, getToken } = useAppContext();

//   const [addresses, setAddresses] = useState([])
//   const [showAddress, setShowAddresses] = useState(false)
//   const [selectedAddress, setSelectAddress] = useState(null)

//   const getAddress = async () => {
//     try {
//       const token = await getToken();

//       if (!token) return;

//       const { data } = await axios.get('/api/addresses', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })

//       if (data.success) {
//         setAddresses(data.addresses)
//         if(data.addresses.length > 0){
//           setSelectAddress(data.addresses[0])
//         }
//       }
//       else{
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   const placeOrder = async ()=>{
//     try {
//       if(!selectedAddress){
//         return toast.error("please Select an Address")
//       }

//       let orderItems = []

//       for(const itemId in cartItems){
//         for(const size in cartItems[itemId]){
//           if(cartItems[itemId][size] > 0){
//             const itemInfo = structuredClone(product.find(products=>products._id === itemId))

//             if(itemInfo){
//               itemInfo.size = size;
//               itemInfo.quantity = cartItems[itemId][size]
//               orderItems.push(itemInfo)
//             }
//           }
//         }
//       }

//       let items = orderItems.map((item)=>({
//         products: item._id,
//         quantity: item.quantity,
//         size: item.size,
//       }))

//       if( method === "COD"){
//         const {data} = await axios.post("/api/orders/cod", {items, address: selectedAddress._id}, {
//           headers: {
//             Authorization: `Bearer ${await getToken()}`
//           },
//         });

//         if(data.success){
//           toast.success(data.message)
//           setcartItems({})
//           navigate('/my-orders')
//         }
//         else{
//           toast.error(data.message)
//         }
//       }
//       else{
//         const {data} = await axios.post("/api/orders/stripe", {items, address: selectedAddress._id}, {
//           headers: {
//             Authorization: `Bearer ${await getToken()}`
//           },
//         });

//         if(data.success){
//           window.location.replace(data.url);
//         }
//         else{
//           toast.error(data.message)
//         }
//       }
      
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   useEffect(()=>{
//     if(user){
//       getAddress()
//     }
//   }, [user])

//   return (
//     <div>
//       <h3 className='text-[22px] font-[700]'>Order Details <span className='text-[24px] font-[700]'>({getCartCount ? getCartCount() : 0}) Items</span></h3>
//       <hr className='border-gray-500 my-3'></hr>

//       {/* Payment & Address */}

//       <div className='mb-5'>
//         <div className='my-5'>
//           <h4 className='text-[17px] md:text-[19px] font-bold mb-5'>Where to ship your order</h4>
//           <div className='relative flex justify-between items-start mt-2'>
//             <p>{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
//               : "No Address Found"}</p>

//             <button onClick={() => setShowAddresses(!showAddress)} className='text-gray-800 hover:underline cursor-pointer text-[14px] font-[700]'>Change</button>
//             {showAddress && (
//               <div className='absolute top-10 py-1 bg-white ring-1 ring-slate-900/60 text-sm w-full'>
//                 {addresses.map((address, index) => (
//                   <p key={index} onClick={() => { setSelectAddress(address); setShowAddresses(false) }} className='p-2 cursor-pointer hover:bg-gray-100 text-[14px] font-[500]'>
//                     {address.street}, {address.city}, {address.state}, {" "}
//                     {address.country}
//                   </p>
//                 ))}
//                 <p onClick={() => { navigate('/AddressForm'); scrollTo(0, 0) }} className='p-2 text-center cursor-pointer hover:bg-[#000000e3] hover:text-white'>Add Address</p>
//               </div>
//             )}
//           </div>
//         </div>
//         <hr className='border-gray-500 mt-3' />

//         <div className='my-6'>
//           <h4 className='text-[17px] md:text-[19px] font-bold mb-5'>Payment Method</h4>

//           <div className='flex gap-3'>
//             <div onClick={() => setMethod("COD")} className={`${method === "COD" ? "text-[14px] font-[500] bg-gray-500  text-white px-7 py-3 rounded-full transition-all" : "text-[14px] font-[500] ring-1 ring-slate-900/10 px-7 py-3 rounded-full hover:bg-primary transition-all duration-300"} !py-1 text-xs cursor-pointer`}>
//               Cash On Delivery
//             </div>
//             <div onClick={() => setMethod("stripe")} className={`${method === "stripe" ? "text-[14px] font-[500] bg-gray-500  text-white px-7 py-3 rounded-full transition-all" : "text-[14px] font-[500] ring-1 ring-slate-900/10 px-7 py-3 rounded-full hover:bg-primary transition-all duration-300"} !py-1 text-xs cursor-pointer`}>
//               Stripe
//             </div>
//           </div>

//         </div>

//         <hr className="border-gray-500 mt-3" />
//       </div>

//       <div className='mt-4 space-y-2'>
//         <div className='flex justify-between'>
//           <h5 className='text-[14px] md:text-[16px] font-bold'>Price</h5>
//           <p className='font-bold'>{currency}{getcartAmount ? getcartAmount() : 0}.00</p>
//         </div>

//         <div className='flex justify-between'>
//           <h5 className='text-[14px] md:text-[16px] font-bold'>Shipping Fee</h5>
//           <p className='font-bold'>{currency}{getcartAmount() === 0 ? "0.00" : `${delivery_charges}.00`}</p>
//         </div>

//         <div className='flex justify-between'>
//           <h5 className='text-[14px] md:text-[16px] font-bold'>Tax (2%)</h5>
//           <p className='font-bold'>{currency}
//             {getcartAmount ? (getcartAmount() * 2) / 100 : 0}</p>
//         </div>

//         <div className='flex justify-between text-lg font-medium mt-3'>
//           <h5 className='text-[14px] md:text-[16px] font-bold'>Total Amount</h5>
//           <p className='font-bold'>{currency}{getcartAmount() === 0 ? "0.00" : (getcartAmount() + delivery_charges + (getcartAmount() * 2) / 100).toFixed(2)}
//           </p>
//         </div>
//       </div>

//       <button onClick={placeOrder} className='text-[14px] font-[500] bg-black/80 text-white px-7 py-3 rounded-md cursor-pointer w-full mt-8'>
//         Proceed to Order
//       </button>

//     </div>
//   )
// }

// export default CartTotal;




import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AddressForm from '../pages/AddressForm'
import { useAppContext } from '../context/AppContext'

const CartTotal = () => {
  const { navigate, user, product, currency, cartItems, setcartItems, method, setMethod, delivery_charges, getCartCount, getcartAmount, axios, getToken } = useAppContext();

  const [addresses, setAddresses] = useState([])
  const [showAddress, setShowAddresses] = useState(false)
  const [selectedAddress, setSelectAddress] = useState(null)

  const getAddress = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const { data } = await axios.get('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setAddresses(data.addresses)
        if(data.addresses.length > 0){
          setSelectAddress(data.addresses[0])
        }
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const buildItems = () => {
    let orderItems = []
    for(const itemId in cartItems){
      for(const size in cartItems[itemId]){
        if(cartItems[itemId][size] > 0){
          const itemInfo = structuredClone(product.find(products=>products._id === itemId))
          if(itemInfo){
            itemInfo.size = size;
            itemInfo.quantity = cartItems[itemId][size]
            orderItems.push(itemInfo)
          }
        }
      }
    }
    return orderItems.map((item)=>({
      products: item._id,
      quantity: item.quantity,
      size: item.size,
    }))
  }

  const placeOrder = async ()=>{
    try {
      if(!selectedAddress){
        return toast.error("please Select an Address")
      }

      const items = buildItems()

      if( method === "COD"){
        const {data} = await axios.post("/api/orders/cod", {items, address: selectedAddress._id}, {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if(data.success){
          toast.success(data.message)
          setcartItems({})
          navigate('/my-orders')
        }
        else{
          toast.error(data.message)
        }
      }
      else if( method === "upi"){
        const {data} = await axios.post("/api/orders/cashfree", {items, address: selectedAddress._id}, {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });

        if(!data.success){
          return toast.error(data.message)
        }

        // Open Cashfree Drop checkout — shows UPI (QR + ID), Cards, Netbanking etc.
        const cashfree = window.Cashfree({ mode: "sandbox" })
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_self",
        })
      }
      else{
        const {data} = await axios.post("/api/orders/stripe", {items, address: selectedAddress._id}, {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if(data.success){
          window.location.replace(data.url);
        }
        else{
          toast.error(data.message)
        }
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(user){
      getAddress()
    }
  }, [user])

  return (
    <div>
      <h3 className='text-[22px] font-[700]'>Order Details <span className='text-[24px] font-[700]'>({getCartCount ? getCartCount() : 0}) Items</span></h3>
      <hr className='border-gray-500 my-3'></hr>

      {/* Payment & Address */}

      <div className='mb-5'>
        <div className='my-5'>
          <h4 className='text-[17px] md:text-[19px] font-bold mb-5'>Where to ship your order</h4>
          <div className='relative flex justify-between items-start mt-2'>
            <p>{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
              : "No Address Found"}</p>

            <button onClick={() => setShowAddresses(!showAddress)} className='text-gray-800 hover:underline cursor-pointer text-[14px] font-[700]'>Change</button>
            {showAddress && (
              <div className='absolute top-10 py-1 bg-white ring-1 ring-slate-900/60 text-sm w-full'>
                {addresses.map((address, index) => (
                  <p key={index} onClick={() => { setSelectAddress(address); setShowAddresses(false) }} className='p-2 cursor-pointer hover:bg-gray-100 text-[14px] font-[500]'>
                    {address.street}, {address.city}, {address.state}, {" "}
                    {address.country}
                  </p>
                ))}
                <p onClick={() => { navigate('/AddressForm'); scrollTo(0, 0) }} className='p-2 text-center cursor-pointer hover:bg-[#000000e3] hover:text-white'>Add Address</p>
              </div>
            )}
          </div>
        </div>
        <hr className='border-gray-500 mt-3' />

        <div className='my-6'>
          <h4 className='text-[17px] md:text-[19px] font-bold mb-5'>Payment Method</h4>

          <div className='flex gap-3'>
            <div onClick={() => setMethod("COD")} className={`${method === "COD" ? "text-[14px] font-[500] bg-gray-500  text-white px-7 py-3 rounded-full transition-all" : "text-[14px] font-[500] ring-1 ring-slate-900/10 px-7 py-3 rounded-full hover:bg-primary transition-all duration-300"} !py-1 text-xs cursor-pointer`}>
              Cash On Delivery
            </div>
            <div onClick={() => setMethod("stripe")} className={`${method === "stripe" ? "text-[14px] font-[500] bg-gray-500  text-white px-7 py-3 rounded-full transition-all" : "text-[14px] font-[500] ring-1 ring-slate-900/10 px-7 py-3 rounded-full hover:bg-primary transition-all duration-300"} !py-1 text-xs cursor-pointer`}>
              Stripe
            </div>
            <div onClick={() => setMethod("upi")} className={`${method === "upi" ? "text-[14px] font-[500] bg-gray-500  text-white px-7 py-3 rounded-full transition-all" : "text-[14px] font-[500] ring-1 ring-slate-900/10 px-7 py-3 rounded-full hover:bg-primary transition-all duration-300"} !py-1 text-xs cursor-pointer`}>
              UPI Payment
            </div>
          </div>

        </div>

        <hr className="border-gray-500 mt-3" />
      </div>

      <div className='mt-4 space-y-2'>
        <div className='flex justify-between'>
          <h5 className='text-[14px] md:text-[16px] font-bold'>Price</h5>
          <p className='font-bold'>{currency}{getcartAmount ? getcartAmount() : 0}.00</p>
        </div>

        <div className='flex justify-between'>
          <h5 className='text-[14px] md:text-[16px] font-bold'>Shipping Fee</h5>
          <p className='font-bold'>{currency}{getcartAmount() === 0 ? "0.00" : `${delivery_charges}.00`}</p>
        </div>

        <div className='flex justify-between'>
          <h5 className='text-[14px] md:text-[16px] font-bold'>Tax (2%)</h5>
          <p className='font-bold'>{currency}
            {getcartAmount ? (getcartAmount() * 2) / 100 : 0}</p>
        </div>

        <div className='flex justify-between text-lg font-medium mt-3'>
          <h5 className='text-[14px] md:text-[16px] font-bold'>Total Amount</h5>
          <p className='font-bold'>{currency}{getcartAmount() === 0 ? "0.00" : (getcartAmount() + delivery_charges + (getcartAmount() * 2) / 100).toFixed(2)}
          </p>
        </div>
      </div>

      <button onClick={placeOrder} className='text-[14px] font-[500] bg-black/80 text-white px-7 py-3 rounded-md cursor-pointer w-full mt-8'>
        Proceed to Order
      </button>

    </div>
  )
}

export default CartTotal;