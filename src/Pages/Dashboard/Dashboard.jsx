import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
const mockReviewsData = [
    { id: 1, name: 'Mohamed Tarek Abo Saif', date: 'Friday 25 October', text: '"....الأكل حلو جدا و المكان شكله حلو و "', rating: 4 },
    { id: 2, name: 'Sara Ali', date: 'Saturday 26 October', text: '"....المكان نظيف و الطعام ممتاز"', rating: 5 },
    { id: 3, name: 'Omar Hossam', date: 'Sunday 27 October', text: '"....الأسعار معقولة والخدمة ممتازة"', rating: 3 },
    { id: 4, name: 'Laila Ahmed', date: 'Monday 28 October', text: '"....الطعام جيد والخدمة بطيئة قليلاً"', rating: 2 }];

// Simulated API function
const fetchReviews = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockReviewsData);
        }, 1000); // 1-second delay to simulate network latency
    });
};

export default function Dashboard() {

    const [reviews, setReviews] = useState([]); // State to hold reviews data
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // Fetch data when the component mounts
        fetchReviews().then((data) => {
            setReviews(data);
            setLoading(false); // Turn off loading once data is fetched
        });
    }, []);

    const Review = ({ name, date, text, rating }) => {
        return (
            <div className="review mt-2   p-4 rounded-md bg-slate-100 w-full">
                <div className="first">
                    <div className="name-date w-full flex justify-between gap-2">
                        <p className='font-medium'>{name}</p>
                        <p className='text-sm text-gray-700'>{date}</p>
                    </div>
                    <p className='text-sm text-gray-500 font-medium cairo'>{text}</p>
                    <p>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <i key={i} className={`fa-${i < rating ? 'solid' : 'regular'} fa-star text-amber-400`}></i>
                        ))}
                    </p>
                </div>
                <div className="second w-full flex gap-2 justify-end">
                    <button className='p-1 px-2 bg-white hover:bg-slate-200 rounded-md'>Remove</button>
                    <button className='p-1 px-2 bg-green-600 hover:bg-green-400 text-white rounded-md'>View</button>
                </div>
            </div>
        );
    };



    useEffect(() => {
        const name = localStorage.getItem("name");  // Get name from localStorage
        if (name) {
            setUserName(name);
        }
    }, []);


    function getFormattedDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        return now.toLocaleDateString('en-GB', options).replace(',', ''); // Remove comma after the day
    }
    return <>
        <div className="dashboard min-h-screen px-12 py-8 ">
            <div className="first">

                <div className="name text-xl font-medium font-sans"> Welcome, {userName}  </div>
                <div className="date">
                    <p className='font-thin'>{getFormattedDate()}</p>


                </div>
                <div className="second mt-14 flex">
                    <div className="w-4/5 flex gap-5">
                        <div className="reports-reservations w-1/2">
                            <div className="reports-section  p-3 bg-white rounded-lg ">
                                <div className="view-reports flex justify-between">
                                    <p className='mb-2'>Today</p>
                                    <p className='text-blue-500 cursor-pointer'> <i className="fa-solid fa-receipt text-blue-500 me-1"></i>  View Report</p>

                                </div>
                                <hr />
                                <div className="options">
                                    <div className="f-row w-full justify-between gap-6  flex mt-3">
                                        <div className="f-col pb-4 border-b w-1/2 justify-between flex ">
                                            <div className="left">
                                                <span><i className="fa-solid fa-utensils text-gray-500 me-2"></i></span><span className=' font-sans text-lg  text-gray-500'>Orders</span>
                                                <p className='mt-2 text-3xl font-[450]'>195</p>

                                            </div>
                                            <div className="right flex justify-end gap-2 items-center">
                                                <i class="fa-solid fa-arrow-down"></i>

                                                <p className='text-red-500 text-lg'>23.5 %</p>


                                            </div>
                                        </div>
                                        <div className="f-col pb-4 border-b w-1/2 justify-between flex ">
                                            <div className="left">
                                                <span><i className="fa-solid fa-users text-gray-500 me-2"></i></span><span className=' font-sans text-lg  text-gray-500'>Orders Income</span>
                                                <p className='mt-2 text-2xl font-[450]'>EGP 42,600</p>

                                            </div>
                                            <div className="right flex justify-end items-center">
                                                <p className='text-gray-500 text-lg'>68 %</p>


                                            </div>
                                        </div>



                                    </div>
                                    <div className="s-row w-full justify-between gap-6  flex mt-3">
                                        <div className="th-col pb-4 border-b w-1/2 justify-between flex ">
                                            <div className="left">
                                                <span><i className="fa-solid fa-users text-gray-500 me-2"></i></span><span className=' font-sans text-lg  text-gray-500'>Visitors</span>
                                                <p className='mt-2 text-3xl font-[450]'>236</p>

                                            </div>
                                            <div className="right flex justify-end gap-2 items-center">
                                                <i class="fa-solid fa-arrow-up"></i>
                                                <p className='text-green-500 text-lg'>73.2 %</p>


                                            </div>
                                        </div>
                                        <div className="s-col pb-4 border-b w-1/2 justify-between flex ">
                                            <div className="left">
                                                <span><i className="fa-solid fa-chart-column text-gray-500 me-2"></i></span><span className=' font-sans text-lg  text-gray-500'>Reviews</span>
                                                <p className='mt-2 text-3xl font-[450]'>56</p>

                                            </div>
                                            <div className="right flex justify-end items-center">
                                                <p className='text-green-500 text-lg'>59.9 %</p>


                                            </div>
                                        </div>



                                    </div>


                                </div>





                            </div>





                        </div>

                        <div className="reviews-sections h-fit relative p-3 bg-white rounded-lg w-1/2">
                            <div className="view-reviews flex justify-between">
                                <p className='mb-2'>Recent Reviews</p>
                                <Link to={"/customer-reviews"}>
                                    <p className='text-blue-500 cursor-pointer'>
                                        <i className="fa-regular fa-eye text-blue-500 me-1"></i> View All
                                    </p>
                                </Link>
                            </div>
                            <hr />
                            <div className="reviews pt-3">
                                {loading ? (
                                    <p>Loading reviews...</p> // Show loading text while data is being fetched
                                ) : (
                                    reviews.slice(0, 3).map((review) => (
                                        <Review key={review.id} {...review} />
                                    ))
                                )}
                            </div>
                            {reviews.length > 3 && (
                                <div className="view-all bg-white/40 absolute flex justify-center items-center bottom-0 left-0 right-0 h-11 backdrop-blur-sm">
                                    <Link to={"/customer-reviews"}>

                                        <p className='font-medium cursor-pointer '>Click here to View all</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>
                    <div className="w-1/5"></div>



                </div>




            </div>










        </div>



    </>
}
