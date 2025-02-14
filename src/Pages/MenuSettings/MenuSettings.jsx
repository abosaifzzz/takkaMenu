import React from 'react'
import cover from "../../assets/cover.jpg"
import reslogo from "../../assets/res-logo.jpg"

export default function MenuSettings() {
    return <>
        <div className="menu-settings min-h-screen relative pb-20 flex flex-col  md:p-10 p-7">


            <div className="menu-info md:w-2/3 w-full p-5 rounded-md bg-white shadow-lg h-fit">

                <div className="menu-info-f-section md:flex justify-between">
                    <p className='md:text-lg text-sm pb-4 font-medium text-gray-700'>Menu Information</p>

                    <p className='text-sky-700 text-sm font-medium'>Menu ID : <span className='font-normal text-black text-xs'>DGJSKIL43</span></p>


                </div>


                <div className="menu-images relative mb-12  mt-3">




                    <div className="cover bg-slate-300 relative lg:w-4/6 md:w-4/5">

                        <img src={cover} className='md:h-40 h-32 rounded-md w-full' alt="" />
                        <div className="edit-cover cursor-pointer w-9 h-9 absolute bottom-2 right-2 flex justify-center items-center bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-full">
                            <i className="fa-regular fa-pen-to-square"></i>

                        </div>
                        <div className="rest-logo absolute -bottom-8 left-1/3">
                            <img src={reslogo} className='md:w-32 md:h-32 w-28 h-28 border-4 border-white rounded-full' alt="" />
                            <div className="edit-img cursor-pointer w-9 h-9 absolute bottom-2 right-2 flex justify-center items-center bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-full">
                                <i className="fa-regular fa-pen-to-square"></i>

                            </div>

                        </div>
                    </div>


                </div>




                <div className="menu-name mt-7">
                    <label htmlFor="" className='block pb-3'>Menu Name</label>

                    <input type="text" className='md:w-2/3 w-full h-9 border-2 rounded-md' />

                </div>
                <div className="bio mt-7">
                    <label htmlFor="" className='block pb-3'>Bio</label>

                    <input type="text" className='md:w-2/3 w-full h-9 border-2 rounded-md' />

                </div>
                <div className="open-time pb-8 mt-7">
                    <label htmlFor="open-time" className="block pb-3">Open Time</label>
                    <input
                        type="time"
                        id="open-time"
                        className="md:w-2/3 w-full h-9 border-2 rounded-md px-2"
                    />
                </div>

                <div className="close-time pb-8 mt-7">
                    <label htmlFor="close-time" className="block pb-3">Close Time</label>
                    <input
                        type="time"
                        id="close-time"
                        className="md:w-2/3 w-full h-9 border-2 rounded-md px-2"
                    />
                </div>
                <hr className='pb-6' /> <div className="save-personal-info ">
                    <div className="save flex justify-end">
                        <button className='px-6 py-2  rounded-md bg-sky-600 text-white hover:bg-sky-500'>Save</button>

                    </div>

                </div>


            </div >






        </div>





    </>
}
