import React from 'react'
import { useRef, useState } from 'react';

import cover from "../../assets/cover.jpeg"
import reslogo from "../../assets/res-logo.jpg"
import fb from "../../assets/fb.png"
import wp from "../../assets/wp.png"
import call from "../../assets/call.png"
import massenger from "../../assets/massenger.png"

import instapay from "../../assets/instapay.png"



export default function Menu() {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [activeSection, setActiveSection] = useState("menu");


    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1; // Adjust scroll speed if needed
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const sectionTab = (sectionName) =>
        `cursor-pointer py-2 px-2   md:text-xl text-[1rem] cairo font-[650] ${activeSection === sectionName
            ? "border-b-2 border-[#20617c]"
            : "text-[#20617c] "
        } `;

    return <>
        <div className="menu-cover-pic relative h-44 shadow-xl shadow-slate-200  bg-red-100 flex justify-center items-center">
            <div className="close-label bg-red-500 flex justify-center items-center absolute top-0 left-0 right-0 h-8">
                <p className='text-white'><i className="fa-solid fa-circle-exclamation text-gray-400"></i> Closed at 2:00 Am </p>

            </div>
            <img className='w-full h-full object-cover' src={cover} alt="" />
            <div className="profile-pic absolute -bottom-1/3 border-4 border-white shadow-lg w-44 h-44 rounded-full overflow-hidden">
                <img src={reslogo} alt="" className="w-full h-full object-cover" />
            </div>
        </div>
        <div className="name-bio flex flex-col items-center mt-20">
            <p className='name text-xl font-medium'>Mekato Cafe</p>
            <p className='bio text-gray-600'>20% taxes and services in weekend </p>

        </div>


        <div className="w-full">
            <div className="flex justify-center border-b border-gray-200 pt-2  ">
                <div
                    className={sectionTab("menu")}
                    onClick={() => setActiveSection("menu")}
                >
                    المنيو
                </div>
                <div
                    className={sectionTab("contact")}
                    onClick={() => setActiveSection("contact")}
                >
                    التواصل
                </div>
                <div
                    className={sectionTab("order")}
                    onClick={() => setActiveSection("order")}
                >
                    الطلب
                </div>
                <div
                    className={sectionTab("pay")}
                    onClick={() => setActiveSection("pay")}
                >
                    الدفع
                </div>
            </div>

            <div className="p-4 mt-4  md:pb-28 pb-20    rounded-md">
                {activeSection === "menu" && (
                    <div className="menu">
                        <div className="search-categories flex items-center mt-1 h-11">
                            {/* Search Icon */}
                            <div
                                className="search-icon flex justify-center items-center bg-slate-50 rounded-s-full border-e-2 w-11 h-11 cursor-pointer"
                                onClick={toggleSearch}
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </div>

                            {/* Search Input */}
                            <div
                                className={`search-input ${isSearchVisible ? 'w-full' : 'w-0'} h-full transition-all duration-300 overflow-hidden`}
                            >
                                <input
                                    className="w-full h-full px-1 border-none outline-none bg-slate-50"
                                    type="search"
                                    placeholder="Search here .."
                                />
                            </div>

                            {/* Categories Section with Horizontal Scroll */}
                            <div
                                className={`categories h-full flex gap-2 items-center px-1 bg-slate-50 overflow-x-auto whitespace-nowrap transition-all duration-300 ${isSearchVisible ? 'hidden' : 'flex w-full'
                                    }`}
                                ref={scrollRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseUp}
                                onMouseUp={handleMouseUp}
                                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                            >
                                <div className="category-section border border-red-500 bg-white px-4 py-1 rounded-2xl">
                                    <p>الافطار الصباحي</p>
                                </div>
                                <div className="category-section border border-red-500 bg-white px-4 py-1 rounded-2xl">
                                    <p>الافطار الصباحي</p>
                                </div>
                                <div className="category-section border border-red-500 bg-white px-4 py-1 rounded-2xl">
                                    <p>الافطار الصباحي</p>
                                </div>  <div className="category-section border border-red-500 bg-white px-4 py-1 rounded-2xl">
                                    <p>الافطار الصباحي</p>
                                </div>  <div className="category-section border border-red-500 bg-white px-4 py-1 rounded-2xl">
                                    <p>الافطار الصباحي</p>
                                </div>  <div className="category-section border border-red-500 bg-white px-4 py-1 rounded-2xl">
                                    <p>الافطار الصباحي</p>
                                </div>  <div className="category-section border border-red-500 bg-white px-4 py-1 rounded-2xl">
                                    <p>الافطار الصباحي</p>
                                </div>

                                {/* Add more items as needed */}
                            </div>

                        </div>

                    </div>

                )}
                {activeSection === "contact" && (

                    <div className="contact mt-3 flex flex-col items-center  rounded-md ">
                        <div className="contact-tools  w-full p-4 flex justify-center gap-3">
                            <div className="facebook w-32 h-32  flex justify-center items-center bg-blue-50 rounded-md">
                                <img src={fb} alt="" />
                                {/* <i className="fa-brands text-3xl  fa-facebook-f"></i> */}
                            </div>
                            <div className="call w-32 h-32 flex justify-center items-center bg-green-50 rounded-md">

                                {/* <i className="fa-solid  text-3xl fa-phone"></i>              */}
                                <img className='w-full h-full' src={call} alt="" />

                            </div>
                            {/* <div className="location border border-red-500 w-11 h-11 flex justify-center items-center bg-red-50 rounded-full">

                                <i className="fa-solid fa-location-dot"></i>

                            </div>
                            <div className="whatsapp border border-lime-500  w-11 h-11 flex justify-center items-center bg-lime-50 rounded-full">

                                <i className="fa-brands fa-whatsapp"></i>
                            </div> */}


                        </div>

                    </div>

                )}
                {activeSection === "order" && (
                    <div className="order">
                        <div className="contact mt-3 flex flex-col items-center bg-slate-50 rounded-md ">
                            <div className="contact-tools w-full p-4 flex justify-center gap-3">
                                <div className="facebook w-32 h-32  flex justify-center items-center bg-blue-50 rounded-md">
                                    <img src={wp} alt="" />
                                </div>
                                <div className="call w-32 h-32 flex justify-center items-center bg-green-50 rounded-md">
                                    <img className='w-full h-full' src={massenger} alt="" />
                                </div>


                            </div>

                        </div>
                    </div>


                )}
                {activeSection === "pay" && (
                    <div className="pay flex justify-center">
                        <div className="call shadow-lg border rounded-lg w-32 h-32 flex bg-slate-300 justify-center items-center ">

                            <img className='w-full h-full rounded-lg' src={instapay} alt="" />

                        </div>
                    </div>
                )}
            </div>
        </div>



    </>
}
