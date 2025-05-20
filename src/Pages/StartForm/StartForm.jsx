import React, { useEffect, useState } from 'react'
import shop from "../../assets/shop.png"
import cover from "../../assets/cover.jpeg"

import loc from "../../assets/loc.png"
import loc2 from "../../assets/loc2.png"
import bio from "../../assets/bio.png"
import check from "../../assets/check.webm"


import time from "../../assets/time.png"
import logo from "../../assets/eats-logo.png"




import exlogo from "../../assets/exlogo.png"
import useFetchData from '../../utils/useApi.js'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
const apiUrl = import.meta.env.VITE_API_URL;

export default function StartForm() {
    const [bodyData, setBodyData] = useState({});
    const { fetchData, isLoading, error } = useFetchData();

    const [loginLoading, setLoginLoading] = useState(false);
    const [userIcon, setUserIcon] = useState("");
    const [isSettingsOpen, setSettingsOpen] = useState(false);  // State to manage settings visibility


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

    // State to track the current step
    const [currentStep, setCurrentStep] = useState(1);

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


    // Function to handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBodyData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    // Function to handle "استمرار" button click
    const handleNextStep = () => {
        // Check if current step is 1 (business name) and the name is empty
        if (currentStep === 1 && !bodyData.name) {
            toast.error("الرجاء إدخال اسم البزنس");
            return;
        }

        // Check if current step is 2 (address) and the address is empty
        if (currentStep === 2 && !bodyData.address) {
            toast.error("الرجاء إدخال العنوان");
            return;
        }

        // Proceed to next step if validation passes
        setCurrentStep((prevStep) => prevStep + 1);
    }; const handlePreviousStep = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async () => {
        try {
            setLoginLoading(true)
            const ownerId = localStorage.getItem("owner");

            if (!ownerId) {
                throw new Error("Owner ID not found in localStorage");
            }

            // Append owner_id to the data object
            const data = {
                ...bodyData,
                owner_id: ownerId, // Add owner_id to the data object
            };
            // Make the POST request to the API
            const response = await fetchData("/api/menu", data);
            console.log(response.data);

            if (response?.data) {
                console.log("Menu created successfully:", response.data);
                const menuId = response.data.newMenu.id_hash
                const m_id = response.data.newMenu.id

                localStorage.setItem("menu", menuId)
                localStorage.setItem("m_id", m_id)
                addSection(m_id)

                console.log(menuId);
                window.location.href = `menu/${menuId}/dashboard`;  // Redirect to dashboard


                // Handle success (e.g., show a success message or redirect)
            } else {
                console.error("Failed to create menu:", response?.data?.message);
                // Handle failure (e.g., show an error message)
            }
        } catch (error) {
            console.error("Error creating menu:", error);
            // Handle error (e.g., show an error message)
        }
    };

    const addSection = async (m_id) => {
        // event.preventDefault();


        const stateObject = {
            menu_id: m_id,
            name: "offers",
            is_offer: true
        };

        try {
            // Await the API call to ensure completion
            await addSectionApi(stateObject);
            // Fetch the updated sections after adding the new section
        } catch (error) {
            console.error('Error adding section:', error);
            toast.error('حدث خطأ أثناء إضافة القسم');
        }
    };



    const addSectionApi = async (stateObject) => {




        const response = await axios.post(`${apiUrl}/api/section`, stateObject, {
            headers: authHeader(),
        });
        console.log(response)
        toast.success('تم الأضافة بنجاح');
        // toggleAddFormVisibility()


    }




    return <>
        <Toaster />
        <div className="start p-5 flex justify-center items-center bg-white min-h-screen">
            <div className="new-menu-nav absolute top-0 left-0 right-0 bg-gray-100 border-b-2 border-slate-300 rounded-b-lg  flex justify-between items-center">
                <div onClick={toggleSettings}
                    className="name-icon relative   p-5 px-9">

                    <div className={`icon cursor-pointer relative w-8 h-8 rounded-full flex justify-center items-center bg-sky-300 ${isSettingsOpen ? 'border-2 border-sky-700' : 'border-none'
                        }`}>
                        <p className='text-sky-700'>{userIcon}</p>
                        <div className="arrow absolute -right-4">
                            <i className="fa-solid text-xs text-sky-800 fa-chevron-down"></i>
                        </div>

                        {isSettingsOpen && (
                            <div className={`user-settings z-40 absolute border-2 rounded-md -bottom-14 -left-7 w-44 bg-white transition-all duration-500 ease-out ${isSettingsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                                }`}
                            >

                                <p onClick={signOut} className="cairo cursor-pointer flex gap-2 items-center p-2 text-sm hover:bg-gray-200 border-b border-sky-200">
                                    <i className="text-gray-600 fa-solid fa-right-from-bracket"></i> تسجيل الخروج
                                </p>
                            </div>
                        )}

                    </div>




                </div>

                <div className="logo">
                    <img className='w-12' src={logo} alt="" />
                </div>
                <div></div>

            </div>

            <div className="start-form shadow-md   w-1/2 h-96 bg-slate-100 p-8 rounded-md ">
                {currentStep === 1 && (
                    <div className="step-one flex flex-col items-center justify-between h-full">
                        <img src={shop} className="w-20" alt="" />
                        <p className="cairo text-lg">
                            <span className="text-red-500">*</span>اسم البزنس الخاص بيك ؟
                        </p>
                        <input
                            name="name"
                            className="bg-white w-80 text-end rounded-md border border-gray-300 px-4 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-gray-200 cairo focus:ring-offset-2 focus:ring-offset-gray-300"
                            placeholder="مثال: كنتاكي"
                            onChange={handleInputChange}
                            required
                        />
                        <div className="action-btn mt-4 flex justify-start w-full">
                            <button
                                className="cairo bg-green-800 flex gap-2 justify-center items-center hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                onClick={handleNextStep}
                            >
                                <i className="fa-solid fa-chevron-left"></i> استمرار
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="step-two flex flex-col items-center justify-between h-full">
                        <img src={loc} className="w-20" alt="" />
                        <p className="cairo text-lg">
                            <span className="text-red-500">*</span>عنوانك ؟
                        </p>
                        <input
                            name="address"
                            className="bg-white w-80 text-end rounded-md border border-gray-300 px-4 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-gray-200 cairo focus:ring-offset-2 focus:ring-offset-gray-300"
                            placeholder="مثال: القاهرة , مصر الجديدة , شارع الحرية"
                            onChange={handleInputChange}
                        />
                        <div className="action-btn mt-4 flex justify-between w-full">
                            <button
                                className="cairo bg-green-800 flex gap-2 justify-center items-center hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                onClick={handleNextStep}
                            >
                                <i className="fa-solid fa-chevron-left"></i> استمرار
                            </button>
                            <button
                                className="cairo bg-red-500 flex gap-2 justify-center items-center hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                onClick={handlePreviousStep}
                            >
                                رجوع <i className="fa-solid fa-chevron-right"></i>
                            </button>

                        </div>
                    </div>
                )}
                {currentStep === 3 && (
                    <div className="step-two flex flex-col items-center justify-between h-full">
                        <img src={loc2} className="w-20" alt="" />
                        <p className="cairo text-lg">
                            <span className="text-red-500">*</span>عنوانك علي جوجل ماب ؟
                        </p>
                        <input
                            name="location"
                            className="bg-white w-80 text-sm text-end rounded-md border border-gray-300 px-4 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-gray-200 cairo focus:ring-offset-2 focus:ring-offset-gray-300"
                            placeholder="ex: https://maps.app.goo.gl/D6dV4Qpk3EQpHsM47 "
                            onChange={handleInputChange}
                        />
                        <div className="action-btn mt-4 flex justify-between w-full">
                            <div className="skip-option flex gap-2">
                                <button
                                    className="cairo bg-green-800 flex gap-2 justify-center items-center hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                    onClick={handleNextStep}
                                >
                                    <i className="fa-solid fa-chevron-left"></i> استمرار
                                </button> <button onClick={handleNextStep}
                                    className='cairo font-medium text-gray-600 hover:text-sky-800'>تخطي</button>
                            </div>

                            <button
                                className="cairo bg-red-500 flex gap-2 justify-center items-center hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                onClick={handlePreviousStep}
                            >
                                رجوع <i className="fa-solid fa-chevron-right"></i>
                            </button>

                        </div>
                    </div>
                )}
                {currentStep === 4 && (
                    <div className="step-two flex flex-col items-center justify-between h-full">
                        <img src={time} className="w-20" alt="" />
                        <p className="cairo text-lg">
                            <span className="text-red-500">*</span>مواعيد عملك ؟
                        </p>
                        <div className="time w-4/5   flex gap-3">

                            <div className="open-time w-1/2  pb-8 mt-7">
                                <label htmlFor="open-time" className="block cairo text-end pb-3">موعد الأنتهاء</label>
                                <input type="time" name="start_time" onChange={handleInputChange} id="open-time" className=" w-full h-9 border-2 rounded-md px-2" />
                            </div>

                            <div className="close-time w-1/2 pb-8 mt-7">
                                <label htmlFor="close-time" className="block cairo text-end pb-3">موعد البدأ</label>
                                <input type="time" name="end_time" onChange={handleInputChange} id="close-time" className=" w-full h-9 border-2 rounded-md px-2" />

                            </div>
                        </div>

                        <div className="action-btn mt-4 flex justify-between w-full">
                            <div className="skip-option flex gap-2">
                                <button
                                    className="cairo bg-green-800 flex gap-2 justify-center items-center hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                    onClick={handleNextStep}
                                >
                                    <i className="fa-solid fa-chevron-left"></i> استمرار
                                </button> <button onClick={handleNextStep}
                                    className='cairo font-medium text-gray-600 hover:text-sky-800'>تخطي</button>
                            </div>

                            <button
                                className="cairo bg-red-500 flex gap-2 justify-center items-center hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                onClick={handlePreviousStep}
                            >
                                رجوع <i className="fa-solid fa-chevron-right"></i>
                            </button>

                        </div>
                    </div>
                )}
                {currentStep === 5 && (
                    <div className="step-two flex flex-col items-center justify-between h-full">
                        <img src={bio} className="w-20" alt="" />
                        <p className="cairo text-lg">
                            <span className="text-red-500">*</span>نبذة عن البزنس ؟
                        </p>
                        <input
                            name="bio"
                            className="bg-white w-80 text-sm text-end rounded-md border border-gray-300 px-4 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-gray-200 cairo focus:ring-offset-2 focus:ring-offset-gray-300"
                            placeholder="مثال: افضل مطعم للمأكولات السريعة "
                            onChange={handleInputChange}
                        />
                        <div className="action-btn mt-4 flex justify-between w-full">
                            <div className="skip-option flex gap-2">
                                <button
                                    className="cairo bg-green-800 flex gap-2 justify-center items-center hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                    onClick={handleNextStep}
                                >
                                    <i className="fa-solid fa-chevron-left"></i> استمرار
                                </button> <button onClick={handleNextStep}
                                    className='cairo font-medium text-gray-600 hover:text-sky-800'>تخطي</button>
                            </div>

                            <button
                                className="cairo bg-red-500 flex gap-2 justify-center items-center hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                onClick={handlePreviousStep}
                            >
                                رجوع <i className="fa-solid fa-chevron-right"></i>
                            </button>

                        </div>
                    </div>
                )}

                {/* Add steps 3 to 6 similarly */}

                {currentStep === 6 && (

                    <div className="step-six  relative flex flex-col items-center">
                        <video
                            src={check}


                            autoPlay
                            muted
                            className="w-24  "
                        ></video>

                        <p className="cairo text-lg">تم الانتهاء من جميع الخطوات!</p>
                        <button onClick={handleSubmit} className=' bg-green-800 text-white flex justify-center items-center gap-2 rounded-md px-3 py-2 cairo mt-4'>
                            {loginLoading ? (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                >
                                    <circle
                                        strokeWidth="4"
                                        stroke="currentColor"
                                        r="10"
                                        cy="12"
                                        cx="12"
                                        className="opacity-25"
                                    ></circle>
                                    <path
                                        d="M4 12a8 8 0 018-8v8H4z"
                                        fill="currentColor"
                                        className="opacity-75"
                                    ></path>
                                </svg>
                            ) : null}

                            ابدأ الأستخدام الأن</button>

                    </div>

                )}


            </div>






        </div>



    </>

}
