import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import logo from "../../assets/logo.png"

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return <>

        <div className="navbar absolute z-40 flex flex-col md:flex-row px-4 md:px-10 justify-between items-center w-full py-2">
            {/* Mobile menu button (hidden on desktop) */}
            <div className="md:hidden flex w-full justify-between items-center">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white text-2xl">
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="logo">
                    <img src={logo} className="w-24" alt="Logo" />
                </div>
                <div className="w-8"></div> {/* Spacer for alignment */}
            </div>

            {/* Left Side - Visible on desktop */}
            <div className="hidden md:flex justify-center items-center w-full md:w-4/12 space-x-4 rtl:space-x-reverse">
                <button className='bg-[#4B6FA3] hover:bg-sky-700 text-white cairo px-3 py-1 rounded-md text-lg xl:text-xl'>
                    <Link to={"/signup"}>
                        <i className="fa-solid text-sm fa-angles-left"></i> انضم الينا
                    </Link>
                </button>
                <p className='text-white cairo text-lg xl:text-xl'>
                    <Link to={"/login"}>تسجيل الدخول</Link>
                </p>
                <p className='text-white cairo text-lg xl:text-xl'>انضم كشريك</p>
            </div>

            {/* Logo - Centered */}
            <div className="hidden md:flex justify-center items-center w-full md:w-4/12 px-2 md:px-7">
                <img src={logo} className='w-28 md:w-32' alt="Logo" />
            </div>

            {/* Right Side - Visible on desktop */}
            <div className="hidden md:flex justify-center items-center w-full md:w-4/12 space-x-4 rtl:space-x-reverse">
                <p className='text-white cairo text-lg xl:text-xl'>اراء عملائنا</p>
                <p className='text-white cairo text-lg xl:text-xl'>نبذة عننا</p>
                <p className='text-white cairo text-lg xl:text-xl'>الرئيسية</p>
            </div>

            {/* Mobile Menu Items (shown when menu is toggled) */}
            <div className={`md:hidden w-full bg-[#4B6FA3] mt-2 py-2 ${isMenuOpen ? 'block' : 'hidden'}`}
                id="mobile-menu">
                <div className="flex flex-col items-center space-y-3">
                    <p className='text-white cairo text-xl w-full text-center py-1 border-b border-white/20'>الرئيسية</p>
                    <p className='text-white cairo text-xl w-full text-center py-1 border-b border-white/20'>نبذة عننا</p>
                    <p className='text-white cairo text-xl w-full text-center py-1 border-b border-white/20'>اراء عملائنا</p>
                    <p className='text-white cairo text-xl w-full text-center py-1 border-b border-white/20'>انضم كشريك</p>
                    <p className='text-white cairo text-xl w-full text-center py-1 border-b border-white/20'>
                        <Link to={"/login"}>تسجيل الدخول</Link>
                    </p>
                    <button className='bg-white text-[#4B6FA3] cairo px-4 py-1 rounded-md text-xl w-3/4 text-center'>
                        <Link to={"/signup"}>
                            <i className="fa-solid text-sm fa-angles-left"></i> انضم الينا
                        </Link>
                    </button>
                </div>
            </div>
        </div>


        <Outlet />


    </>


}
