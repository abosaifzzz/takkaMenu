import React from 'react'
import { useRef, useState } from 'react';

import cover from "../../assets/cover.jpeg"
import reslogo from "../../assets/res-logo.jpg"
import kofta from "../../assets/kofta.jpg"

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
    const categories = [
        {
            id: 1,
            image: cover,
            name: 'الأفطار الصباحي',
            items: [
                { id: 101, name: 'Grilled chicken - فرخة مشوية', price: 'EGP 200 - EGP 500', image: kofta },
                { id: 102, name: 'Grilled werk - فرخة نص', price: 'EGP 250 - EGP 500', image: kofta },
                { id: 103, name: 'Scrambled Eggs -   اوي بقي بيض مقلي', price: 'EGP 500 - EGP 3600', image: kofta },
                { id: 104, name: 'Foul & Falafel - فول و فلافل', price: 'EGP 20 - EGP 40', image: kofta }
            ]
        },
        {
            id: 2,
            image: instapay,
            name: 'الأفطار المسائي',
            items: [
                { id: 201, name: 'Grilled - مشوية', price: 'EGP 350', image: kofta },
                { id: 202, name: 'موزة كبيرة اوي', price: 'EGP 500', image: kofta },
                { id: 203, name: 'Mixed Grill - مشاوي مشكلة', price: 'EGP 450 - EGP 700', image: kofta },
                { id: 204, name: 'Seafood Platter - طبق بحري', price: 'EGP 600', image: kofta }
            ]
        },
        {
            id: 3,
            image: instapay, // Replace with another image variable if available
            name: 'العشاء',
            items: [
                { id: 301, name: 'Stuffed Pigeon - حمام محشي', price: 'EGP 150', image: kofta },
                { id: 302, name: 'Kebab & Kofta - كباب وكفتة', price: 'EGP 400 - EGP 600', image: kofta },
                { id: 303, name: 'Roasted Lamb - خروف مشوي', price: 'EGP 1000', image: kofta },
                { id: 304, name: 'Stuffed Vegetables - محشي', price: 'EGP 70 - EGP 120', image: kofta }
            ]
        },
        {
            id: 4,
            image: cover, // Replace with another image variable if available
            name: 'الغداء',
            items: [
                { id: 401, name: 'Molokhia with Rice - ملوخية بالأرز', price: 'EGP 80', image: kofta },
                { id: 402, name: 'Shish Tawook - شيش طاووق', price: 'EGP 200', image: kofta },
                { id: 403, name: 'Baked Fish - سمك مشوي', price: 'EGP 300', image: kofta },
                { id: 404, name: 'Beef Stroganoff - بيف ستروغانوف', price: 'EGP 450', image: kofta }
            ]
        }
    ];


    return <>
        <div className="menu  bg-slate-100">
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


            <div className="w-full position-relative">
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

                <div className="p-4 mt-4  md:pb-28 pb-20   rounded-md">
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
                                    className={`categories  h-full flex gap-2 items-center px-1 bg-slate-50 overflow-x-auto whitespace-nowrap transition-all duration-300 ${isSearchVisible ? 'hidden' : 'flex w-full'
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
                            <div className="menu-categories-items ">
                                <div className="item-size-form hidden z-10 flex justify-center bg-black/25 items-center fixed inset-0">
                                    <div className="size-form w-full rounded-md mx-4 h-1/2 bg-white">
                                        ddddddddddddd
                                    </div>



                                </div>

                                {categories.map((category) => (
                                    <div key={category.id} className="category-and-items mt-5 rounded-md">
                                        <div className="category bg-white rounded-md shadow-lg pb-3">
                                            <img className='w-full object-cover h-28 rounded-md' src={category.image} alt={category.name} />
                                            <div className="category-name text-center mt-2">
                                                <p className='cairo font-semibold'>{category.name}</p>
                                            </div>
                                        </div>

                                        {category.items.map((item) => (
                                            <div key={item.id} className="items hover:transition-transform hover:translate-y-1 h-28 bg-white rounded-md shadow-md flex justify-between mt-4 p-2">
                                                <div className="left-side w-3/4 h-full p-1">
                                                    <div className="item-name">
                                                        <p className='font-medium text-sm kufi'>{item.name}</p>
                                                    </div>
                                                    <div className="item-price-and-add w-full h-full  flex justify-between">
                                                        <p className='kufi text-[#20617c] text-lg font-medium mt-2'>{item.price}</p>

                                                    </div>

                                                </div>
                                                <div className="right-side relative h-full">
                                                    <img className='h-full w-24 object-cover rounded-md' src={item.image} alt={item.name} />
                                                    <div className="add-item  flex justify-center bg-white  rounded-full w-fit h-fit bottom-0 -left-5 absolute ">
                                                        <button title="Add New" className="group cursor-pointer outline-none hover:rotate-90 duration-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 24 24" className="stroke-green-400 fill-none group-hover:fill-green-800 group-active:stroke-green-200 group-active:fill-green-600 group-active:duration-0 duration-300">
                                                                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5"></path>
                                                                <path d="M8 12H16" strokeWidth="1.5"></path>
                                                                <path d="M12 16V8" strokeWidth="1.5"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}




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
            <div className="powred-by">

                <p className='kufi text-center text-gray-700 '>Powered by <span>Takka</span> </p>

            </div>
        </div>




    </>
}
