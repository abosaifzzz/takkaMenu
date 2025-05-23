
import React, { useEffect, useRef, useState } from 'react'
import q from "../../assets/q.webp"
import ui1 from "../../assets/ui1.png"
import ui2 from "../../assets/ui2.png"
import ui4 from "../../assets/ui4.jpeg"

import u3 from "../../assets/u3.png"
import ad2 from "../../assets/Ad2.png"


import check from "../../assets/check.png"

import qr1 from "../../assets/qr1.jpeg"
import qr2 from "../../assets/qr2.jpeg"
import qr3 from "../../assets/qr3.jpeg"
import qr4 from "../../assets/qr4.jpeg"

import qr5 from "../../assets/qr5.jpeg"
import qr6 from "../../assets/qr6.jpeg"
import qr7 from "../../assets/qr7.jpeg"
import qr8 from "../../assets/qr8.jpeg"
import qr9 from "../../assets/qr9.jpeg"
import qr10 from "../../assets/qr10.jpeg"


import q2 from "../../assets/q2.webp"
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'


export default function Home() {
    const tips = [
        "منيو رقمي ذكي للمطاعم •",
        "حلول ديجيتال مينيوز متكاملة •",
        "توفير الوقت والجهد •",
        "تقليل التكاليف التشغيلية •",
        "أتمتة تحديثات القائمة •",
        "إدارة سهلة للمكونات •",
        "ربط مباشر مع المطبخ •",
        "تقارير مبيعات ذكية •",
        "تحليل أكثر الأصناف مبيعاً •",
        "تحديث الأسعار فورياً •",
        "عروض وتخفيضات تلقائية •",
        "تكامل مع أنظمة الدفع •",
        "لوحة تحكم مركزية •",
        "لا حاجة لطباعة مينوهات •",
        "حلول صديقة للبيئة •",
        "تجربة عملاء مميزة •",
        "أوامر دقيقة بدون أخطاء •",
        "مزامنة مع التطبيقات •",
        "إشعارات فورية للطلبات •",
        "إدارة المخزون الذكية •",
        "تقليل الهدر الغذائي •",
        "تحسين كفاءة العمالة •",
        "قوائم متعددة اللغات •",
        "صور عالية الجودة للأصناف •",
        "ترتيب ذكي للأصناف •"
    ];


    const containerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollSpeed, setScrollSpeed] = useState(0.5);
    const sliderRef = useRef(null);

    useEffect(() => {
        const slider = sliderRef.current;
        let animationFrame;
        let position = 0;
        const speed = 0.5; // pixels per frame (adjust for speed)

        const animate = () => {
            position = (position + speed) % (slider.scrollWidth / 2);
            slider.style.transform = `translateX(-${position}px)`;
            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    useEffect(() => {
        // Adjust speed based on screen width
        const handleResize = () => {
            const width = window.innerWidth;
            setScrollSpeed(width < 640 ? 0.3 : width < 768 ? 0.4 : 0.5);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        let animationId;
        const container = containerRef.current;

        const animate = () => {
            setScrollPosition(prev => {
                const newPos = prev + scrollSpeed;
                // Reset to 0 when we've scrolled through one full set
                return newPos >= container.scrollWidth / 2 ? 0 : newPos;
            });
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [scrollSpeed]);

    return <>
        <div className="home-page   bg-slate-100 min-h-screen ">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Takka Eats Home</title>
                <link rel="canonical" href="https://eats.takkasmart.com" />
            </Helmet>
            <div className="layout bg-sky-400  relative h-[75vh]  text-white w-full   flex justify-center  ">
                <div className="first-part relative  flex flex-col justify-center items-center  w-full   opacity-95 text-white">
                    <div className="1  w-full h-2/3  flex flex-col justify-center items-center">
                        <p className='cairo font-semibold xl:text-6xl   lg:text-5xl  md:text-4xl sm:text-2xl text-xl mt-20'>نقلة جديدة في عـالــم الديچيتال منيــو  </p>
                        <p className='cairo font-semibold xl:text-6xl   lg:text-5xl  md:text-4xl sm:text-2xl text-xl mt-8'>المنيـــو دلـــوقتي بقي <span className='kufi'>تــكــة</span>  </p>

                    </div>

                    <div className="2 w-full h-1/3 flex flex-col justify-start  items-center ">

                        <div className="btns flex gap-4">
                            <Link to={"/test"}>

                                <button className=' px-3 py-2 border-2 border-white rounded-md cairo hover:bg-slate-600'>مشاهدة المنيو التجريبي</button>
                            </Link>

                            <button
                                className="group/button relative  inline-flex items-center justify-center overflow-hidden rounded-md bg-sky-700 backdrop-blur-lg md:px-6 px-3 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20"
                            >
                                <span className="md:text-lg cairo">
                                    <Link to={"/signup"}>

                                        انضم الينا الأن

                                    </Link>

                                </span>
                                <div
                                    className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
                                >
                                    <div className="relative h-full w-10 bg-white/20"></div>
                                </div>
                            </button>
                        </div>

                        <div className="socials w-full flex mt-12 justify-center gap-3">


                            <div className="fc w-10 h-10 cursor-pointer hover:text-sky-700 rounded-md text-black flex justify-center items-center bg-slate-200">

                                <i className="fa-brands fa-facebook-f text-xl"></i>
                            </div>
                            <div className="fc w-10 h-10 cursor-pointer hover:text-sky-700 rounded-md text-black flex justify-center items-center bg-slate-200">

                                <i className="fa-brands fa-instagram text-xl"></i>
                            </div>

                            <div className="fc w-10 h-10 cursor-pointer hover:text-sky-700 rounded-md text-black flex justify-center items-center bg-slate-200">

                                <i className="fa-brands fa-tiktok text-xl"></i>
                            </div>

                        </div>

                    </div>



                </div>
            </div>

            <div className="second-part flex flex-col items-center pb-16 ">

                <div className="multi-tips w-full z-50 shadow-md border-t-2 border-sky-600 md:h-28 h-20 bg-white overflow-hidden">
                    <div
                        ref={containerRef}
                        className="flex h-full items-center whitespace-nowrap"
                        style={{ transform: `translateX(-${scrollPosition}px)` }}
                    >
                        {[...tips, ...tips].map((tip, index) => (
                            <div
                                key={`${tip}-${index}`}
                                className="inline-block w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 sm:px-4 text-center"
                            >
                                <div className="p-2 sm:p-3 cairo text-sm sm:text-base text-sky-700 inline-block">
                                    {tip}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="system w-full flex md:flex-row flex-col pt-10">
                    <div className="left md:flex hidden md:w-1/2 w-full p-8">
                        <img src={ui1} className='w-full' alt="" />



                    </div>
                    <div className="right flex flex-col items-end    md:w-1/2 w-full p-8">
                        <p className='md:text-5xl text-2xl elmasry'>نظام ادارة متكامل لمطعمك</p>
                        <div className="line border-t-4 mt-7 md:w-96 w-72 text-end -full border-sky-700 "></div>
                        <p className='text-end mt-4 cairo md:text-xl text-lg leading-9'>هو حلٌّ رقمي مُخصص لإدارة قوائم الطلبات الرقمية وتنظيم الطلبات بشكل كامل، مصمم لتبسيط العملية من الطلب حتى التوصيل، مع توفير وقت الموظفين ورفع كفاءة الخدمة.

                        </p>

                        {/* <div className="labels flex md:gap-4 gap-0.5 mt-4">
                            <p className="m-0 text-sm cairo font-[500]">
                                تواصل مستمر
                                <span className='ms-1'>
                                    <i className="bg-sky-800 text-white p-1 rounded-full fa-solid fa-check"></i>
                                </span>                        </p>
                            <p className="m-0 text-sm cairo font-[500]">

                                تقارير شاملة
                                <span className='ms-1'>
                                    <i className="bg-sky-800 text-white p-1 rounded-full fa-solid fa-check"></i>
                                </span>
                            </p>
                            <p className="m-0 text-sm cairo font-[500]">
                                تحكم كامل
                                <span className='ms-1'>
                                    <i className="bg-sky-800 text-white p-1 rounded-full fa-solid fa-check"></i>
                                </span>

                            </p>
                            <p className="m-0 text-sm cairo font-[500]">
                                تجربة مجانية

                                <span className='ms-1'>
                                    <i className="bg-sky-800 text-white p-1 rounded-full fa-solid fa-check"></i>
                                </span>

                            </p>
                        </div> */}

                        <div dir='rtl' className="info mt-6">
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9 h-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    تجربة مجانية للتأكد من مدي انتاجية النظام لمطعمك
                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9 h-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    تحكم كامل لقائمة طعامك علي مدار اليوم
                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9 h-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    تقارير شاملة عن عدد الزوار و عمليات البحث و الايرادات
                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    اضافة العروض التسويقية سواء كانت يومية او لفترة محدودة
                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    سهل البناء والتحديث بحيث يمكنك انشاء منيو في 3 دقائق
                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    خفض التكاليف و زيادة المبيعات

                                </p>

                            </div>

                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    دعم فني علي مدار اليوم

                                </p>

                            </div>
                        </div>
                        {/* <div className="mt-9">
                            <div className="relative group">
                                <button
                                    className="relative inline-block p-px font-semibold leading-6 text-white  shadow-lg cursor-pointer rounded-2xl shadow-sky-100 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-sky-300"
                                >
                                    <span
                                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-cyan-500 to-sky-600 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                                    ></span>
                                    <span className="relative z-10 block px-6 py-3 rounded-2xl bg-sky-700">
                                        <div className="relative z-10 flex items-center space-x-3">
                                            <i className="fa-solid fa-arrow-left"></i>
                                            <span
                                                className="transition-all cairo duration-500 group-hover:translate-x-1.5 group-hover:text-slate-200"
                                            >أشترك الأن </span>

                                        </div>
                                    </span>
                                </button>
                            </div>
                        </div> */}

                    </div>
                    <div className="left flex md:hidden md:w-1/2 w-full p-8">
                        <img src={ui1} className='w-full' alt="" />



                    </div>


                </div>

                <div className="system w-full flex md:flex-row flex-col pt-10">

                    <div className="right flex flex-col items-end    md:w-1/2 w-full p-8">
                        <p className='md:text-5xl text-2xl elmasry'>ابق علي تواصل مع عملائك</p>
                        <div className="line border-t-4 mt-7 md:w-96 w-44 text-end -full border-sky-700 "></div>
                        <p className='text-end mt-4 cairo md:text-xl leading-9'>
                            اراء عملائك و متابعته ركن اساسي من نجاح مطعمك و لذلك قمنا بالأهتمام بالتواصل السلس مع عميلك لتلقي اراءه بالأضافة الي لوحة تحكم بسيطة تتابع منها كل الآراء في مكان واحد


                        </p>
                        <div dir='rtl' className="info mt-6">
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    تلقي اشعار تلقائي بأراء العملاء
                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    حفظ بيانات العملاء للأستفادة الدعائية
                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    ابقائك علي تواصل دائم مع عملائك
                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    اكتساب ثقة عملائك بالأهتمام بأرائهم
                                </p>

                            </div>
                        </div>




                    </div>
                    <div className="left flex rounded-md justify-center md:w-1/2 w-full p-8">
                        <img src={ui4} className='w-full rounded-lg' alt="" />



                    </div>


                </div>

                <div className="system w-full flex md:flex-row flex-col pt-10">
                    <div className="left md:flex hidden w-full md:w-1/2 overflow-hidden relative ms-6 rounded-lg bg-slate-100 md:h-[500px] mb-10 h-[300px]">
                        <div
                            ref={sliderRef}
                            className="absolute top-0 left-0 flex flex-col gap-3 p-8 whitespace-nowrap"
                            style={{ width: '200%' }}
                        >
                            {/* First Row */}
                            <div className="r1 flex gap-3">
                                {[qr1, qr2, qr3, qr4, qr5].map((src, index) => (
                                    <img key={`row1-${index}`} src={src} className='md:w-60 md:h-60 w-44 h-44 object-cover rounded-lg shadow-2xl bg-slate-500' alt="" />
                                ))}
                            </div>

                            {/* Second Row */}
                            <div className="r2 flex gap-3">
                                {[qr6, qr7, qr8, qr9, qr10].map((src, index) => (
                                    <img key={`row2-${index}`} src={src} className='md:w-60 md:h-60 w-44 h-44 object-cover rounded-lg shadow-2xl bg-slate-500' alt="" />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div dir='rtl' className="right flex flex-col     md:w-1/2 w-full p-8">
                        <p className='md:text-5xl text-2xl w-5/6 elmasry'>أفضل الوسائل لعرض الـ <span dir='ltr'>Qr Code</span> الخاص بمطعمك</p>
                        <div className="line border-t-4 mt-7 md:w-96 w-44 text-end -full border-sky-700 "></div>
                        <p className=' mt-4 cairo md:text-xl leading-9'> تعدد الطرق و الاشكال التي ترغب في عرض ال Qr Code الخاص بك من افضل الخامات سواء كانت خشبية او اكريلك او الثنائي  او فينيل بالأضافة للتصميم الخارجي الذي يعبر عن هوية مطعمك

                        </p>
                        <div className="info mt-6">
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    خامات مضاف اليها مادة عاذلة للأتربة

                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    تتميز بخاصية الـ NFC لمسح الـ QR code عن طريق اللمس

                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    Qr Code مخصص

                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    تصميم مجاني مخصص بلوجو المطعم

                                </p>

                            </div>
                            <div className="inf flex items-center gap-1">
                                <span><img src={check} className='w-9' alt="" /></span> <p className='md:text-lg cairo'>
                                    طباعة UV مباشرة

                                </p>

                            </div>
                        </div>



                    </div>
                    <div className="left md:hidden w-full md:w-1/2 flex flex-col items-center overflow-hidden  rounded-lg bg-slate-100 md:h-[500px] mb-10 h-[200px]">


                        {/* First Row */}
                        <div className="r1 flex gap-3">
                            {[qr1, qr2, qr3].map((src, index) => (
                                <img key={`row1-${index}`} src={src} className='lg:w-60 lg:h-60 md:w-44 md:h-44 sm:w-32 sm:h-32 w-24 h-24 object-cover rounded-lg shadow-2xl bg-slate-500' alt="" />
                            ))}
                        </div>

                        {/* Second Row */}
                        <div className="r2 flex gap-3">
                            {[qr4, qr5, qr6].map((src, index) => (
                                <img key={`row1-${index}`} src={src} className='lg:w-60 lg:h-60 md:w-44 md:h-44 sm:w-32 sm:h-32 w-24 h-24 object-cover rounded-lg shadow-2xl bg-slate-500' alt="" />
                            ))}
                        </div>

                    </div>



                </div>


                <div className="adv md:w-4/5 w-11/12  bg-slate-300">
                    <Link to={"/signup"}>
                        <img src={ad2} className='rounded-lg w-full md:h-auto h-36 ' alt="" />

                    </Link>

                </div>
            </div>












        </div>



    </>


}
