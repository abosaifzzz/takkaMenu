import React, { useState } from 'react'
import { useEffect } from 'react';

export default function AccountManagement() {

    const [accountLoading, setAccountLoading] = useState(true); // State to handle loading state
    useEffect(() => {
        setTimeout(() => {
            setReviewsLoading(false)
        }, 500);
    })

    return <>
        <div className='cairo AccountManagement w-full h-full p-8'>

            <div className="personal-info md:w-2/3 w-full p-5 rounded-md bg-white shadow-lg h-fit">
                <p className='cairo text-lg pb-4 font-medium text-gray-700'>المعلومات الشخصية</p>


                <div className="name mt-7">
                    <label htmlFor="" className='cairo block pb-3'>الأسم</label>

                    <input type="text" className='cairo md:w-2/3 w-full h-9 border-2 rounded-md' />

                </div>
                <div className="name pb-8 mt-7">
                    <label htmlFor="" className='cairo block pb-3'>رقم الهاتف</label>

                    <input type="text" className='cairo md:w-2/3 w-full h-9 border-2 rounded-md' />

                </div>
                <hr className='cairo pb-6' /> <div className="save-personal-info ">
                    <div className="save flex justify-end">
                        <button className='cairo px-6 py-2  rounded-md bg-sky-600 text-white hover:bg-sky-500'>حفظ</button>

                    </div>

                </div>


            </div >

            <div className="login-info md:w-2/3 w-full p-5 mt-7 rounded-md bg-white shadow-lg ">
                <p className='cairo text-lg pb-4 font-medium text-gray-700'>بيانات الوصول</p>


                <div className="name mt-7 ">
                    <label htmlFor="" className='cairo block pb-3'>الأيميل</label>

                    <input type="text" className='cairo md:w-2/3 w-full h-9 border-2 rounded-md' />
                    <button className='cairo  bg-slate-100 hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md'> تعديل</button>

                </div>
                <div className="name mt-7">
                    <label htmlFor="" className='cairo block pb-3'>كلمة المرور</label>

                    <input type="text" className='cairo md:w-2/3 w-full h-9 border-2 rounded-md' />
                    <button className='cairo  bg-slate-100  hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md'> تغير كلمة المرور</button>

                </div>

            </div >
            <div className="login-info md:w-2/3 w-full p-5 mt-7 rounded-md bg-white shadow-lg ">

                <p className='cairo text-lg m-0 pb-5 font-medium text-gray-700'>غلق حسابي </p>
                <p className='cairo '>اذا كنت تريد غلق حسابك من فضلك قم بالتواصل معنا</p>

                <button className='cairo mt-4 bg-slate-100  hover:bg-sky-600 hover:text-white border h-9 px-5 rounded-md'> تواصل معنا   </button>


            </div >





        </div >
    </>
}
