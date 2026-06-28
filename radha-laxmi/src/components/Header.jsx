import React, { useState } from 'react'
import logo from './RL.png'
import Navbar from './Navbar'
import menuIcon from '../assets/menu.svg';
import menuClose from '../assets/menu-close.svg';
import userlogo from '../assets/user.svg';
import cart from '../assets/cart-added.svg'
import { useClerk} from '@clerk/react'
import { UserButton } from '@clerk/react';
import { useAppContext } from '../context/AppContext';

const Header = ({ scrollY }) => {
  const [menuOpened, setmenuOpened] = useState(false)

  const {openSignIn} = useClerk()
  const {navigate, user, getCartCount, isOwner} = useAppContext()

  const toggleMenu = () => setmenuOpened(prev => !prev)

  const OrderIcon = () =>{
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      stroke-Width="2"
      stroke-Linecap="round"
      stroke-Linejoin="round"
      class="lucide lucide-scroll-text-icon lucide-scroll-text"
    >
      {/* lines */}
      <path d="M15 12h-5" />
      <path d="M15 8h-5" />
      <path d="m19 17v5a2 2 0 0 0-2-2H4" />
      <path d="M8 21h12a2 2 0 0 0 2-2v-101 1 0 0 0-1-1h11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0v2a1 1 0 0 0 1 1h3" />
    </svg>
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrollY > 50 
        ? 'bg-white' 
        : 'bg-white'
    }`}>
      <div className='mx-auto max-w-[1440px] px-4 lg:px-12 flex items-center justify-between py-5'>
        {/* logo */}
        <div className='flex flex-1 gap-[20px]'>
          <span className='h-12 w-12'>
            <img src={logo} alt="#"/>
          </span>
          <span className='hidden sm:block text-[24px] font-[700] text-red-600 italic relative top-1 right-2'>
            Radha Lakshmi
          </span>
        </div>

        {/* Navbar */}
        <div className='flex-1'>
          <Navbar setmenuOpened={setmenuOpened} containerStyles={`${menuOpened ? "flex items-start flex-col mx-auto max-w-[1440px] px-4 lg:px-12 gap-y-8 fixed top-16 right-6 p-5 bg-white shadow-md w-52 z-50 xl:gap-8 text-[15px] font-[500] bg-[#41334e]/10 rounded-xl" 
          : "hidden mx-auto max-w-[1440px] px-4 lg:px-12 lg:flex gap-x-5 xl:gap-8 text-[15px] font-[500] bg-[#41334e]/10 rounded-full p-1"}`} />
        </div>

        {/* button & search */}
        <div className='flex flex-1 items-center sm:justify-end gap-x-4 sm:gap-x-8'>
          <div>
            {isOwner && (
              <button onClick={()=> navigate('/owner')} className="ring-1 ring-slate-900/10 px-2 py-1 rounded-full hover:bg-gray-200 transition-all duration-300 cursor-pointer text-xs font-semibold">Dashboard</button>
            )}
          </div>

          {/* menu */}
          <div className='relative lg:hidden w-7 h-6'>
            <img onClick={toggleMenu} src={menuIcon} alt="menu" className={`absolute inset-0 lg:hidden cursor-pointer transition-opacity duration-700 ${menuOpened ? "opacity-0" : "opacity-100"}`} />

            <img onClick={toggleMenu} src={menuClose} alt="menu" className={`absolute inset-0 lg:hidden cursor-pointer transition-opacity duration-700 ${menuOpened ? "opacity-100" : "opacity-0"}`} />

          </div>
          {/* cart */}
          <div onClick={()=>navigate('/Cart')} className='relative cursor-pointer'>
            <img src={cart} alt="cart" className='min-w-7' />
            <label className='absolute bottom-7 right-0 left-0 text-xs font-bold bg-[#41334e]/15 flex items-center justify-center rounded-full'>{getCartCount()}</label>
          </div>
          {/* userprofile */}
          <div className='group relative top-1'>
            {user ? (
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox:{
                        width:"42px",
                        height:"42px"
                      }
                    }
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                    label="My Orders"
                    labelIcon={<OrderIcon />}
                    onClick={()=>navigate("/my-orders")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              )
            :
            (<button onClick={openSignIn} className="text-[14px] font-[500] bg-[#41334e] text-white px-7 py-3 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2">
              Login
              <img src={userlogo} alt="user" className='invert-w-5' />
            </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header