// import React, { useState, useMemo, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAppContext } from '../context/AppContext'
// import toast from 'react-hot-toast'

// const OCCASIONS = ['Wedding', 'Birthday', 'Festival', 'Anniversary', 'Baby Shower']
// const allCategories = ['Glass Bangle', 'Kada Bangle', 'Multi Set']

// const CreateGiftPool = () => {
//   const { product: products, currency, axios, getToken, user } = useAppContext()
//   const navigate = useNavigate()

//   // Product selection state
//   const [selectedProducts, setSelectedProducts] = useState([])
//   const [wrapTogether, setWrapTogether] = useState(false)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [category, setCategory] = useState([])

//   // Form state
//   const [form, setForm] = useState({
//     occasion: '',
//     recipientName: '',
//     recipientEmail: '',
//     personalMessage: '',
//     minContribution: '',
//     deadline: '',
//   })
//   const [loading, setLoading] = useState(false)

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   if (!user) { navigate('/'); return null }

//   // Filter products same as Collection page
//   const filteredProducts = useMemo(() => {
//     let list = products.filter(p => p.inStock !== false)
//     if (searchQuery.trim()) {
//       list = list.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
//     }
//     if (category.length) {
//       list = list.filter(p => category.includes(p.category))
//     }
//     return list
//   }, [products, searchQuery, category])


//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

//   const paginatedProducts = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage
//     return filteredProducts.slice(start, start + itemsPerPage)
//   }, [filteredProducts, currentPage])

//   useEffect(() => {
//     setCurrentPage(1)
//   }, [searchQuery, category])

//   const toggleCategory = (cat) => {
//     setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
//   }

//   const isSelected = (productId) => selectedProducts.some(p => p.product._id === productId)

//   const toggleProduct = (product) => {
//     if (isSelected(product._id)) {
//       setSelectedProducts(prev => prev.filter(p => p.product._id !== product._id))
//     } else {
//       const firstSize = Object.keys(product.price || {})[0]
//       setSelectedProducts(prev => [...prev, { product, size: firstSize, quantity: 1 }])
//     }
//   }

//   const updateItem = (productId, field, value) => {
//     setSelectedProducts(prev => prev.map(item =>
//       item.product._id === productId ? { ...item, [field]: value } : item
//     ))
//   }

//   const targetAmount = selectedProducts.reduce((acc, item) => {
//     return acc + (item.product?.price?.[item.size] || 0) * item.quantity
//   }, 0)

//   const handleSubmit = async () => {
//     if (!selectedProducts.length) return toast.error('Select at least one product')
//     if (!form.occasion) return toast.error('Select an occasion')
//     if (!form.recipientName.trim()) return toast.error('Enter recipient name')
//     if (!form.deadline) return toast.error('Set a deadline')
//     if (new Date(form.deadline) <= new Date()) return toast.error('Deadline must be in the future')

//     setLoading(true)
//     try {
//       const { data } = await axios.post('/api/gift/create', {
//         products: selectedProducts.map(item => ({
//           productId: item.product._id,
//           size: item.size,
//           quantity: item.quantity,
//         })),
//         wrapTogether,
//         occasion: form.occasion,
//         recipientName: form.recipientName,
//         recipientEmail: form.recipientEmail,
//         personalMessage: form.personalMessage,
//         minContribution: form.minContribution ? Number(form.minContribution) : 0,
//         deadline: form.deadline,
//       }, {
//         headers: { Authorization: `Bearer ${await getToken()}` }
//       })

//       if (data.success) {
//         toast.success('Gift pool created!')
//         navigate(`/gift/${data.poolId}/status`)
//       } else {
//         toast.error(data.message)
//       }
//     } catch (err) {
//       toast.error('Something went wrong')
//     }
//     setLoading(false)
//   }

 

//   return (
//     <div className='min-h-screen bg-gray-100 pt-28 pb-16 px-4 lg:px-12'>
//       <div className='max-w-[1440px] mx-auto'>

//         <h2 className='text-2xl font-bold text-[#41334e] mb-1'>Create Gift Pool</h2>
//         <div className='w-50 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] mb-8' />

//         <div className='flex flex-col xl:flex-row gap-6 items-stretch'>

//           {/* ── LEFT: Product Selection (Collection style) ── */}
//           <div className='bg-white rounded-2xl p-5 flex-[1.4] flex flex-col'>

//             {/* Search + Filter bar */}
//             <div className='flex flex-wrap gap-3 mb-5 items-center'>
//               <input
//                 type='text' value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 placeholder='Search bangles...'
//                 className='flex-1 min-w-[180px] border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#41334e] bg-white'
//               />
//               <div className='flex gap-2 flex-wrap'>
//                 {allCategories.map(cat => (
//                   <button
//                     key={cat}
//                     onClick={() => toggleCategory(cat)}
//                     className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
//                       category.includes(cat)
//                         ? 'bg-[#41334e] text-white border-[#41334e]'
//                         : 'border-gray-300 text-gray-600 hover:border-[#41334e] bg-white'
//                     }`}
//                   >
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Product Grid — Collection style */}
//             <div className="flex-1 pr-2 min-h-0">
//             {filteredProducts.length === 0 ? (
//               <p className='text-center text-gray-400 py-12'>No products found.</p>
//               ) : (
//               <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
//                 {paginatedProducts.map(product => {
//                   const selected = isSelected(product._id)
//                   const firstSize = Object.keys(product.price || {})[0]
//                   return (
//                     <div
//                       key={product._id}
//                       onClick={() => toggleProduct(product)}
//                       className={`relative overflow-hidden flex flex-col gap-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
//                         selected
//                           ? 'border-[#41334e] shadow-lg shadow-purple-100 scale-[1.02]'
//                           : 'border-transparent hover:border-gray-300'
//                       }`}
//                     >
//                       {/* Product image */}
//                       <div className='h-[100px] flex items-center justify-center rounded-xl bg-gray-100 relative'>
//                         <img src={product.images?.[0]} alt='' height={100} width={100} className='object-contain' />

//                         {/* Type tag */}
//                         <p className='absolute top-2 right-2 text-xs ring-slate-900/10 px-3 bg-white rounded-full py-0.5'>{product.type}</p>

//                         {/* Selected checkmark overlay */}
//                         {selected && (
//                           <div className='absolute inset-0 bg-[#41334e]/10 rounded-xl flex items-center justify-center'>
//                             <div className='w-8 h-8 rounded-full bg-[#41334e] flex items-center justify-center shadow-lg'>
//                               <span className='text-white text-sm font-bold'>✓</span>
//                             </div>
//                           </div>
//                         )}

//                         {/* Select/Deselect button at bottom */}
//                         <div className='absolute bottom-1 left-1 right-1'>
//                           <div className={`text-center py-1.5 rounded-full text-xs font-semibold transition-all ${
//                             selected
//                               ? 'bg-red-500 text-white'
//                               : 'bg-[#41334e] text-white opacity-0 group-hover:opacity-100 block md:hidden md:group-hover:block'
//                           }`}>
//                             {selected ? '✕ Remove' : '+ Add to Gift'}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Info */}
//                       <div className='p-2 flex flex-col gap-1'>
//                         <div className='flex items-center justify-between'>
//                           <h3 className='font-bold uppercase text-xs line-clamp-1 text-gray-800'>{product.title}</h3>
//                           <p className='font-semibold text-xs text-[#41334e] whitespace-nowrap'>₹{product.price?.[firstSize]}</p>
//                         </div>
//                         <p className='text-xs text-gray-400 line-clamp-1'>{product.description}</p>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//             </div>


//             {/* next & previous buttons with page numbers */}
//             <div className="flex items-center justify-center flex-wrap mt-6 gap-3">

//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(prev => prev - 1)}
//                 className={`bg-[#41334e] text-white px-3 py-1 rounded-xl ${
//                 currentPage === 1 && "opacity-50 cursor-not-allowed"
//                 }`}
//                 >
//                 Previous
//               </button>

//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index + 1}
//                   onClick={() => setCurrentPage(index + 1)}
//                   className={`px-3 py-1 rounded-full ${ currentPage === index + 1 ? "bg-[#41334e] text-white": "bg-gray-200"
//                   }`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}

//                 <button
//                     disabled={currentPage === totalPages}
//                     onClick={() => setCurrentPage(prev => prev + 1)}
//                     className={`bg-[#41334e] text-white px-3 py-1 rounded-xl ${
//                         currentPage === totalPages && "opacity-50 cursor-not-allowed"
//                     }`}
//                 >
//                     Next
//                 </button>

//             </div>

//             {/* Selected products summary bar */}
//             {selectedProducts.length >= 0 && (
//               <div className='bg-[#41334e] rounded-2xl p-4 mb-5 mt-5 flex items-center justify-between gap-3'>
                
//                 <div className='flex flex-col gap-5'>
//                   <div className ='text-white/50 font-semibold'> Selected Items</div>
//                   <div className='flex items-center gap-3 flex-wrap'>
                  
//                   {selectedProducts.map(item => (
                    
//                     <div key={item.product._id} className='flex items-center
//                     gap-2 bg-white/20 rounded-xl px-3 py-1.5'>
//                       <img src={item.product.images?.[0]} alt='' className='w-8 h-8 object-contain rounded' />
//                       <div>
//                         <p className='text-xs text-white font-semibold line-clamp-1 max-w-[100px]'>{item.product.title}</p>
//                         <div className='flex gap-1 mt-0.5'>
//                           <select
//                             value={item.size}
//                             onChange={e => updateItem(item.product._id, 'size', e.target.value)}
//                             onClick={e => e.stopPropagation()}
//                             className='text-[10px] rounded px-1 bg-white/80 text-gray-700 focus:outline-none'
//                           >
//                             {Object.keys(item.product.price || {}).map(s => (
//                               <option key={s} value={s}>{s}</option>
//                             ))}
//                           </select>
//                           <select
//                             value={item.quantity}
//                             onChange={e => updateItem(item.product._id, 'quantity', Number(e.target.value))}
//                             onClick={e => e.stopPropagation()}
//                             className='text-[10px] rounded px-1 bg-white/80 text-gray-700 focus:outline-none'
//                           >
//                             {[1,2,3,4,5].map(n => <option key={n} value={n}>×{n}</option>)}
//                           </select>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => toggleProduct(item.product)}
//                         className='text-white/60 hover:text-white text-xs ml-1'
//                       >✕</button>
//                     </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className='flex flex-col items-center'>
//                   <p className='text-xs text-white/70 font-semibold'>Total</p>
//                   <p className='text-lg font-bold text-white'>₹{targetAmount}</p>
//                 </div>
//               </div>
//             )}

//             {/* Wrap Together toggle */}
//             {selectedProducts.length >= 2 && (
//               <label className='flex items-center gap-3 mb-5 cursor-pointer p-3 bg-purple-50 rounded-xl border border-purple-200'>
//                 <input
//                   type='checkbox' checked={wrapTogether}
//                   onChange={e => setWrapTogether(e.target.checked)}
//                   className='accent-[#41334e] w-4 h-4'
//                 />
//                 <div>
//                   <p className='text-sm font-semibold text-[#41334e]'>Wrap Together</p>
//                   <p className='text-xs text-gray-500'>Pack all products as one combined gift bundle</p>
//                 </div>
//               </label>
//             )}
//           </div>

          

//           {/* ── RIGHT: Gift Details Form ── */}
//           <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 sticky top-28 overflow-y-auto flex flex-col gap-4 h-fit">
//             <h3 className='text-lg font-bold text-gray-700 border-b pb-2'>Gift Details</h3>

//             {/* Occasion */}
//             <div>
//               <p className='text-sm font-semibold text-gray-700 mb-2'>Occasion <span className='text-red-400'>*</span></p>
//               <div className='flex flex-wrap gap-2'>
//                 {OCCASIONS.map(o => (
//                   <button
//                     key={o} onClick={() => setForm(f => ({ ...f, occasion: o }))}
//                     className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
//                       form.occasion === o
//                         ? 'bg-[#41334e] text-white border-[#41334e]'
//                         : 'border-gray-300 text-gray-600 hover:border-[#41334e]'
//                     }`}
//                   >
//                     {o}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <p className='text-sm font-semibold text-gray-700 mb-1'>Recipient Name <span className='text-red-400'>*</span></p>
//               <input type='text' value={form.recipientName}
//                 onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
//                 placeholder='Who is this gift for?'
//                 className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
//             </div>

//             <div>
//               <p className='text-sm font-semibold text-gray-700 mb-1'>Recipient Email <span className='text-gray-400 text-xs font-normal'>(optional)</span></p>
//               <input type='email' value={form.recipientEmail}
//                 onChange={e => setForm(f => ({ ...f, recipientEmail: e.target.value }))}
//                 placeholder='recipient@email.com'
//                 className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
//             </div>

//             <div>
//               <p className='text-sm font-semibold text-gray-700 mb-1'>Personal Message</p>
//               <textarea value={form.personalMessage}
//                 onChange={e => setForm(f => ({ ...f, personalMessage: e.target.value }))}
//                 placeholder='Write a heartfelt message...' rows={3}
//                 className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e] resize-none' />
//             </div>

//             <div className='flex gap-3'>
//               <div className='flex-1'>
//                 <p className='text-sm font-semibold text-gray-700 mb-1'>Deadline <span className='text-red-400'>*</span></p>
//                 <input type='date' value={form.deadline}
//                   onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
//                   min={new Date().toISOString().split('T')[0]}
//                   className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
//               </div>
//               <div className='flex-1'>
//                 <p className='text-sm font-semibold text-gray-700 mb-1'>Min. ₹</p>
//                 <input type='number' value={form.minContribution}
//                   onChange={e => setForm(f => ({ ...f, minContribution: e.target.value }))}
//                   placeholder='0 = any'
//                   className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
//               </div>
//             </div>

//             {/* Summary */}
//             {selectedProducts.length > 0 && (
//               <div className='bg-gray-50 rounded-xl p-3 text-sm'>
//                 <div className='flex justify-between text-gray-600'>
//                   <span>Products selected</span>
//                   <span className='font-bold text-gray-800'>{selectedProducts.length}</span>
//                 </div>
//                 <div className='flex justify-between text-gray-600 mt-1'>
//                   <span>Target amount</span>
//                   <span className='font-bold text-[#41334e]'>₹{targetAmount}</span>
//                 </div>
//               </div>
//             )}

//             <button
//               onClick={handleSubmit}
//               disabled={loading || !selectedProducts.length || !form.occasion || !form.recipientName || !form.deadline}
//               className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
//                 !loading && selectedProducts.length && form.occasion && form.recipientName && form.deadline
//                   ? 'bg-[#41334e] hover:bg-[#5a4870] cursor-pointer'
//                   : 'bg-gray-300 cursor-not-allowed text-gray-400'
//               }`}
//             >
//               {loading ? 'Creating Pool...' : 'Create Gift Pool'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CreateGiftPool







import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const OCCASIONS = ['Wedding', 'Birthday', 'Festival', 'Anniversary', 'Baby Shower']
const allCategories = ['Glass Bangle', 'Kada Bangle', 'Multi Set']

const CreateGiftPool = () => {
  const { product: products, currency, axios, getToken, user } = useAppContext()
  const navigate = useNavigate()

  // Product selection state
  const [selectedProducts, setSelectedProducts] = useState([])
  const [wrapTogether, setWrapTogether] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState([])

  // Form state
  const [form, setForm] = useState({
    occasion: '',
    recipientName: '',
    recipientEmail: '',
    personalMessage: '',
    minContribution: '',
    deadline: '',
    contributionAmount: '',
  })
  const [loading, setLoading] = useState(false)
  const submittingRef = useRef(false)

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (!user) { navigate('/'); return null }

  // Filter products same as Collection page
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => p.inStock !== false)
    if (searchQuery.trim()) {
      list = list.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (category.length) {
      list = list.filter(p => category.includes(p.category))
    }
    return list
  }, [products, searchQuery, category])


  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(start, start + itemsPerPage)
  }, [filteredProducts, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, category])

  const toggleCategory = (cat) => {
    setCategory(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const isSelected = (productId) => selectedProducts.some(p => p.product._id === productId)

  const toggleProduct = (product) => {
    if (isSelected(product._id)) {
      setSelectedProducts(prev => prev.filter(p => p.product._id !== product._id))
    } else {
      const firstSize = Object.keys(product.price || {})[0]
      setSelectedProducts(prev => [...prev, { product, size: firstSize, quantity: 1 }])
    }
  }

  const updateItem = (productId, field, value) => {
    setSelectedProducts(prev => prev.map(item =>
      item.product._id === productId ? { ...item, [field]: value } : item
    ))
  }

  const targetAmount = selectedProducts.reduce((acc, item) => {
    return acc + (item.product?.price?.[item.size] || 0) * item.quantity
  }, 0)

  const handleSubmit = async () => {
    if (submittingRef.current) return
    if (!selectedProducts.length) return toast.error('Select at least one product')
    if (!form.occasion) return toast.error('Select an occasion')
    if (!form.recipientName.trim()) return toast.error('Enter recipient name')
    if (!form.deadline) return toast.error('Set a deadline')
    if (new Date(form.deadline) <= new Date()) return toast.error('Deadline must be in the future')
    if (!form.contributionAmount || Number(form.contributionAmount) <= 0) {
      return toast.error('Enter the amount you want to contribute')
    }
    if (form.minContribution && Number(form.contributionAmount) < Number(form.minContribution)) {
      return toast.error(`Your contribution must be at least ₹${form.minContribution}`)
    }

    submittingRef.current = true
    setLoading(true)
    try {
      const { data } = await axios.post('/api/gift/create', {
        products: selectedProducts.map(item => ({
          productId: item.product._id,
          size: item.size,
          quantity: item.quantity,
        })),
        wrapTogether,
        occasion: form.occasion,
        recipientName: form.recipientName,
        recipientEmail: form.recipientEmail,
        personalMessage: form.personalMessage,
        minContribution: form.minContribution ? Number(form.minContribution) : 0,
        deadline: form.deadline,
        contributionAmount: Number(form.contributionAmount),
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (!data.success) {
        toast.error(data.message)
        setLoading(false)
        submittingRef.current = false
        return
      }

      // Save poolId so the payment-return page knows which pool to verify/activate
      sessionStorage.setItem('pendingGiftPoolId', data.poolId)

      // Open Cashfree Drop checkout for the organizer's own contribution
      const cashfree = window.Cashfree({ mode: 'sandbox' })
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: '_self',
      })
    } catch (err) {
      toast.error('Something went wrong')
      setLoading(false)
      submittingRef.current = false
    }
  }

 

  return (
    <div className='min-h-screen bg-gray-100 pt-28 pb-16 px-4 lg:px-12'>
      <div className='max-w-[1440px] mx-auto'>

        <h2 className='text-2xl font-bold text-[#41334e] mb-1'>Create Gift Pool</h2>
        <div className='w-50 h-[3px] rounded-full bg-gradient-to-r from-[#41334e] mb-8' />

        <div className='flex flex-col xl:flex-row gap-6 items-stretch'>

          {/* ── LEFT: Product Selection (Collection style) ── */}
          <div className='bg-white rounded-2xl p-5 flex-[1.4] flex flex-col'>

            {/* Search + Filter bar */}
            <div className='flex flex-wrap gap-3 mb-5 items-center'>
              <input
                type='text' value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='Search bangles...'
                className='flex-1 min-w-[180px] border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#41334e] bg-white'
              />
              <div className='flex gap-2 flex-wrap'>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      category.includes(cat)
                        ? 'bg-[#41334e] text-white border-[#41334e]'
                        : 'border-gray-300 text-gray-600 hover:border-[#41334e] bg-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid — Collection style */}
            <div className="flex-1 pr-2 min-h-0">
            {filteredProducts.length === 0 ? (
              <p className='text-center text-gray-400 py-12'>No products found.</p>
              ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {paginatedProducts.map(product => {
                  const selected = isSelected(product._id)
                  const firstSize = Object.keys(product.price || {})[0]
                  return (
                    <div
                      key={product._id}
                      onClick={() => toggleProduct(product)}
                      className={`relative overflow-hidden flex flex-col gap-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                        selected
                          ? 'border-[#41334e] shadow-lg shadow-purple-100 scale-[1.02]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      {/* Product image */}
                      <div className='h-[100px] flex items-center justify-center rounded-xl bg-gray-100 relative'>
                        <img src={product.images?.[0]} alt='' height={100} width={100} className='object-contain' />

                        {/* Type tag */}
                        <p className='absolute top-2 right-2 text-xs ring-slate-900/10 px-3 bg-white rounded-full py-0.5'>{product.type}</p>

                        {/* Selected checkmark overlay */}
                        {selected && (
                          <div className='absolute inset-0 bg-[#41334e]/10 rounded-xl flex items-center justify-center'>
                            <div className='w-8 h-8 rounded-full bg-[#41334e] flex items-center justify-center shadow-lg'>
                              <span className='text-white text-sm font-bold'>✓</span>
                            </div>
                          </div>
                        )}

                        {/* Select/Deselect button at bottom */}
                        <div className='absolute bottom-1 left-1 right-1'>
                          <div className={`text-center py-1.5 rounded-full text-xs font-semibold transition-all ${
                            selected
                              ? 'bg-red-500 text-white'
                              : 'bg-[#41334e] text-white opacity-0 group-hover:opacity-100 block md:hidden md:group-hover:block'
                          }`}>
                            {selected ? '✕ Remove' : '+ Add to Gift'}
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className='p-2 flex flex-col gap-1'>
                        <div className='flex items-center justify-between'>
                          <h3 className='font-bold uppercase text-xs line-clamp-1 text-gray-800'>{product.title}</h3>
                          <p className='font-semibold text-xs text-[#41334e] whitespace-nowrap'>₹{product.price?.[firstSize]}</p>
                        </div>
                        <p className='text-xs text-gray-400 line-clamp-1'>{product.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            </div>


            {/* next & previous buttons with page numbers */}
            <div className="flex items-center justify-center flex-wrap mt-6 gap-3">

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`bg-[#41334e] text-white px-3 py-1 rounded-xl ${
                currentPage === 1 && "opacity-50 cursor-not-allowed"
                }`}
                >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-full ${ currentPage === index + 1 ? "bg-[#41334e] text-white": "bg-gray-200"
                  }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className={`bg-[#41334e] text-white px-3 py-1 rounded-xl ${
                        currentPage === totalPages && "opacity-50 cursor-not-allowed"
                    }`}
                >
                    Next
                </button>

            </div>

            {/* Selected products summary bar */}
            {selectedProducts.length >= 0 && (
              <div className='bg-[#41334e] rounded-2xl p-4 mb-5 mt-5 flex items-center justify-between gap-3'>
                
                <div className='flex flex-col gap-5'>
                  <div className ='text-white/50 font-semibold'> Selected Items</div>
                  <div className='flex items-center gap-3 flex-wrap'>
                  
                  {selectedProducts.map(item => (
                    
                    <div key={item.product._id} className='flex items-center
                    gap-2 bg-white/20 rounded-xl px-3 py-1.5'>
                      <img src={item.product.images?.[0]} alt='' className='w-8 h-8 object-contain rounded' />
                      <div>
                        <p className='text-xs text-white font-semibold line-clamp-1 max-w-[100px]'>{item.product.title}</p>
                        <div className='flex gap-1 mt-0.5'>
                          <select
                            value={item.size}
                            onChange={e => updateItem(item.product._id, 'size', e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className='text-[10px] rounded px-1 bg-white/80 text-gray-700 focus:outline-none'
                          >
                            {Object.keys(item.product.price || {}).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <select
                            value={item.quantity}
                            onChange={e => updateItem(item.product._id, 'quantity', Number(e.target.value))}
                            onClick={e => e.stopPropagation()}
                            className='text-[10px] rounded px-1 bg-white/80 text-gray-700 focus:outline-none'
                          >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>×{n}</option>)}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleProduct(item.product)}
                        className='text-white/60 hover:text-white text-xs ml-1'
                      >✕</button>
                    </div>
                    ))}
                  </div>
                </div>

                <div className='flex flex-col items-center'>
                  <p className='text-xs text-white/70 font-semibold'>Total</p>
                  <p className='text-lg font-bold text-white'>₹{targetAmount}</p>
                </div>
              </div>
            )}

            {/* Wrap Together toggle */}
            {selectedProducts.length >= 2 && (
              <label className='flex items-center gap-3 mb-5 cursor-pointer p-3 bg-purple-50 rounded-xl border border-purple-200'>
                <input
                  type='checkbox' checked={wrapTogether}
                  onChange={e => setWrapTogether(e.target.checked)}
                  className='accent-[#41334e] w-4 h-4'
                />
                <div>
                  <p className='text-sm font-semibold text-[#41334e]'>Wrap Together</p>
                  <p className='text-xs text-gray-500'>Pack all products as one combined gift bundle</p>
                </div>
              </label>
            )}
          </div>

          

          {/* ── RIGHT: Gift Details Form ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 sticky top-28 overflow-y-auto flex flex-col gap-4 h-fit">
            <h3 className='text-lg font-bold text-gray-700 border-b pb-2'>Gift Details</h3>

            {/* Occasion */}
            <div>
              <p className='text-sm font-semibold text-gray-700 mb-2'>Occasion <span className='text-red-400'>*</span></p>
              <div className='flex flex-wrap gap-2'>
                {OCCASIONS.map(o => (
                  <button
                    key={o} onClick={() => setForm(f => ({ ...f, occasion: o }))}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      form.occasion === o
                        ? 'bg-[#41334e] text-white border-[#41334e]'
                        : 'border-gray-300 text-gray-600 hover:border-[#41334e]'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className='text-sm font-semibold text-gray-700 mb-1'>Recipient Name <span className='text-red-400'>*</span></p>
              <input type='text' value={form.recipientName}
                onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
                placeholder='Who is this gift for?'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
            </div>

            <div>
              <p className='text-sm font-semibold text-gray-700 mb-1'>Recipient Email <span className='text-gray-400 text-xs font-normal'>(optional)</span></p>
              <input type='email' value={form.recipientEmail}
                onChange={e => setForm(f => ({ ...f, recipientEmail: e.target.value }))}
                placeholder='recipient@email.com'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
            </div>

            <div>
              <p className='text-sm font-semibold text-gray-700 mb-1'>Personal Message</p>
              <textarea value={form.personalMessage}
                onChange={e => setForm(f => ({ ...f, personalMessage: e.target.value }))}
                placeholder='Write a heartfelt message...' rows={3}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e] resize-none' />
            </div>

            <div className='flex gap-3'>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-gray-700 mb-1'>Deadline <span className='text-red-400'>*</span></p>
                <input type='date' value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
              </div>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-gray-700 mb-1'>Min. ₹</p>
                <input type='number' value={form.minContribution}
                  onChange={e => setForm(f => ({ ...f, minContribution: e.target.value }))}
                  placeholder='0 = any'
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
              </div>
            </div>

            {/* Organizer's own contribution — paid upfront to activate the pool */}
            <div className='bg-purple-50 border border-purple-200 rounded-xl p-3'>
              <p className='text-sm font-semibold text-[#41334e] mb-1'>Your Contribution (₹) <span className='text-red-400'>*</span></p>
              <p className='text-xs text-gray-500 mb-2'>Pay this now to activate the pool and get your shareable link.</p>
              <input type='number' value={form.contributionAmount}
                onChange={e => setForm(f => ({ ...f, contributionAmount: e.target.value }))}
                placeholder={form.minContribution ? `Min ₹${form.minContribution}` : 'Enter amount'}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#41334e]' />
            </div>

            {/* Summary */}
            {selectedProducts.length > 0 && (
              <div className='bg-gray-50 rounded-xl p-3 text-sm'>
                <div className='flex justify-between text-gray-600'>
                  <span>Products selected</span>
                  <span className='font-bold text-gray-800'>{selectedProducts.length}</span>
                </div>
                <div className='flex justify-between text-gray-600 mt-1'>
                  <span>Target amount</span>
                  <span className='font-bold text-[#41334e]'>₹{targetAmount}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !selectedProducts.length || !form.occasion || !form.recipientName || !form.deadline || !form.contributionAmount}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                !loading && selectedProducts.length && form.occasion && form.recipientName && form.deadline && form.contributionAmount
                  ? 'bg-[#41334e] hover:bg-[#5a4870] cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed text-gray-400'
              }`}
            >
              {loading ? 'Redirecting to Payment...' : `💳 Pay ₹${form.contributionAmount || '0'} & Create Pool`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateGiftPool