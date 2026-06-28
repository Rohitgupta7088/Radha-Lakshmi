import React, {useEffect} from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/data'
import { Link, NavLink, Outlet} from 'react-router-dom'
import { UserButton } from '@clerk/react'
import logo from './RL.png'

const Sidebar = () => {
  const {navigate, isOwner, user} = useAppContext()

  const navItems = [
    {
      path: "/owner",
      label: "Dashboard",
      icon: assets.dashboard,
    },
    {
      path: "/owner/add-product",
      label: "Add Product",
      icon: assets.squarePlus,
    },
    {
      path: "/owner/list-product",
      label: "List Product",
      icon: assets.list,
    }
  ];

  useEffect(()=>{
    if(!isOwner){
      navigate("/")
    }
  },[isOwner])

  return (
    <div className='absolute top-0 md:px-8 py-6 xl:py-8 m-1 sm:m-3 lg:w-11/12 bg-white/50 shadow rounded-xl'>
      <div className='mx-auto max-w-[1440] flex flex-col md:flex-row'>
        {/* Sidebar */}
        <div className='max-md:flex max-md:items-center max-md:justify-center flex flex-col justify-between bg-gray-200 sm:m-3 md:min-w-[20%] md:min-h-[97vh] rounded-xl shadow'>
          <div classname='flex flex-col gap-y-6 max-md:items-center md:flex-col md:pt-5'>
          <div className='w-full flex justify-between md:flex-col'>
            {/* Logo */}
              <div className='flex flex-1 gap-[20px]'>
                <span className='h-12 w-12'>
                  <img src={logo} alt="#"/>
                </span>
                <span className='block text-2xl font-[700] text-red-600 italic relative top-1 right-2'>
                  Radha Lakshmi
                </span>
              </div>

              <div className='md:hidden flex items-center gap-3 md:bg-gray-200 rounded-b-xl p-2 pl-5 lg:pl-10 md:mt-10'>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox:{
                        width:"42px",
                        height:"42px"
                      }
                    }
                  }}
                />

                <div className='text-sm font-semibold text-gray-800 capitalize'>
                  {user?.firstName} {user?.lastName}
                </div>
              </div>
            </div>

              <div className='flex md:flex-col md:gap-x-5 gap-y-8 md:mt-4'>
                {navItems.map((link)=>(
                  <NavLink
                    key={link.label}
                    to={link.path}
                    end
                    className={({ isActive }) => 
                    isActive ? "flex items-center justify-start gap-x-2 p-5 lg:pl-12 bold-13 sm:!text-sm cursor-pointer h-10 bg-gray-800/10 max-md:border-b-4 md:border-r-4 border-gray-800" : "flex items-center justify-start gap-x-2 p-5 lg:pl-12 bold-13 sm:!text-sm cursor-pointer h-10 rounded-xl"}
                  >
                  <img src={link.icon} alt={link.label} className='hidden md:block' width={18} />
                  <div>
                    {link.label}
                  </div>
                  </NavLink>
                ))}
              </div>
             </div> 


              <div className='hidden md:flex items-center gap-3 md:bg-gray-200 border-t border-slate-900/15 rounded-b-xl p-2 pl-5 lg:pl-10 md:mt-10'>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox:{
                        width:"42px",
                        height:"42px"
                      }
                    }
                  }}
                />
                <div className='text-sm font-semibold text-gray-800 capitalize'>
                  {user?.firstName} {user?.lastName}
                </div>
              </div>
        </div>
        <Outlet/>
       </div>
      </div>
  )
}

export default Sidebar