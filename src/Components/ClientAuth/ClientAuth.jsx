import React, { useState } from 'react'
import logo from "../../assets/eats-logo.png"
import { Link } from 'react-router-dom';


export default function ClientAuth({ selectedOrderWay, onClose }) {
    const [activeTab, setActiveTab] = useState('login');
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [signupData, setSignupData] = useState({
        fullName: '',
        phone: '',
        password: ''
    });

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the OTP to the user's phone
        // For now, we'll just show the OTP form
        setShowOtpForm(true);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        // Handle OTP verification here
        alert('Account created successfully!');
        setShowOtpForm(false);
        setActiveTab('login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignupData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <div className="login-and-signup fixed inset-0 flex p-5 justify-center items-center bg-black/25">
                <i onClick={onClose}
                    className="fa-solid absolute top-10 text-gray-100 right-8 text-3xl fa-circle-xmark"></i>

                <div className="login-signup-forms lg:w-1/4 md:w-1/3 sm:w-1/2 flex flex-col items-center rounded-lg w-full h-fit bg-white">
                    <div className="top bg-slate-100 rounded-lg w-full flex flex-col p-3 items-center ">
                        <img src={logo} className='md:w-24 w-20' alt="" />
                        <p className='cairo text-black mt-4 text-xl font-bold'>
                            {showOtpForm ? 'تفعيل الحساب' : 'من فضلك قم بتسجيل الدخول اولاّ'}
                        </p>
                        <p className='cairo text-black mt-4 '>
                            {showOtpForm ? 'لقد ارسلنا كود التفعيل الي رقم هاتفك' : 'لأمكانك استكمال اضافة الطلبات الخاصة بك الي السلة'}
                        </p>
                    </div>

                    {!showOtpForm ? (
                        <>
                            <div className="flex w-full border-b">
                                <Link to={"/proceed"} state={{ selectedOrderWay }}>

                                    <button
                                        className={`flex-1 cairo py-4 px-6 font-medium text-center focus:outline-none ${activeTab === 'login'
                                            ? 'text-sky-600 border-b-2 border-sky-600'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setActiveTab('login')}
                                    >
                                        تسجيل دخول
                                    </button>
                                </Link>

                                <button
                                    className={`flex-1 cairo py-4 px-6 font-medium text-center focus:outline-none ${activeTab === 'signup'
                                        ? 'text-sky-600 border-b-2 border-sky-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setActiveTab('signup')}
                                >
                                    انشاء حساب
                                </button>
                            </div>

                            {/* Tabs Content */}
                            <div className="p-6 w-full">
                                {activeTab === 'login' ? (
                                    <div className="w-full flex flex-col gap-2 ">
                                        <div>
                                            <input
                                                type="email"
                                                className="w-full px-3 py-2 border cairo border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="رقم الهاتف"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="password"
                                                className="w-full px-3 cairo py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="كلمة المرور"
                                            />
                                        </div>
                                        <button
                                            className="w-full bg-sky-600 cairo text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                                        >
                                            <Link
                                                to="/proceed"
                                                state={{ selectedOrderWay }}
                                                className="w-full block"
                                            >
                                                تسجيل الدخول
                                            </Link>
                                        </button>                                        <div className="text-center">
                                            <a href="#" className="text-sky-600  cairo hover:underline">
                                                نسيت كلمة المرور ؟
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={signupData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full cairo px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="الأسم كاملاّ"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={signupData.phone}
                                                onChange={handleInputChange}
                                                className="w-full cairo px-3 text-end py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="رقم الهاتف"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="password"
                                                name="password"
                                                value={signupData.password}
                                                onChange={handleInputChange}
                                                className="w-full cairo px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="كلمة المرور"
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="w-full cairo bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                                            انشاء الحساب
                                        </button>
                                    </form>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="p-6 w-full">
                            <form onSubmit={handleOtpSubmit} className="space-y-4">
                                <p className="cairo text-center text-gray-600">
                                    تم ارسال كود التفعيل إلى رقم الهاتف {signupData.phone}
                                </p>
                                <div dir='ltr' className="flex  justify-center gap-2">
                                    {[1, 2, 3, 4].map((item) => (
                                        <input
                                            key={item}
                                            type="text"
                                            maxLength="1"
                                            className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ))}
                                </div>
                                <Link
                                    to="/proceed"
                                    state={{ selectedOrderWay }}
                                    className="w-full block"
                                >
                                    <button
                                        type="submit"
                                        className="w-full cairo bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                                    >
                                        تأكيد الكود
                                    </button>
                                </Link>
                                <div className="text-center">
                                    <button
                                        type="button"
                                        className="text-sky-600 cairo hover:underline"
                                        onClick={() => setShowOtpForm(false)}
                                    >
                                        تعديل رقم الهاتف
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}