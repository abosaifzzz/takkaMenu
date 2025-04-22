import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import DashSideBar from '../DashSideBar/DashSideBar'
import DashNavbar from '../DashNavbar/DashNavbar'

export default function DashboardLayout() {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

    // Function to toggle the sidebar
    const toggleSidebar = () => {
        setSidebarIsOpen(prevState => !prevState);
        console.log("clicked");


    };
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1000) {
                setSidebarIsOpen(false);
            } else {
                setSidebarIsOpen(true); // Optionally open it back for larger screens
            }
        };

        // Initial check
        handleResize();

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return <>
        <div dir='rtl' className="dash-layout  bg-slate-100 relative flex">


            <DashSideBar sidebarIsOpen={sidebarIsOpen} toggleSidebar={toggleSidebar} />

            <div className={`second-side transition-all duration-300 ${sidebarIsOpen ? 'w-[85%] ms-[15%]' : 'w-full ms-0'
                }`}
            >


                <DashNavbar />

                <div className="content  bg-slate-100 ">

                    <Outlet></Outlet>

                </div>


            </div>

        </div>


    </>
}
