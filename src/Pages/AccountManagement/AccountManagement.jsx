import React from 'react'

export default function AccountManagement() {
    return <>
        <div className='AccountManagement w-full h-full p-8'>

            <div className="personal-info md:w-2/3 w-full p-5 rounded-md bg-white shadow-lg h-fit">
                <p className='text-lg pb-4 font-medium text-gray-700'>Personale Information</p>


                <div className="name mt-7">
                    <label htmlFor="" className='block pb-3'>Name</label>

                    <input type="text" className='md:w-2/3 w-full h-9 border-2 rounded-md' />

                </div>
                <div className="name pb-8 mt-7">
                    <label htmlFor="" className='block pb-3'>Phone Number</label>

                    <input type="text" className='md:w-2/3 w-full h-9 border-2 rounded-md' />

                </div>
                <hr className='pb-6' /> <div className="save-personal-info ">
                    <div className="save flex justify-end">
                        <button className='px-6 py-2  rounded-md bg-sky-600 text-white hover:bg-sky-500'>Save</button>

                    </div>

                </div>


            </div >

            <div className="login-info md:w-2/3 w-full p-5 mt-7 rounded-md bg-white shadow-lg ">
                <p className='text-lg pb-4 font-medium text-gray-700'>Personale Information</p>


                <div className="name mt-7 ">
                    <label htmlFor="" className='block pb-3'>Email</label>

                    <input type="text" className='md:w-2/3 w-full h-9 border-2 rounded-md' />
                    <button className=' bg-slate-100 hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md'> Edit</button>

                </div>
                <div className="name mt-7">
                    <label htmlFor="" className='block pb-3'>Password</label>

                    <input type="text" className='md:w-2/3 w-full h-9 border-2 rounded-md' />
                    <button className=' bg-slate-100  hover:bg-sky-600 hover:text-white md:ms-2 ms-0 md:mt-0 mt-3 border h-9 px-5 rounded-md'> Change My Passwrod</button>

                </div>

            </div >
            <div className="login-info md:w-2/3 w-full p-5 mt-7 rounded-md bg-white shadow-lg ">

                <p className='text-lg m-0 pb-5 font-medium text-gray-700'>Deactive Your Account </p>
                <p className=''>if you need to cancel your account please reach out to our customer support</p>

                <button className='mt-4 bg-slate-100  hover:bg-sky-600 hover:text-white border h-9 px-5 rounded-md'> Contact us</button>


            </div >





        </div >
    </>
}
