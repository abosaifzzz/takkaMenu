import axios from 'axios';
import React, { useEffect, useState } from 'react'
import rev2 from "../../assets/rev2.png"
const mockReviewsData = [
    {
        id: 1,
        name: 'Mohamed Tarek Abo Saif',
        date: 'Friday 25 October',
        text: '"الأكل حلو جدا والمكان شكله حلو وإن شاء الله مش آخر مرة"',
        rating: 4,
        phone: "01015336644",
        email: "mohamedtarek@gmail.com"
    },
    {
        id: 2,
        name: 'Sara Ali',
        date: 'Saturday 26 October',
        text: '"المكان نظيف والطعام ممتاز والخدمة سريعة"',
        rating: 5,
        phone: "01265449585",
        email: "saraali@gmail.com"
    },
    {
        id: 3,
        name: 'Omar Hossam',
        date: 'Sunday 27 October',
        text: '"الأسعار معقولة والخدمة ممتازة ولكن المكان كان مزدحماً"',
        rating: 3,
        phone: "01111165826",
        email: "omar22@gmail.com"
    },
    {
        id: 4,
        name: 'Laila Ahmed',
        date: 'Monday 28 October',
        text: '"الطعام جيد ولكن الخدمة كانت بطيئة قليلاً"',
        rating: 2,
        phone: "01536869297",
        email: "lailaelnasr@gmail.com"
    },
    {
        id: 5,
        name: 'Ahmed Samy',
        date: 'Tuesday 29 October',
        text: '"أفضل وجبة تناولتها هذا الشهر! الطهاة هنا محترفون"',
        rating: 5,
        phone: "01002345789",
        email: "ahmedsamy@yahoo.com"
    },
    {
        id: 6,
        name: 'Nada Walid',
        date: 'Wednesday 30 October',
        text: '"التوصيل تأخر كثيراً ولكن الطعام كان ساخناً ولذيذاً"',
        rating: 3,
        phone: "01234567890",
        email: "nada.walid@hotmail.com"
    },
    {
        id: 7,
        name: 'Karim Adel',
        date: 'Thursday 31 October',
        text: '"الكمية أقل من المتوقع بالنسبة للسعر المدفوع"',
        rating: 2,
        phone: "01112223334",
        email: "karim.adel@gmail.com"
    },
    {
        id: 8,
        name: 'Yasmine Fouad',
        date: 'Friday 1 November',
        text: '"تجربة رائعة! سأعود بالتأكيد مع أصدقائي"',
        rating: 5,
        phone: "01098765432",
        email: "yasmine.f@gmail.com"
    },
    {
        id: 9,
        name: 'Hassan Mahmoud',
        date: 'Saturday 2 November',
        text: '"الطعام جيد ولكن يحتاج المزيد من التنوع في القائمة"',
        rating: 3,
        phone: "01555666777",
        email: "hassan.mahmoud@outlook.com"
    },
    {
        id: 10,
        name: 'Farida Mostafa',
        date: 'Sunday 3 November',
        text: '"أسوأ تجربة منذ فترة طويلة، الطعام كان بارداً وغير طازج"',
        rating: 1,
        phone: "01234560000",
        email: "farida.m@example.com"
    },
    {
        id: 11,
        name: 'Tamer Hosny',
        date: 'Monday 4 November',
        text: '"الخدمة كانت سريعة والموظفون لطفاء جداً"',
        rating: 4,
        phone: "01001001001",
        email: "tamer.h@example.com"
    },
    {
        id: 12,
        name: 'Dalia Kamal',
        date: 'Tuesday 5 November',
        text: '"الحلويات كانت رائعة جداً، أنصح بتجربتها"',
        rating: 5,
        phone: "01119998877",
        email: "dalia.k@example.com"
    }
];
export default function Reviews() {
    const [reviews, setReviews] = useState([]); // State to hold reviews data
    const [reviewsLoading, setReviewsLoading] = useState(true); // State to handle loading state


    let m_id = localStorage.getItem("m_id")

    const fetchReviews = async (menu_id) => {
        try {
            const response = await axios.get(`http://localhost:234/api/menu/reviews/${menu_id}`);
            console.log(response);

            setReviews(response.data)
            console.log(reviews);

            return response.data; // Returns the reviews data from the API
        } catch (error) {
            console.error('Error fetching reviews:', error);
            // Return empty array or handle error as needed
            return [];
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setReviewsLoading(false)
        }, 500);

        // Fetch data when the component mounts
        fetchReviews(m_id)
    }, [m_id]);





    return <>
        {reviewsLoading ? (<>
            <div className="reviews-loading min-h-screen animate-pulse flex justify-center items-center  bg-slate-50/75">
                <div className="text-center">
                    <div
                        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500 mx-auto"
                    ></div>

                </div>



            </div>

        </>) : (
            <div className="reviews-page min-h-screen relative pb-20 flex flex-col md:p-10 p-5 bg-gray-50">
                <h2 className='text-2xl pb-4 font-semibold cairo text-gray-800 border-b border-gray-200'>
                    تقييمات العملاء
                    {reviews.length > 0 && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            ({reviews.length} reviews)
                        </span>
                    )}
                </h2>

                <div className="personal-info md:w-2/3 w-full mt-6">
                    {reviews.length > 0 ? (
                        reviews.slice(0, 12).map((review) => (
                            <div key={review.id} className="review mb-6 p-4 rounded-md shadow-md bg-white">
                                {/* Review Header */}
                                <div className="flex justify-between items-start mb-2">
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

                                {/* Review Content */}
                                <p className='text-sm text-gray-600 mb-3'>{review.comment}</p>
                                <p className='text-xs text-gray-500 mb-4'>
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>

                                {/* Review Footer */}
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

                                    <div className="flex gap-2">
                                        <button className='py-1 px-3 bg-red-500 text-white hover:bg-red-600 rounded-md text-sm'>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 py-32 text-center flex flex-col justify-center items-center bg-white rounded-md shadow-md">

                            <img src={rev2} className='w-32' alt="" />
                            <p className="text-gray-500 cairo">لا يوجد تقيمات حتي الأن</p>
                        </div>
                    )}
                </div>

                {reviews.length > 12 && (
                    <div className="mt-6 text-center">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Load More Reviews
                        </button>
                    </div>
                )}
            </div>

        )}





    </>

}
