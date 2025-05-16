import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';


import rev from "../../assets/rev.png"
import rev2 from "../../assets/rev2.png"

import axios from 'axios';
import eats from '../../assets/eats-logo.png'
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



    let m_id = localStorage.getItem("m_id")

    const fetchReviews = async (menu_id) => {
        try {
            const response = await axios.get(`${apiUrl}/api/menu/reviews/${menu_id}`);
            console.log("reviii", response);

            console.log("reviews", reviews);
            const result = response.data?.result || []
            setReviews(result)


            setLoading(false)
            return response.data; // Returns the reviews data from the API
        } catch (error) {
            if (error.response?.data?.message == "No reviews found for this menu") {

                console.log("nooooooo rev");
                setLoading(false)

            }

            console.error('Error fetching reviews:', error);
            // Return empty array or handle error as needed
            return [];
        }
    };
    useEffect(() => {
        // Fetch data when the component mounts
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
        {dashboardloading ? (
            <>
                <div className="dashboard-loading min-h-screen animate-pulse flex justify-center items-center  bg-slate-50/75">
                    <div className="text-center">
                        <div
                            className="w-32 h-32 border-4 flex p-2 justify-center items-center border-dashed rounded-full animate-spin border-red-500 mx-auto"
                        >

                            <img src={eats} alt="" />


                        </div>

                    </div>


                </div>


            </>


        ) : (<div className="dashboard min-h-screen sm:px-12 px-6 pb-16 py-8 ">
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
                                    <div className="f-row w-full justify-between gap-6  flex sm:flex-row flex-col mt-3">
                                        <div className="f-col pb-4 border-b  sm:w-1/2 justify-between flex  ">
                                            <div className="left">
                                                <span className=' font-sans sm:text-lg text-xl cairo text-gray-500'>الطلبات</span>
                                                <p className='mt-2 md:text-3xl sm:text-xl text-2xl font-[450]'>195</p>
                                                {/* <span><i className="fa-solid fa-utensils text-gray-500 me-2"></i></span> */}
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
                                                {/* <span><i className="fa-solid fa-users text-gray-500 me-2"></i></span> */}
                                                <p className='mt-2 md:text-2xl sm:text-xl text-xl font-[450]'>EGP 42,600</p>

                                            </div>
                                            <div className="right flex justify-end items-center">

                                                <div className="ic flex justify-center items-center w-9 h-9 rounded-full bg-red-500">
                                                    <i class="fa-solid text-white fa-coins"></i>

                                                </div>

                                            </div>
                                        </div>



                                    </div>
                                    <div className="s-row w-full justify-between gap-6  flex sm:flex-row flex-col mt-3">
                                        <div className="th-col pb-4 border-b sm:w-1/2 justify-between flex ">
                                            <div className="left">
                                                <span className=' font-sans sm:text-lg text-xl cairo  text-gray-500'>الزائرين</span>
                                                <p className='mt-2 md:text-2xl sm:text-xl text-xl font-[450]'>236</p>
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
                                                <p className='mt-2 text-3xl font-[450]'>56</p>
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
                                            <div className="p-6 text-center flex flex-col justify-center items-center bg-white rounded-md shadow-md">
                                                <img src={rev2} alt="" />
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




            </div>










        </div>)}






    </>
}
