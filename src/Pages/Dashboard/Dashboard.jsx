import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';


import rev from "../../assets/rev.png"
import rev2 from "../../assets/rev2.png"

import axios from 'axios';
import eats from '../../assets/eats-logo.png'
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';
const apiUrl = import.meta.env.VITE_API_URL;

// const mockReviewsData = [
//     { id: 1, name: 'Mohamed Tarek Abo Saif', date: 'Friday 25 October', text: '"....الأكل حلو جدا و المكان شكله حلو و "', rating: 4 },
//     { id: 2, name: 'Sara Ali', date: 'Saturday 26 October', text: '"....المكان نظيف و الطعام ممتاز"', rating: 5 },
//     { id: 3, name: 'Omar Hossam', date: 'Sunday 27 October', text: '"....الأسعار معقولة والخدمة ممتازة"', rating: 3 },
//     { id: 4, name: 'Laila Ahmed', date: 'Monday 28 October', text: '"....الطعام جيد والخدمة بطيئة قليلاً"', rating: 2 }];


// Simulated API function
// const fetchReviews = () => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(mockReviewsData);
//         }, 1000); // 1-second delay to simulate network latency
//     });
// };

export default function Dashboard() {

    const [reviews, setReviews] = useState([]); // State to hold reviews data
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [userName, setUserName] = useState("");
    const [dashboardloading, setDashboardLoading] = useState(true); // State to handle loading state
    const [menuVisits, setMenuVisits] = useState(""); // Stored Location URL

    const [menuData, setMenuData] = useState(""); // Stored Location URL
    const [menuSettings, setMenuSettings] = useState({
        name: "",
        end_time: "",
    });


    let m_id = localStorage.getItem("m_id")
    const menu_id = localStorage.getItem("menu") // Get  dynamically from the URL

    useEffect(() => {

        if (m_id) {
            fetchMenuSettings(m_id);
        }
    }, [m_id]); // Runs when 'menu_id' changes


    const fetchMenuSettings = async (m_id) => {

        try {
            // Fetch menu settings
            const response = await axios.get(`${apiUrl}/menu-settings/${m_id}`
            );



            // Set menu settings
            setMenuSettings(response.data.result);


            // Fetch profile image if it exists


        } catch (error) {
            console.error("Error fetching menu settings or images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setMenuSettings({ ...menuSettings, [e.target.name]: e.target.value });
    };




    const fetchMenuData = async (menu_id) => {
        try {
            // Fetch menu settings

            const response = await axios.get(`${apiUrl}/api/menu/${menu_id}`, {
                headers: authHeader(),
            });


            // Check if current time >= end_time (one-time check)
            // Set menu settings
            setMenuData(response.data.result);


        } catch (error) {
            toast.error("er")
            console.error("Error fetching menu settings or images:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchMenuVisits = async (menu_id) => {
        try {
            // Fetch menu settings

            const response = await axios.get(`${apiUrl}/api/menu/visits/${menu_id}`, {
                headers: authHeader(),
            });

            const visits = response.data.result

            setMenuVisits(visits)
            // Check if current time >= end_time (one-time check)
            // Set menu settings


        } catch (error) {
            toast.error("er")
            console.error("Error fetching menu visits", error);
        }
    };

    function authHeader() {
        const accessToken = localStorage.getItem("token");
        //  if (user && user.accessToken) {
        if (accessToken) {
            // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
            return { "x-access-token": accessToken }; // for Node.js Express back-end
        } else {
            return {};
        }
    }

    const fetchReviews = async (menu_id) => {
        try {
            const response = await axios.get(`${apiUrl}/api/menu/reviews/${menu_id}`);
            const result = response.data?.result || []
            setReviews(result)


            setLoading(false)
            return response.data; // Returns the reviews data from the API
        } catch (error) {
            if (error.response?.data?.message == "No reviews found for this menu") {
                setLoading(false)

            }

            // Return empty array or handle error as needed
            return [];
        }
    };
    useEffect(() => {
        // Fetch data when the component mounts
        fetchMenuData(menu_id)
        fetchMenuVisits(m_id)

        setTimeout(() => {
            setDashboardLoading(false)
        }, 500);
        fetchReviews(m_id)
    }, [m_id]);

    // const Review = ({ name, date, text, rating }) => {
    //     return (
    //         <div className="review mt-2   p-4 rounded-md bg-slate-100 w-full">
    //             <div className="first">
    //                 <div className="name-date w-full flex justify-between gap-2">
    //                     <p className='font-medium'>{name}</p>
    //                     <p className='text-sm text-gray-700'>{date}</p>
    //                 </div>
    //                 <p className='text-sm text-gray-500 font-medium cairo'>{text}</p>
    //                 <p>
    //                     {Array.from({ length: 5 }).map((_, i) => (
    //                         <i key={i} className={`fa-${i < rating ? 'solid' : 'regular'} fa-star text-amber-400`}></i>
    //                     ))}
    //                 </p>
    //             </div>
    //             <div className="second w-full flex gap-2 justify-end">
    //                 <button className='p-1 px-2 bg-white hover:bg-slate-200 rounded-md'>Remove</button>
    //                 <button className='p-1 px-2 bg-green-600 hover:bg-green-400 text-white rounded-md'>View</button>
    //             </div>
    //         </div>
    //     );
    // };



    useEffect(() => {
        const name = localStorage.getItem("name");  // Get name from localStorage
        if (name) {
            setUserName(name);
        }
    }, []);


    function getFormattedDate() {
        const now = new Date();
        const options = {
            weekday: 'long',    // يوم كامل (مثل "السبت")
            day: 'numeric',     // يوم رقمية
            month: 'long',      // شهر كامل (مثل "يناير")
            hour: '2-digit',    // ساعة بخانتين
            minute: '2-digit',  // دقيقة بخانتين
            numberingSystem: 'arab'  // استخدام الأرقام العربية
        };
        return now.toLocaleDateString('ar-EG', options).replace('،', ''); // استخدام الفاصلة العربية ثم إزالتها
    }
    return <>


        <Helmet>
            <meta charSet="utf-8" />
            <title>Takka Eats Dashboard</title>
            <link rel="canonical" href="https://eats.takkasmart.com/menu/dashboard" />
        </Helmet>
        {dashboardloading ? (
            <>
                <div className="dashboard-loading min-h-screen cairo animate-pulse flex justify-center items-center  bg-slate-50/75">
                    <div className="text-center">
                        <div
                            className="w-32 h-32 border-4 flex p-2 justify-center items-center border-dashed rounded-full animate-spin border-red-500 mx-auto"
                        >

                            <img src={eats} alt="" />


                        </div>

                    </div>


                </div>


            </>


        ) : (<div className="dashboard min-h-screen cairo sm:px-12 px-6 pb-16 py-8 ">
            <div className="first">

                <div className="name text-xl font-medium font-sans cairo"> اهلأ و سهلا <span className='text-sky-900'>{userName}</span>  </div>
                <div className="date">
                    <p className='font-thin cairo'>{getFormattedDate()}</p>


                </div>

                <div className="second mt-14 w-full  flex">

                    <div className="w-full   flex lg:flex-row flex-col  gap-5">
                        <div className="reports-reservations lg:w-1/2">
                            <div className="reports-section  p-3 bg-white rounded-lg ">
                                <div className="view-reports flex justify-between">
                                    <p className='mb-2 cairo'>اليوم</p>
                                    <p className='text-blue-500 cursor-pointer cairo'> <i className="fa-solid fa-receipt text-blue-500 me-1 "></i>  عرض التقرير</p>

                                </div>
                                <hr />
                                <div className="options">
                                    {/* <div className="f-row w-full justify-between gap-6  flex sm:flex-row flex-col mt-3">
                                        <div className="f-col pb-4 border-b  sm:w-1/2 justify-between flex  ">
                                            <div className="left">
                                                <span className=' font-sans sm:text-lg text-xl cairo text-gray-500'>الطلبات</span>
                                                <p className='mt-2 md:text-3xl sm:text-xl text-2xl font-[450]'>195</p>
                                            </div>
                                            <div className="right flex justify-end gap-2 items-center">
                                                <div className="ic flex justify-center items-center w-9 h-9 rounded-full bg-sky-500">
                                                    <i className="fa-solid fa-utensils text-white "></i>
                                                </div>


                                            </div>
                                        </div>
                                        <div className="f-col pb-4 border-b sm:w-1/2 justify-between flex ">
                                            <div className="left">

                                                <span className=' font-sans sm:text-lg text-xl cairo  text-gray-500'>عائد الطلبات</span>
                                                <p className='mt-2 md:text-2xl sm:text-xl text-xl font-[450]'>EGP 42,600</p>

                                            </div>
                                            <div className="right flex justify-end items-center">

                                                <div className="ic flex justify-center items-center w-9 h-9 rounded-full bg-red-500">
                                                    <i className="fa-solid text-white fa-coins"></i>

                                                </div>

                                            </div>
                                        </div>



                                    </div> */}
                                    <div className="s-row w-full justify-between gap-6  flex sm:flex-row flex-col mt-3">
                                        <div className="th-col pb-4 border-b sm:w-1/2 justify-between flex ">
                                            <div className="left">
                                                <span className=' font-sans sm:text-lg text-xl cairo  text-gray-500'>الزائرين</span>
                                                <p className='mt-2 md:text-2xl sm:text-xl text-xl font-[450]'>{menuVisits}</p>
                                                {/* <span><i className="fa-solid fa-users text-gray-500 me-2"></i></span> */}
                                            </div>
                                            <div className="right flex justify-end gap-2 items-center">
                                                <div className="ic flex justify-center items-center w-9 h-9 rounded-full bg-green-500">
                                                    <i className="fa-solid fa-users text-white "></i>
                                                </div>


                                            </div>
                                        </div>
                                        <div className="s-col pb-4 border-b sm:w-1/2 justify-between flex ">
                                            <div className="left">
                                                <span className=' font-sans text-lg cairo text-gray-500'>التقييمات</span>
                                                <p className='mt-2 text-3xl font-[450]'>{reviews.length}</p>
                                                {/* <span><i className="fa-solid fa-chart-column text-gray-500 me-2"></i></span> */}
                                            </div>
                                            <div className="right flex justify-end items-center">
                                                <div className="ic flex justify-center items-center w-9 h-9 rounded-full bg-amber-500">

                                                    <i className="fa-solid fa-chart-column text-white"></i>
                                                </div>


                                            </div>
                                        </div>



                                    </div>


                                </div>





                            </div>





                        </div>

                        <div className="reviews-sections h-fit relative p-3 bg-white rounded-lg lg:w-1/2">
                            <div className="view-reviews flex justify-between">
                                <p className='mb-2 cairo'>التقييمات الأخيرة</p>
                                <Link to={"/customer-reviews"}>
                                    <p className='text-blue-500 cairo font-semibold cursor-pointer'>
                                        <i className="fa-regular fa-eye text-blue-500 me-1"></i> عرض الكل
                                    </p>
                                </Link>
                            </div>
                            <hr />
                            <div className="reviews max-h-[300px] overflow-hidden pt-3">
                                {loading ? (
                                    <>

                                        <div className="reviews-loading flex flex-col gap-5 ">

                                            <div className="flex flex-row gap-2">
                                                <div className="animate-pulse flex justify-center items-center bg-gray-300 w-32 h-32 rounded-lg">

                                                    <img src={rev} alt="" />

                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="animate-pulse bg-gray-300 w-56 h-8 rounded-lg"></div>
                                                    <div className="animate-pulse bg-gray-300 w-60 h-5 rounded-lg"></div>
                                                    <div className="animate-pulse bg-gray-300 w-60 h-4 rounded-lg"></div>
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <div className="animate-pulse flex justify-center items-center bg-gray-300 w-32 h-32 rounded-lg">

                                                    <img src={rev} alt="" />

                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="animate-pulse bg-gray-300 w-56 h-8 rounded-lg"></div>
                                                    <div className="animate-pulse bg-gray-300 w-60 h-5 rounded-lg"></div>
                                                    <div className="animate-pulse bg-gray-300 w-60 h-4 rounded-lg"></div>
                                                </div>
                                            </div>
                                        </div>


                                    </>

                                    // Show loading text while data is being fetched
                                ) : (
                                    <div className="personal-info flex-col gap-3  w-full mt-6">
                                        {reviews.length > 0 ? (
                                            reviews.slice(0, 12).map((review) => (
                                                <div key={review.id} className="review bg-slate-100 border-2 mb-5 p-4 rounded-md shadow-md ">
                                                    <div className="flex justify-between items-start  mb-2">
                                                        <p className='font-medium text-gray-800'>
                                                            {review.client_name || 'Anonymous Customer'}
                                                        </p>
                                                        <div className="flex">
                                                            {[...Array(5)].map((_, i) => (
                                                                <i
                                                                    key={i}
                                                                    className={`fa-${i < review.rate ? 'solid' : 'regular'} fa-star text-amber-400`}
                                                                ></i>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <p className='text-sm text-gray-600 w-full  break-words whitespace-pre-line mb-3 cairo'>{review.comment}</p>
                                                    <p className='text-xs text-gray-500 cairo  '>
                                                        {new Date(review.createdAt).toLocaleDateString('ar-EG', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>

                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-3 border-t border-gray-100">
                                                        <div className="flex flex-wrap items-center gap-4 text-sm mb-3 md:mb-0">
                                                            {review.client_name && (
                                                                <p className="text-gray-600">
                                                                    <i className="fa-solid fa-user mr-1"></i> {review.client_name}
                                                                </p>
                                                            )}
                                                            {review.client_phone && (
                                                                <a href={`tel:${review.client_phone}`} className="text-blue-500 hover:text-blue-700">
                                                                    <i className="fa-solid fa-phone mr-1"></i> {review.client_phone}
                                                                </a>
                                                            )}
                                                        </div>


                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center flex flex-col justify-center items-center bg-white rounded-md shadow-md">
                                                <img className='w-12' src={rev2} alt="" />
                                                <p className="text-gray-500  cairo">لا يوجد تقييمات</p>
                                            </div>
                                        )}
                                    </div>)}
                            </div>
                            {reviews.length > 3 && (
                                <div className="view-all bg-white/40 absolute flex justify-center items-center bottom-0 left-0 right-0 h-11 backdrop-blur-sm">
                                    <Link to={"/customer-reviews"}>

                                        <p className='font-medium cursor-pointer cairo'> اضغط هنا لعرض الكل</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>



                </div>
                <div className="third mt-4 p-3 bg-white rounded-lg shadow-sm">
                    <div className="view-reports flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <p className='mb-0 cairo text-lg font-medium text-gray-800'>الأستخدامات الشائعة</p>
                        <Link to={"/menu-management"}>
                            <p className='text-blue-500 hover:text-blue-600 cursor-pointer cairo text-sm sm:text-base transition-colors'>
                                <i className="fa-solid fa-receipt text-blue-500 me-1"></i>لوحة التحكم
                            </p>
                        </Link>
                    </div>

                    <hr className='my-3 border-gray-100' />

                    <div className="options">
                        <div className="flex flex-col lg:flex-row gap-4 mt-3">
                            {/* Menu Activity Card */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 flex-1">
                                <div className="r mb-3 sm:mb-0 sm:w-2/3">
                                    <span className='block cairo text-lg font-medium text-gray-800'>نشاط المنيو</span>
                                    <p className='text-xs sm:text-sm text-gray-500 mt-1'>
                                        يمكنك اغلاق المنيو مؤقتاّ بالكامل و اخفاء جميع بياناته
                                    </p>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer min-w-[3rem]">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={menuData?.is_closed || false}
                                        onChange={async () => {
                                            try {
                                                const newStatus = !menuData?.is_closed;
                                                await axios.post(`${apiUrl}/api/menu/update/${m_id}`, {
                                                    is_closed: newStatus
                                                }, {
                                                    headers: authHeader(),
                                                });
                                                setMenuData(prev => ({ ...prev, is_closed: newStatus }));
                                                toast.success(newStatus ? "تم تنشيط المنيو" : "تم الغاء تنشيط المنيو");
                                            } catch (error) {
                                                toast.error("Failed to update menu status");
                                                console.error("Error updating menu status:", error);
                                            }
                                        }}
                                    />
                                    <div className={`
            group peer rounded-full duration-300 w-12 h-6 ring-2 
            ${menuData?.is_closed ? 'bg-green-500 ring-green-300' : 'bg-gray-300 ring-gray-300'}
            after:duration-300 after:bg-white after:rounded-full after:absolute 
            after:h-5 after:w-5 after:top-[2px] after:left-[2px]
            ${menuData?.is_closed ? 'after:translate-x-6' : ''}
            peer-hover:after:scale-95
          `}></div>
                                </label>
                            </div>

                            {/* End Day Card */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 flex-1">
                                <div className="r mb-3 sm:mb-0 sm:w-2/3">
                                    <span className='block cairo text-lg font-medium text-gray-800'>انهاء اليوم</span>
                                    <p className='text-xs sm:text-sm text-gray-500 mt-1'>
                                        يمكنك اغلاق الطلبات و تنبيه العميل بأنتهاء مواعيد العمل مع عرض المنيو
                                    </p>
                                </div>

                                <div className="w-full sm:w-auto">
                                    <input
                                        type="time"
                                        name="end_time"
                                        value={menuSettings.end_time}
                                        onChange={handleChange}
                                        id="close-time"
                                        className="w-full sm:w-32 h-10 border border-gray-300 rounded-md px-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>





            </div>










        </div>)}






    </>
}
