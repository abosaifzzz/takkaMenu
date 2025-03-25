import React, { useState } from 'react'
import shop from "../../assets/shop.png"
import cover from "../../assets/cover.jpeg"

import loc from "../../assets/loc.png"
import loc2 from "../../assets/loc2.png"
import bio from "../../assets/bio.png"
import check from "../../assets/check.webm"


import time from "../../assets/time.png"



import exlogo from "../../assets/exlogo.png"
import useFetchData from '../../utils/useApi.js'

export default function StartForm() {
    const [bodyData, setBodyData] = useState({});
    const { fetchData, isLoading, error } = useFetchData();

    const [loginLoading, setLoginLoading] = useState(false);

    // State to track the current step
    const [currentStep, setCurrentStep] = useState(1);

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
        setCurrentStep((prevStep) => prevStep + 1);
    };
    const handlePreviousStep = () => {
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
                const menuId = response.data.id_hash
                localStorage.setItem("menu", menuId)
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




    return <>
        <div className="start p-5 flex justify-center items-center bg-white min-h-screen">
            <div className="start-form shadow-md   w-1/2 h-2/3 bg-slate-100 p-8 rounded-md ">
                {currentStep === 1 && (
                    <div className="step-one flex flex-col items-center">
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
                    <div className="step-two flex flex-col items-center">
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
                    <div className="step-two flex flex-col items-center">
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
                    <div className="step-two flex flex-col items-center">
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
                    <div className="step-two flex flex-col items-center">
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
