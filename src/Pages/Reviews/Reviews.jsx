import React, { useEffect, useState } from 'react'
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
const fetchReviews = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockReviewsData);
        }, 1000); // 1-second delay to simulate network latency
    });
};

export default function Reviews() {
    const [reviews, setReviews] = useState([]); // State to hold reviews data

    useEffect(() => {
        // Fetch data when the component mounts
        fetchReviews().then((data) => {
            setReviews(data);
        });
    }, []);

    const Review = ({ name, date, text, rating, email, phone }) => {
        return (
            <div className="review mt-2  mb-7 p-4 rounded-md shadow-md bg-white w-full">
                <div className="first">
                    <div className="name-date w-full flex justify-between gap-2">
                        <p className='font-medium'>{name}</p>
                        <p>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <i key={i} className={`fa-${i < rating ? 'solid' : 'regular'} fa-star text-amber-400`}></i>
                            ))}
                        </p>
                    </div>

                    <p className='text-sm text-gray-500 font-medium cairo'>{text}</p>



                </div>
                <p className='text-sm text-gray-700'>{date}</p>

                <div className="last md:flex items-center justify-between">
                    <div className="review-data flex flex-wrap items-center gap-5  text-ellipsis overflow-hidden whitespace-nowrap md:w-3/4">

                        <p><i className="fa-solid fa-envelope"></i> {email}</p>
                        <p><i className="fa-solid fa-phone"></i> {phone}</p>

                    </div>
                    <div className="second w-1/4  flex gap-2 justify-end">
                        <button className='p-1 px-2 bg-red-500 text-white hover:bg-red-600 rounded-md'>Remove</button>
                        {/* <button className='p-1 px-2 bg-green-600 hover:bg-green-400 text-white rounded-md'>View</button> */}
                    </div>

                </div>

            </div>
        );
    };
    return <>


        <div className="reviews-page min-h-screen relative pb-20 flex flex-col md:p-10 p-5">

            <p className='text-lg pb-4 font-medium text-gray-700'>Customer Reviews</p>


            <div className="personal-info md:w-2/3 w-full p-5 rounded-md bg-slate-50 shadow-lg h-fit">

                <div className="review w-full  p-0       rounded-md ">
                    <div className="review-owner-rate">

                        <div className="rate">

                            <div className="reviews pt-3">
                                {
                                    reviews.slice(0, 12).map((review) => (
                                        <Review key={review.id} {...review} />
                                    ))
                                }
                            </div>

                        </div>




                    </div>
                </div>
            </div>

        </div>



    </>

}
