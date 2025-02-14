import React, { useEffect, useState } from 'react'
const mockReviewsData = [
    { id: 1, name: 'Mohamed Tarek Abo Saif', date: 'Friday 25 October', text: '"....الأكل حلو جدا و المكان شكله حلو و "', rating: 4 },
    { id: 2, name: 'Sara Ali', date: 'Saturday 26 October', text: '"....المكان نظيف و الطعام ممتاز"', rating: 5 },
    { id: 3, name: 'Omar Hossam', date: 'Sunday 27 October', text: '"الأسعار معقولة والخدمة ممتازة الأسعار معقولة والخدمة ممتازةالأسعار معقولة والخدمة ممتازةالأسعار معقولة والخدمة ممتازةالأسعار معقولة والخدمة ممتازةالأسعار معقولة والخدمة ممتازةالأسعار معقولة والخدمة ممتازةالأسعار معقولة والخدمة ممتازة الأسعار معقولة والخدمة ممتازة الأسعار معقولة  المكان نظيف و الطعام ممتاز والخدمة ممتازة"', rating: 3 },
    { id: 4, name: 'Laila Ahmed', date: 'Monday 28 October', text: '"....الطعام جيد والخدمة بطيئة قليلاً"', rating: 2 }];
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

    const Review = ({ name, date, text, rating }) => {
        return (
            <div className="review mt-2  mb-7 p-4 rounded-md bg-sky-100 w-full">
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

                        <p><i className="fa-solid fa-envelope"></i> mohamedavos22332dsdfasdfdsdfsadadwfasd@gmail.com</p>
                        <p><i className="fa-solid fa-phone"></i> 0522668686889</p>

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


            <div className="personal-info md:w-2/3 w-full p-5 rounded-md bg-white shadow-lg h-fit">

                <div className="review w-full  p-0       rounded-md ">
                    <div className="review-owner-rate">

                        <div className="rate">

                            <div className="reviews pt-3">
                                {
                                    reviews.slice(0, 3).map((review) => (
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
