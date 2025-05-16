import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function DashNavbar() {
    const [userIcon, setUserIcon] = useState("");
    const [isSettingsOpen, setSettingsOpen] = useState(false);  // State to manage settings visibility


    const toggleSettings = () => {
        setSettingsOpen(!isSettingsOpen);  // Toggle the settings visibility
    };
    const signOut = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("name")
        localStorage.removeItem("owner")
        localStorage.removeItem("menu")
        localStorage.removeItem("m_id")
        localStorage.removeItem("email")
        localStorage.removeItem("mobile")

        localStorage.removeItem("menu_id")
        localStorage.removeItem("provider")
        localStorage.removeItem("uId")


        toast.loading("جاري تسجيل الخروج ..")
        setTimeout(() => {
            window.location.href = "/login";  // Redirect to dashboard

        }, 2000);


    };

    useEffect(() => {
        const name = localStorage.getItem("name");  // Get name from localStorage
        if (name) {
            const capitalizedName = name.charAt(0).toUpperCase()

            setUserIcon(capitalizedName);
        }
    }, []);
    return <>
        <Toaster />
        <div className="new-menu-nav bg-gray-100 border-b-2 border-slate-300 rounded-b-lg  flex justify-end items-center">
            <div onClick={toggleSettings}
                className="name-icon relative   p-5 px-9">

                <div className={`icon cursor-pointer relative w-8 h-8 rounded-full flex justify-center items-center bg-sky-300 ${isSettingsOpen ? 'border-2 border-sky-700' : 'border-none'
                    }`}>
                    <p className='text-sky-700'>{userIcon}</p>
                    <div className="arrow absolute -right-4">
                        <i className="fa-solid text-xs text-sky-800 fa-chevron-down"></i>
                    </div>

                    {isSettingsOpen && (
                        <div className={`user-settings z-40 absolute border-2 rounded-md -bottom-40 -left-7 w-44 bg-white transition-all duration-500 ease-out ${isSettingsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                            }`}
                        >
                            <p className="cairo cursor-pointer flex gap-2 items-center p-2 text-sm hover:bg-gray-200 border-b border-sky-200">
                                <i className="text-gray-600 fa-solid fa-user"></i> اعدادات الحساب
                            </p>
                            <p className="cairo cursor-pointer flex gap-2 items-center p-2 text-sm hover:bg-gray-200 border-b border-sky-200">
                                <i className="text-gray-600 fa-solid fa-bars"></i> اعدادات المنيو
                            </p>
                            <p className="cairo cursor-pointer flex gap-2 items-center p-2 text-sm hover:bg-gray-200 border-b border-sky-200">
                                <i className="text-gray-600 fa-solid fa-headset"></i> مركز المساعدة
                            </p>
                            <p onClick={signOut} className="cairo cursor-pointer flex gap-2 items-center p-2 text-sm hover:bg-gray-200 border-b border-sky-200">
                                <i className="text-gray-600 fa-solid fa-right-from-bracket"></i> تسجيل الخروج
                            </p>
                        </div>
                    )}

                </div>




            </div>

        </div>

        {/* <div className="nav  flex p-4 px-12 items-center bg-white shadow-sm shadow-red-400 h-20 ">

            <p className='text-xl font-bold'>                Mekato Resturant
            </p>
            <div className="personal">




            </div>


        </div> */}
    </>
}
