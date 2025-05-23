import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import takkaLogo from "../../assets/takka-logo.jpg"
import shop from "../../assets/shop.png"
import reslogo2 from "../../assets/relogo2.png"

import useFetchData from '../../utils/useApi.js';

export default function DashSideBar({ sidebarIsOpen, toggleSidebar, reloadOutlet }) {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [isNamesOpen, setIsNamesOpen] = useState(false);
    const { isLoading, error, fetchData, data } = useFetchData();
    const [menus, setMenus] = useState([]);
    const [defaultMenu, setDefaultMenu] = useState('');
    const [menuLogo, setMenuLogo] = useState(null);
    const [isLogoLoading, setIsLogoLoading] = useState(true);

    const [showArrow, setShowArrow] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const ownerId = localStorage.getItem('owner'); // Get owner_id from localStorage


        if (ownerId) {
            fetchData(`/api/ownermenus/${ownerId}`)
                .then((response) => {
                    if (response?.data) {
                        const menus = response.data.result;
                        console.log("dashside", menus);


                        // Check if profile_image exists in the first menu
                        if (menus.length > 0 && menus[0].profile_image) {
                            const profileImageUrl = `${apiUrl}/api/file/${menus[0].profile_image}`;
                            setMenuLogo(profileImageUrl);
                            setIsLogoLoading(false)
                            console.log("Profile image URL:", profileImageUrl);
                        }

                        // Menu handling logic
                        if (menus.length === 0) {
                            setShowArrow(false);
                            // Clear menu from localStorage if no menus exist
                            localStorage.removeItem('menu');
                            localStorage.removeItem('m_id');
                        } else {
                            // Check if there's a menu stored in localStorage
                            const storedMenuId = localStorage.getItem('menu');
                            const matchingMenu = menus.find(menu => menu.id_hash === storedMenuId);

                            if (matchingMenu) {
                                // Use the menu from localStorage
                                const profileImageUrl = `${apiUrl}/api/file/${matchingMenu.profile_image}`;
                                setMenuLogo(profileImageUrl);
                                setIsLogoLoading(false)
                                console.log("Profile image URL:", profileImageUrl);

                                setDefaultMenu(matchingMenu.name);
                                setShowArrow(menus.length > 1);
                            } else {
                                // Use the first menu as default
                                localStorage.setItem('menu', menus[0].id_hash);
                                setDefaultMenu(menus[0].name);
                                setShowArrow(menus.length > 1);
                            }
                        }
                        setMenus(menus);
                    }
                })
                .catch((err) => {
                    console.error('Error fetching menus:', err);
                });
        }

    }, []); // Empty dependency array to run only once on mount // Empty dependency array to avoid infinite loop



    // Toggle the state when the arrow is clicked
    const toggleMenu = () => {
        setIsNamesOpen(!isNamesOpen);
    };
    // const handleMenuSelect = (m_id, menuId, menuName) => {
    //     localStorage.setItem('m_id', m_id);

    //     localStorage.setItem('menu', menuId);
    //     navigate(`/menu/${menuId}/dashboard`);

    //     setDefaultMenu(menuName);
    //     setIsNamesOpen(false); // Close the more names div
    // };
    const handleMenuSelect = (m_id, menuId, menuName, profile) => {
        // Update localStorage with the new menu selection
        localStorage.setItem('m_id', m_id);
        console.log("log", profile);

        localStorage.setItem('menu', menuId);

        const profileImageUrl = `${apiUrl}/api/file/${profile}`;
        console.log("pro img0", profileImageUrl);

        setMenuLogo(profileImageUrl);
        console.log("Profile image URL2:", profileImageUrl);



        // Update the displayed menu
        setDefaultMenu(menuName);
        setIsNamesOpen(false); // Close the more names div

        // Navigate to the selected menu's dashboard

        navigate(`/menu/${menuId}/dashboard`);
        reloadOutlet();

    };

    let menuId = localStorage.getItem("menu")

    return <>

        <div
            className={`sidebar   z-30 flex flex-col fixed items-center shadow-sm shadow-gray-500 h-full text-gray-700 bg-gray-100 rounded transition-all duration-500 ease-in-out
    ${sidebarIsOpen ? 'lg:w-[15%] md:w-[20%] w-full' : 'w-0'}`}
        >
            <div onClick={toggleSidebar} className="togglebtn py-3 w-10 flex justify-center cursor-pointer bg-gray-100 border-2 absolute top-1/2 -left-10 rounded-l-md">
                <i className="fa-solid fa-chevron-left text-sky-600 rounded-e-md"></i>

            </div>
            {sidebarIsOpen && (
                <div className="data w-full relative">
                    <div onClick={toggleSidebar} className="togglebtn py-3 w-10 flex md:hidden  justify-center cursor-pointer bg-gray-100 border-2 absolute top-0 left-0 rounded-l-md">
                        <i className="fa-solid fa-chevron-left text-sky-600 rounded-e-md"></i>

                    </div>

                    <div className="takka-logo w-full h-44 flex justify-center items-center">
                        {isLogoLoading ? (<>

                            <div className="md:w-1/2 sm:w-1/3 w-1/3 aspect-square rounded-full bg-gray-200 animate-pulse border shadow-xl"></div>


                        </>) : menuLogo ? (
                            <img
                                className='md:w-1/2 sm:w-1/3 w-1/3 border shadow-xl rounded-full object-cover aspect-square'
                                src={menuLogo}
                                alt="Profile logo"
                                onError={(e) => {
                                    // Fallback if image fails to load
                                    e.target.src = reslogo2;
                                }}
                            />
                        ) : (
                            <img
                                className='w-1/2 border shadow-xl rounded-full'
                                src={shop}
                                alt="Default shop logo"
                            />
                        )}
                    </div>



                    {isLoading ? (
                        // Loading state
                        <div className="w-full rounded-md p-2">
                            <div className="animate-pulse w-full h-12 flex justify-between items-center p-1 border-2 rounded-md bg-gray-100">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-4"></div>
                            </div>
                        </div>
                    ) : menus.length > 0 ? (
                        // Menu content when loaded and has items
                        <div className="menu-name w-full rounded-md p-2">
                            <div
                                onClick={toggleMenu}
                                className="choose-name cursor-pointer w-full h-12 flex justify-between items-center p-1 border-2 rounded-md"
                            >
                                <p className='text-sky-700 text-sm text-center cairo'>{defaultMenu}</p>
                                {showArrow && (
                                    <i
                                        className={`fa-solid fa-chevron-down cursor-pointer transition-transform duration-200 ${isNamesOpen ? 'rotate-180' : ''
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleMenu();
                                        }}
                                    />
                                )}
                            </div>

                            {showArrow && (
                                <div
                                    className={`more-names overflow-y-auto w-full bg-white rounded-b-md overflow-hidden transition-all duration-300 ease-in-out ${isNamesOpen ? 'md:max-h-[200px]' : 'max-h-0 p-0'
                                        }`}
                                >
                                    {menus.map((menu) => (
                                        <div
                                            key={menu.id}
                                            className="menu-option hover:bg-slate-200 p-2 border-b cursor-pointer transition-colors duration-150"
                                            onClick={() => handleMenuSelect(menu.id, menu.id_hash, menu.name, menu.profile_image)}
                                        >
                                            <p className='text-sm text-center'>{menu.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Empty state when no menus exist
                        <div className="w-full rounded-md p-2">
                            <div className="w-full h-12 flex items-center justify-center p-1 border-2 rounded-md">
                                <p className='text-gray-500 text-sm'>No menus available</p>
                            </div>
                        </div>
                    )}

                    <div className="w-full px-2">
                        <div className="flex flex-col items-center w-full mt-3 border-t border-gray-300">
                            <div className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="ml-2 cairo text-sm font-medium">

                                    <Link onClick={toggleSidebar} to={`menu/${menuId}/dashboard`}>الرئيسية</Link>
                                </span>
                            </div>

                            <div className="flex items-center w-full h-12 px-3 mt-2 hover:bg-gray-300 rounded" href="#">
                                <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span onClick={toggleSidebar} className="ml-2 text-sm font-medium cairo"><Link to={`menu/${menuId}/menu-management`}>لوحة التحكم</Link></span>
                            </div>

                        </div>
                        <div className="flex flex-col items-center w-full mt-2 border-t border-gray-300">
                            <Link to={"/customer-reviews"} className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span onClick={toggleSidebar} className="ml-2 text-sm font-medium cairo">تقييمات العملاء</span>
                            </Link>

                            <Link className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" to={"/menu-settings"}>

                                <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                <span onClick={toggleSidebar} className="ml-2 text-sm font-medium cairo">اعدادات المنيو</span>

                            </Link>
                            <Link onClick={toggleSidebar} className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" to={"account-management"}>

                                <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="ml-2 text-sm font-medium cairo">اعدادات الحساب</span>

                            </Link>
                            <a className="flex relative items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300">
                                <div className="coming-soon absolute flex justify-end items-center px-2 inset-0 bg-slate-500/10">
                                    <p className='cairo text-green-700'>قريباّ</p>
                                </div>
                                <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                </svg>
                                <span className="ml-2 text-sm font-medium cairo">الطلبات</span>
                            </a>
                            <a className="flex relative items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300">
                                <div className="coming-soon absolute flex justify-end items-center px-2 inset-0 bg-slate-500/10">
                                    <p className='cairo text-green-700'>قريباّ</p>
                                </div>
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    {/* Boy symbol (circle with arrow) */}
                                    <circle cx="8" cy="10" r="3" />
                                    <path d="M8 13v4m0 0h3m-3 0H5" />

                                    {/* Girl symbol (circle with cross) */}
                                    <circle cx="16" cy="10" r="3" />
                                    <path d="M16 13v4m0 0h3m-3 0h-3" />
                                    <path d="M13 16h6" />
                                </svg>                                <span className="ml-2 text-sm font-medium cairo">الحجوزات</span>
                            </a>
                            <a className="relative flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                <div className="coming-soon absolute flex justify-end items-center px-2 inset-0 bg-slate-500/10">
                                    <p className='cairo text-green-700'>قريباّ</p>
                                </div>

                                <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <span className="ml-2 text-sm font-medium cairo">الرسائل</span>
                                {/* <span className="absolute top-0 left-0 w-2 h-2 mt-2 ml-2 bg-indigo-500 rounded-full"></span> */}
                            </a>
                        </div>
                    </div>



                </div>

            )}
        </div>


    </>
}
