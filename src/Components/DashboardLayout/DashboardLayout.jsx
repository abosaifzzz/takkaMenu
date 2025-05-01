import React, { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import DashSideBar from '../DashSideBar/DashSideBar'
import DashNavbar from '../DashNavbar/DashNavbar'

export default function DashboardLayout() {
    const [outletKey, setOutletKey] = useState(0);
    const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

    // This function will force the Outlet to reload
    const reloadOutlet = useCallback(() => {
        setOutletKey(prevKey => prevKey + 1);
    }, []);
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


            <DashSideBar
                sidebarIsOpen={sidebarIsOpen}
                toggleSidebar={toggleSidebar}
                reloadOutlet={reloadOutlet}  // Pass the reload function
            />
            <div className={`second-side transition-all duration-300 ${sidebarIsOpen ? 'lg:w-[85%] w-[80%] ms-[20%] lg:ms-[15%]' : 'w-full ms-0'
                }`}
            >
                <DashNavbar />

                <div className="content  bg-slate-100 ">

                    <Outlet key={outletKey} />

                </div>


            </div>

        </div>


    </>
}
