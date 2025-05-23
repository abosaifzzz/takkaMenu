import React, { useState } from 'react'
import shop from "../../assets/shop.png"
import paint from "../../assets/paint.png"
import sample from "../../assets/sample.png"
import toast from 'react-hot-toast';
import axios from 'axios';


export default function NewMenuCreation({ onMenuSelect }) {
    const [createForm, setCreateForm] = useState(false);
    const [module, setModule] = useState(null);
    let m_id = localStorage.getItem("m_id")

    const openCreateForm = () => {
        setCreateForm(true);
    };
    const closeCreateForm = () => {
        setCreateForm(false);

        setModule(null)

    };




    const handleContinue = async () => {  // Make it async
        // await addSection();  // Wait for completion
        if (module) {
            onMenuSelect(module);
            closeCreateForm();
        }
    };

    return <>
        <div className="new-menu-creation cairo relative flex flex-col h-screen items-center p-8">


            <img className='w-14' src={shop} alt="" />
            {/* <i className="fa-solid text-3xl text-sky-500 fa-hourglass"></i> */}
            <p className='cairo'> انت لا تملك اي قوائم طعام .. قم بالأضافة الأن !
            </p>
            <button onClick={openCreateForm} className='py-2 px-3 hover:bg-sky-600 bg-sky-500 text-white rounded-md mt-2 cairo'>اضافة قائمة طعام</button>


            <div
                className={`creation-form shadow-lg flex flex-col items-center absolute md:w-3/5 w-5/6   bg-white rounded-lg 
                transition-all duration-300 ease-in-out 
                ${createForm ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >                    <div className="close">
                    <p onClick={closeCreateForm} className='text-gray-600 absolute top-4 left-4'>X</p>
                </div>
                <p className='font-medium pt-5  w-full px-7 text-center text-sky-700 lg:text-2xl md:text-lg text-sm'> علي بعد خطوة من انشاء المنيو الخاص بك !</p>
                <p className=' md:text-base w-full px-7 text-center text-sm font-thin text-gray-700'> تذكر لديك الامكانية في الادارة و التعديل في اي وقت</p>
                <div className="modules mt-5 flex md:flex-row flex-col gap-3">

                    <div
                        className={`scratch flex flex-col items-center justify-center md:w-52 md:h-52 w-48 h-48 rounded-md border 
                    cursor-pointer transition-all duration-200 ${module === "scratch" ? "border-sky-500 bg-blue-100" : "border-gray-300"
                            }`}
                        onClick={() => setModule("scratch")}
                    >                        {/* <i className="text-sky-700 text-xl fa-solid fa-paintbrush"></i>
          */}
                        <img src={paint} className='md:w-13 md:h-13 w-10 h-10' alt="" />
                        <p className='mt-4  font-medium'>انشاء المنيو من البداية</p>
                        <p className='text-sm text-center text-gray-700'>  البدء بمنيو خالي و الاضافة من البداية</p>



                    </div>
                    <div
                        className={`sample relative flex flex-col items-center justify-center md:w-52 md:h-52 w-48 h-48 rounded-md border 
                    cursor-pointer transition-all duration-200 ${module === "sample" ? "border-sky-500 bg-blue-100" : "border-gray-300"
                            }`}
                        onClick={() => setModule("sample")}
                    >                        {/* <i className="text-sky-700 text-xl fa-solid fa-paintbrush"></i>
          */}
                        <img src={sample} className='md:w-13 md:h-16 w-12 h-12' alt="" />
                        <p className='mt-4  font-medium'>انشاء نموذج مصغر</p>
                        <p className='text-sm text-center text-gray-700'>البدء مع تعديل نموذج مصغر من المنيو </p>
                        <p className='text-xs absolute top-0 left-0 bg-sky-600 rounded-tl-md px-2 rounded-br-md text-white p-1'>يوصي به</p>


                    </div>
                </div>
                <div className="action-b mt-4 flex w-full justify-end items-end">
                    <button
                        disabled={!module}
                        onClick={handleContinue}
                        className={`m-3 text-white px-3 py-2 rounded-md transition-all duration-200 ${module ? "bg-sky-700 hover:bg-sky-600" : "bg-sky-300 cursor-not-allowed"
                            }`}
                    >استكمال</button>
                </div>

            </div>




        </div>



    </>


}
