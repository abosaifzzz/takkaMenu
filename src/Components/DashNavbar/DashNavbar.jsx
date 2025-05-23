import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import logo from "../../assets/eats-logo.png"
import { Link } from 'react-router-dom';

export default function DashNavbar() {
    const [userIcon, setUserIcon] = useState("");
    const [isSettingsOpen, setSettingsOpen] = useState(false);  // State to manage settings visibility

    const [contactUs, setContactUs] = useState(false);

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
        {contactUs && (
            <div
                className="contact-us-modal fixed inset-0 bg-black/25 flex justify-center items-center z-50"
                onClick={() => setContactUs(false)} // Close when clicking backdrop
            >
                <div
                    className="w-full md:w-1/3 bg-white flex flex-col gap-6 p-8 rounded-md shadow-xl relative mx-4"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setContactUs(false)}
                        className="absolute top-4 left-4 text-lg cursor-pointer focus:outline-none"
                        aria-label="Close modal"
                    >
                        ×
                    </button>

                    {/* Social Media Section */}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold cairo mb-4">سوشيال ميديا</h3>
                        <div className="flex justify-center gap-4">
                            {[
                                { icon: 'fa-whatsapp', url: 'https://wa.me/01016420204' },
                                { icon: 'fa-facebook-f', url: 'https://facebook.com' },
                                { icon: 'fa-instagram', url: 'https://instagram.com' }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-sky-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors"
                                    aria-label={social.icon.replace('fa-', '')}
                                >
                                    <i className={`fa-brands text-white ${social.icon}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Phone Section */}
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">او الاتصال علي:</h3>
                        <div className="flex items-center justify-center gap-3">
                            <p className="text-lg">01016420204</p>
                            <a
                                href="tel:01016420204"
                                className="w-10 h-10 bg-sky-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-colors"
                                aria-label="Call"
                            >
                                <i className="fa-solid fa-phone-volume text-white"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )}
        <div className="new-menu-nav bg-gray-100 border-b-2 border-slate-300 rounded-b-lg  flex  justify-between items-center">
            <div className="div"></div>


            <div className="logo ps-5">

                <img src={logo} className='w-14' alt="" />
            </div>
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

                            <Link to={"/account-management"}>
                                <p className="cairo cursor-pointer flex gap-2 items-center p-2 text-sm hover:bg-gray-200 border-b border-sky-200">

                                    <i className="text-gray-600 fa-solid fa-user"></i> اعدادات الحساب
                                </p>
                            </Link>
                            <Link to={"/menu-settings"}>
                                <p className="cairo cursor-pointer flex gap-2 items-center p-2 text-sm hover:bg-gray-200 border-b border-sky-200">
                                    <i className="text-gray-600 fa-solid fa-bars"></i> اعدادات المنيو
                                </p>
                            </Link>
                            <p onClick={() => setContactUs(true)}
                                className="cairo cursor-pointer flex gap-2 items-center p-2 text-sm hover:bg-gray-200 border-b border-sky-200">
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
