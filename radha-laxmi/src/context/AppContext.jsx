import { useAuth, useUser } from '@clerk/react'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from "axios"

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

const AppContext = createContext()

export const AppContextProvider =
  ({ children }) => {
    const [product, setproduct] = useState([])
    const [searchQuery, setsearchQuery] = useState("")
    const [cartItems, setcartItems] = useState({})
    const [method, setMethod] = useState("COD");
    const [isOwner, setIsOwner] = useState(false)
    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY
    const delivery_charges = 100;


    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()

    const getUser = async () => {
      try {
        const token = await getToken();

        if (!token) return;

        const { data } = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log(data)

        if (data.success) {
          setIsOwner(data.role?.toLowerCase() === "owner")
          setcartItems(data.cartData || {})
        }

      } catch (error) {
        console.log(error)
      }
    }


    const fetchProduct = async () => {
      try {
        const { data } = await axios.get('/api/products')
        if (data.success) {
          setproduct(data.products)
        }
        else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const addToCart = async (itemId, size) => {
      if (!size) {
        return toast.error("Please select a size");
      }
      let cartdata = structuredClone(cartItems)
      cartdata[itemId] = cartdata[itemId] || {}
      cartdata[itemId][size] = (cartdata[itemId][size] || 0) + 1;
      setcartItems(cartdata);

      if (user) {
        try {
          const token = await getToken();

          if (!token) return;

          const { data } = await axios.post('/api/cart/add', { itemId, size }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (data.success) {
            toast.success(data.message)
          }
          else {
            toast.error(data.message)
          }

        } catch (error) {
          toast.error(error.message);
        }
      }
    }

    const getCartCount = () => {
      let count = 0;
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          count += cartItems[itemId][size]
        }
      }
      return count;
    }

    const updateQuantity = async (itemId, size, quantity) => {
      let cartData = structuredClone(cartItems);

      if (quantity <= 0) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        cartData[itemId] = cartData[itemId] || {};
        cartData[itemId][size] = quantity;
      }

      setcartItems(cartData);


      if (user) {

        const token = await getToken();
        if (!token) return;
        try {
          const { data } = await axios.post('/api/cart/update', { itemId, size, quantity}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if(data.success){
            toast.success(data.message)
          }
          else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message)
        }
      }
    }

    const getcartAmount = () => {
      let total = 0
      for (const itemId in cartItems) {
        const productData = product.find((p) => String(p._id) === String(itemId))
        if (!productData) continue;
        for (const size in cartItems[itemId]) {
          const quantity = cartItems[itemId][size];
          if (quantity > 0) {
            total += productData.price[size] * quantity;
          }
        }
      }
      return total;
    }

    // useEffect(()=>{
    //   if(user){
    //     getUser()
    //   }
    // }, [user])

    // useEffect(()=>{
    //   const fetchData = async () => {
    //     if(user){
    //       await getUser()
    //     }
    //   }

    //   fetchData()
    // }, [user])


    // useEffect(() => {
    //   if (!user) {
    //     setIsOwner(false)
    //     setcartItems({})
    //   }
    // }, [user])

    //useEffect(() => {

    //   const fetchData = async () => {

    //     // reset first
    //     setIsOwner(false)

    //     if(user){
    //       await getUser()
    //     }
    //     else{
    //       setcartItems({})
    //     }
    //   }

    //   fetchData()

    // }, [user])

    useEffect(() => {

      const fetchData = async () => {

        // reset first
        setIsOwner(false)
        setcartItems({})

        // wait for clerk
        if (!isLoaded) return;

        if (user) {

          try {
            await axios.post("/api/users/save-user", {
              id: user.id,
              username: (user.fullName && user.fullName.trim()) ||
                user.primaryEmailAddress?.emailAddress?.split("@")[0] ||
                "User",
              email: user.primaryEmailAddress?.emailAddress,
              image: user.imageUrl,
            })

            console.log("USER SAVED TO DB")
          } catch (error) {
            console.log("SAVE USER ERROR:", error)
          }
          await getUser()
        }
      }

      fetchData()

    }, [user?.id, isLoaded])

    useEffect(() => {
      fetchProduct()
    }, [])

    const value = { navigate, user, product, fetchProduct, currency, searchQuery, setsearchQuery, cartItems, setcartItems, method, setMethod, delivery_charges, addToCart, getCartCount, updateQuantity, getcartAmount, isOwner, setIsOwner, getUser, axios, getToken }
    return (
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )
  }

export const useAppContext = () => useContext(AppContext)