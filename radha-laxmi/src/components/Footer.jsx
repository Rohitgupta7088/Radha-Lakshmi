import React from 'react'
import logo from './RL.png'

const Footer = () => {
    return (
        <div>
            <hr />
        <section className="px-6 md:px-16 lg:px-24 xl:px-10 pt-8 text-gray-500  bg-[#dad4d4]">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-10 border-b border-gray-800/30 pb-6">
                <div className="md:max-w-96">
                    <div className='flex items-center gap-[20px]'>
                        <span className='w-[150px] h-[150px]'>
                            <img src={logo} alt="#"/>
                        </span>
                        <span className='text-[24px] font-[700] text-red-600 italic relative top-1 right-2'>
                            Radha Lakshmi
                        </span>
                    </div>
                    <p className="mt-6 font-semibold">
                        Radha Lakshmi Brand celebrates the timeless beauty of Indian bangles with a touch of elegance and tradition. Each piece is crafted to reflect culture, grace, and modern sophistication. We bring you designs that make every occasion special and memorable.
                    </p>
                </div>
                <div className="flex-1 flex md:flex-row items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="/" className='hover:font-bold'>Home</a></li>
                            <li><a href="/blog" className='hover:font-bold'>Blogs</a></li>
                            <li><a href="/Collection" className='hover:font-bold'>Collection</a></li>
                            <li><a href="/contact" className='hover:font-bold hover:text-black'>Contact us</a></li>
                            <li><a href="/terms" className='hover:font-bold hover:text-black'>Terms And Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+91 9927465445</p>
                            <p>+91 8273095702</p>
                            <p>amolgupta181@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
    );
};

export default Footer