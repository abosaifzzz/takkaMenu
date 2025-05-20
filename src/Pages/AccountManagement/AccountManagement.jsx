import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import toast from 'react-hot-toast';

// export default function AccountManagement() {

//     const [accountLoading, setAccountLoading] = useState(true); // State to handle loading state
//     useEffect(() => {
//         setTimeout(() => {
//             setReviewsLoading(false)
//         }, 500);
//     })

//     const name = localStorage.getItem("name")
//     const provider = localStorage.getItem("provider")
//     const email = localStorage.getItem("email")
//     const mobile = localStorage.getItem("mobile")
//     return <>
//         <div className='cairo AccountManagement w-full h-full p-8'>

//             <div className="personal-info md:w-2/3 w-full p-5 rounded-md bg-white shadow-lg h-fit">
//                 <p className='cairo text-lg pb-4 font-medium text-gray-700'>المعلومات الشخصية</p>


//                 <div className="name mt-7">
//                     <label htmlFor="" className='cairo block pb-3'>الأسم</label>

//                     <input type="text" className='cairo md:w-2/3 w-full h-9 border-2 rounded-md' />

//                 </div>
//                 <div className="name pb-8 mt-7">
//                     <label htmlFor="" className='cairo block pb-3'>رقم الهاتف</label>

//                     <input type="text" className='cairo md:w-2/3 w-full h-9 border-2 rounded-md' />

//                 </div>
//                 <hr className='cairo pb-6' /> <div className="save-personal-info ">
//                     <div className="save flex justify-end">
//                         <button className='cairo px-6 py-2  rounded-md bg-sky-600 text-white hover:bg-sky-500'>حفظ</button>

//                     </div>

//                 </div>


//             </div >

//             <div className="login-info md:w-2/3 w-full p-5 mt-7 rounded-md bg-white shadow-lg ">
//                 <p className='cairo text-lg pb-4 font-medium text-gray-700'>بيانات الوصول</p>


//                 <div className="name mt-7 ">
//                     <label htmlFor="" className='cairo block pb-3'>الأيميل</label>

//                     <input type="text" className='cairo md:w-2/3 w-full h-9 border-2 rounded-md' />
//                     <button className='cairo  bg-slate-100 hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md'> تعديل</button>

//                 </div>
//                 <div className="name mt-7">
//                     <label htmlFor="" className='cairo block pb-3'>كلمة المرور</label>

//                     <input type="text" className='cairo md:w-2/3 w-full h-9 border-2 rounded-md' />
//                     <button className='cairo  bg-slate-100  hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md'> تغير كلمة المرور</button>

//                 </div>

//             </div >
//             <div className="login-info md:w-2/3 w-full p-5 mt-7 rounded-md bg-white shadow-lg ">

//                 <p className='cairo text-lg m-0 pb-5 font-medium text-gray-700'>غلق حسابي </p>
//                 <p className='cairo '>اذا كنت تريد غلق حسابك من فضلك قم بالتواصل معنا</p>

//                 <button className='cairo mt-4 bg-slate-100  hover:bg-sky-600 hover:text-white border h-9 px-5 rounded-md'> تواصل معنا   </button>


//             </div >





//         </div >
//     </>
// }
const apiUrl = import.meta.env.VITE_API_URL;

export default function AccountManagement() {
    const [accountLoading, setAccountLoading] = useState(true);
    const [contactUs, setContactUs] = useState(false);

    const [personalData, setPersonalData] = useState({
        name: localStorage.getItem("name") || "",
        mobile: localStorage.getItem("mobile") || "",
    });
    const [loginData, setLoginData] = useState({
        email: localStorage.getItem("email") || "",
        password: "" // Only for provider "S"


    })
    const [userData, setUserData] = useState({
        personalData: {
            name: '',
            mobile: ''
        },
        loginData: {
            email: '',
            password: ''
        },
        provider: '' // 'S' or other provider type
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');


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

    const provider = localStorage.getItem("provider"); // "S" or "G"
    const uId = localStorage.getItem("uId"); // "S" or "G"

    useEffect(() => {
        setTimeout(() => {
            setAccountLoading(false);
        }, 500);
        fetchUserData(uId)
    }, [uId]);


    const fetchUserData = async (uId) => {
        try {
            console.log("user id", uId);

            const response = await axios.get(`${apiUrl}/api/user/${uId}`, {

                headers: authHeader()
            });
            console.log(response.data.result);

            const data = await response.data.result;

            setUserData({
                personalData: {
                    name: data.name || '',
                    mobile: data.phone_number || ''
                },
                loginData: {
                    email: data.email || '',
                    password: '********' // Note: APIs typically don't return actual passwords
                },
                provider: data.provider || ''
            });

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name' || name === 'mobile') {
            setUserData(prev => ({
                ...prev,
                personalData: {
                    ...prev.personalData,
                    [name]: value
                }
            }));
        } else if (name === 'email' || name === 'password') {
            setUserData(prev => ({
                ...prev,
                loginData: {
                    ...prev.loginData,
                    [name]: value
                }
            }));
        }
    };

    // Handle form submission (update name and mobile)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userData.personalData.name.trim()) {
            toast.error('الاسم مطلوب');
            return
        } else if (userData.personalData.name.length > 50) {
            toast.error('الاسم يجب أن يكون أقل من 50 حرفًا');
            return
        }

        if (userData.personalData.mobile && !/^[0-9+]+$/.test(userData.personalData.mobile)) {
            toast.error('يجب أن يحتوي رقم الهاتف على أرقام فقط');
            return
        } else if (userData.personalData.mobile &&
            (userData.personalData.mobile.length < 8 ||
                userData.personalData.mobile.length > 15)) {
            toast.error('رقم الهاتف يجب أن يكون بين 8 و15 رقمًا');
            return
        }

        const bodyData = {
            name: userData.personalData.name,
            phone_number: userData.personalData.mobile

        }
        console.log(bodyData);

        try {
            const response = await axios.post(`${apiUrl}/api/user/update`, bodyData, {

                headers: authHeader()
            })
            console.log(response);

            console.log("done");

            toast.success('تم تحديث البيانات بنجاح');
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div className='cairo AccountManagement w-full h-full p-8'>

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


            {/* <div className="personal-info md:w-2/3 w-full p-5 rounded-md bg-white shadow-lg h-fit">
                <p className='cairo text-lg pb-4 font-medium text-gray-700'>المعلومات الشخصية</p>

                <div className="name mt-7">
                    <label htmlFor="name" className='cairo block pb-3'>الأسم</label>
                    <input
                        type="text"
                        name="name"
                        value={personalData.name}
                        onChange={handleInputChange}
                        className='cairo md:w-2/3 w-full h-9 border-2 rounded-md'
                    />
                </div>

                <div className="name pb-8 mt-7">
                    <label htmlFor="mobile" className='cairo block pb-3'>رقم الهاتف</label>
                    <input
                        type="text"
                        name="mobile"
                        value={personalData.mobile}
                        onChange={handleInputChange}
                        className='cairo md:w-2/3 w-full h-9 border-2 rounded-md'
                    />
                </div>

                <hr className='cairo pb-6' />
                <div className="save-personal-info">
                    <div className="save flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className='cairo px-6 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-500'
                        >
                            حفظ
                        </button>
                    </div>
                </div>
            </div>


            <div className="login-info md:w-2/3 w-full p-5 mt-7 rounded-md bg-white shadow-lg">
                <p className='cairo text-lg pb-4 font-medium text-gray-700'>بيانات الوصول</p>

                <div className="name mt-7">
                    <label htmlFor="email" className='cairo block pb-3'>الأيميل</label>
                    <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        disabled={provider !== "S"}

                        onChange={handleInputChange}
                        className={`${provider === "s" ? "bg-white cursor-pointer text-black" : "bg-slate-100 cursor-default text-gray-600"}   cairo  md:w-2/3 w-full h-9 border-2 rounded-md`}
                    />
                    <button className={` ${provider === "s" ? "opacity-100 cursor-pointer" : "opacity-0 cursor-default"}   cairo bg-slate-100 hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md`}>
                        تعديل
                    </button>
                </div>

                <div className="name mt-7">
                    <label htmlFor="password" className='cairo block pb-3'>كلمة المرور</label>
                    <input
                        type="password"
                        name="password"
                        value={personalData.password}
                        onChange={handleInputChange}
                        disabled={provider !== "S"}

                        className={`${provider === "s" ? "bg-white cursor-pointer" : "bg-slate-100 cursor-default"}   cairo  md:w-2/3 w-full h-9 border-2 rounded-md`}
                        placeholder='*********'
                    />
                    <button className={`${provider === "s" ? "opacity-100 cursor-pointer" : "opacity-0 cursor-default"}    cairo bg-slate-100 hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md`}>
                        تغيير كلمة المرور
                    </button>
                </div>
            </div> */}
            <div className="personal-info md:w-2/3 w-full p-5 rounded-md bg-white shadow-lg h-fit">
                <p className='cairo text-lg pb-4 font-medium text-gray-700'>المعلومات الشخصية</p>

                <div className="name mt-7">
                    <label htmlFor="name" className='cairo block pb-3'>الأسم</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.personalData.name}
                        onChange={handleInputChange}
                        className='cairo md:w-2/3 w-full px-2 h-9 border-2 rounded-md'
                    />
                </div>

                <div className="name pb-8 mt-7">
                    <label htmlFor="mobile" className='cairo block pb-3'>رقم الهاتف</label>
                    <input
                        type="text"
                        name="mobile"
                        value={userData.personalData.mobile}
                        onChange={handleInputChange}
                        placeholder='يرجي اضافة رقم هاتف'
                        className='cairo md:w-2/3 w-full px-1 h-9 border-2 rounded-md'
                    />
                </div>

                <hr className='cairo pb-6' />
                <div className="save-personal-info">
                    <div className="save flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className='cairo px-6 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-500'
                        >
                            حفظ
                        </button>
                    </div>
                </div>
            </div>

            {/* Login Info Section (Email + Password) - Only for provider "S" */}
            <div className="login-info md:w-2/3 w-full p-5 mt-7 rounded-md bg-white shadow-lg">
                <p className='cairo text-lg pb-4 font-medium text-gray-700'>بيانات الوصول</p>

                <div className="name mt-7">
                    <label htmlFor="email" className='cairo block pb-3'>الأيميل</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.loginData.email}
                        disabled={userData.provider !== "S"}
                        onChange={handleInputChange}
                        className={`${userData.provider === "S" ? "bg-white cursor-pointer text-black" : "bg-slate-100 cursor-default text-gray-600"} cairo md:w-2/3 w-full h-9 border-2 rounded-md`}
                    />
                    <button className={`${userData.provider === "S" ? "opacity-100 cursor-pointer" : "opacity-0 cursor-default"} cairo bg-slate-100 hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md`}>
                        تعديل
                    </button>
                </div>

                <div className="name mt-7">
                    <label htmlFor="password" className='cairo block pb-3'>كلمة المرور</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.loginData.password}
                        onChange={handleInputChange}
                        disabled={userData.provider !== "S"}
                        className={`${userData.provider === "S" ? "bg-white cursor-pointer" : "bg-slate-100 cursor-default"} cairo md:w-2/3 w-full h-9 border-2 rounded-md`}
                        placeholder='*********'
                    />
                    <button className={`${userData.provider === "S" ? "opacity-100 cursor-pointer" : "opacity-0 cursor-default"} cairo bg-slate-100 hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md`}>
                        تغيير كلمة المرور
                    </button>
                </div>
            </div>



            {/* Account Deletion Section */}
            <div className="login-info md:w-2/3 w-full p-5 mt-7 rounded-md bg-white shadow-lg">
                <p className='cairo text-lg m-0 pb-5 font-medium text-gray-700'>غلق حسابي</p>
                <p className='cairo'>إذا كنت تريد غلق حسابك من فضلك قم بالتواصل معنا</p>
                <button
                    onClick={() => setContactUs(true)}
                    className="cairo mt-4 bg-slate-100 hover:bg-sky-600 hover:text-white border h-9 px-5 rounded-md transition-colors"
                >
                    تواصل معنا
                </button>            </div>
        </div>
    );
}