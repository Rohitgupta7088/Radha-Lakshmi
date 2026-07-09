import React, { useState, useEffect} from 'react'
import Header from './components/Header'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Blog from './pages/Blog'
import Footer from './components/Footer'
import ProductDetails from './pages/ProductDetails'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Myorder from './pages/Myorder'
import AddressForm from './pages/AddressForm'
import {Toaster} from 'react-hot-toast'
import Sidebar from './components/owner/Sidebar'
import Dashboard from './pages/owner/dashboard'
import AddProduct from './pages/owner/AddProduct'
import ListProduct from './pages/owner/ListProduct'
import Processing from './pages/Processing'
import CashfreeReturn from './pages/Cashfreereturn'
import TermsAndPolicy from './pages/Termsandpolicy'
import CancelOrder from './pages/CancelOrder'
import ExchangeOrder from './pages/ExchangeOrder'
import CreateGiftPool from './pages/CreateGiftPool'
import GiftPoolPage from './pages/GiftPoolPage'
import GiftPoolStatus from './pages/GiftPoolStatus'
import MyGiftPools from './pages/MyGiftPool'
import GiftOrganizerPaymentReturn from './pages/GiftOrganizerPaymentReturn'
import GiftContributeReturn from './pages/GiftContributeReturn'

const App = () => {

    const location = useLocation()
    const isOwnerPath = location.pathname.includes('owner')

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return(
        <main className='overflow-hidden text-[#000000e3]'>
            <div className='mx-auto max-w-[1440px] px-4 lg:px-12 py-10'></div>
            {!isOwnerPath && <Header scrolly= {'scrolly'}/>}
            <Toaster position='bottom-right'/>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/collection' element={<Collection/>} />
                <Route path='/collection/:productId' element={< ProductDetails/>} />

                <Route path='/Blog' element={<Blog/>} />
                <Route path='/Contact' element={<Contact/>} />
                <Route path='/Cart' element={<Cart/>} />
                <Route path='/my-orders' element={<Myorder/>} />
                <Route path='/cancel-order' element={<CancelOrder/>} />

                <Route path='/exchange-order' element={<ExchangeOrder/>} />

                <Route path='/processing/:nextUrl' element={<Processing/>} />
                <Route path='/cashfree-return' element={<CashfreeReturn/>} />

                <Route path='/AddressForm' element={<AddressForm/>} />

                <Route path='/terms' element={<TermsAndPolicy/>} />

                <Route path='/gift/create' element={<CreateGiftPool/>} />

                <Route path='/gift/:poolId' element={<GiftPoolPage/>} />
                
                <Route path='/gift/:poolId/status' element={<GiftPoolStatus/>} />

                <Route path='/gift/:poolId/organizer-payment-return' element={<GiftOrganizerPaymentReturn/>} />

                <Route path='/gift/:poolId/contribute-return' element={<GiftContributeReturn/>} />

                <Route path='/gift/my-pools' element={<MyGiftPools/>} />

                <Route path='/owner' element={<Sidebar />}>
                    <Route index element={<Dashboard/>} />
                    <Route path='/owner/add-product' element={<AddProduct/>} />
                    <Route path='/owner/list-product' element={<ListProduct/>} />
                </Route>
            </Routes>
            {!isOwnerPath && <Footer />}
        </main>
    )
}

export default App