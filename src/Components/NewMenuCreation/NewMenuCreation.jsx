import React, { useState } from 'react'
import shop from "../../assets/shop.png"
import paint from "../../assets/paint.png"
import sample from "../../assets/sample.png"


export default function NewMenuCreation() {
    const [createForm, setCreateForm] = useState(false);
    const [module, setModule] = useState(null);


    const openCreateForm = () => {
        setCreateForm(true);
    };
    const closeCreateForm = () => {
        setCreateForm(false);

        setModule(null)
    };


    return <>
        <div className="new-menu-creation relative flex flex-col h-screen items-center p-8">


            <img className='w-14' src={shop} alt="" />
            {/* <i className="fa-solid text-3xl text-sky-500 fa-hourglass"></i> */}
            <p>You don’t have any menu yet. Start creating one.
            </p>
            <button onClick={openCreateForm} className='py-2 px-3 hover:bg-sky-600 bg-sky-500 text-white rounded-md mt-2'>Create Menu</button>


            <div
                className={`creation-form shadow-lg flex flex-col items-center absolute w-3/5 bg-white rounded-lg 
                transition-all duration-300 ease-in-out 
                ${createForm ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >                    <div className="close">
                    <p onClick={closeCreateForm} className='text-gray-600 absolute top-4 left-4'>X</p>
                </div>
                <p className='font-medium pt-5 text-sky-700 text-2xl'>Let's Setup your Digital Menu Now!</p>
                <p className=' font-thin text-gray-700'> remember you can manage and Edit it anytime.</p>
                <div className="modules mt-5 flex gap-3">

                    <div
                        className={`scratch flex flex-col items-center justify-center w-52 h-52 rounded-md border 
                    cursor-pointer transition-all duration-200 ${module === "scratch" ? "border-sky-500 bg-blue-100" : "border-gray-300"
                            }`}
                        onClick={() => setModule("scratch")}
                    >                        {/* <i className="text-sky-700 text-xl fa-solid fa-paintbrush"></i>
          */}
                        <img src={paint} className='w-13 h-13' alt="" />
                        <p className='mt-4  font-medium'>Start From Scratch</p>
                        <p className='text-sm text-gray-700'>Start with empty menu</p>



                    </div>
                    <div
                        className={`sample flex flex-col items-center justify-center w-52 h-52 rounded-md border 
                    cursor-pointer transition-all duration-200 ${module === "sample" ? "border-sky-500 bg-blue-100" : "border-gray-300"
                            }`}
                        onClick={() => setModule("sample")}
                    >                        {/* <i className="text-sky-700 text-xl fa-solid fa-paintbrush"></i>
          */}
                        <img src={sample} className='w-13 h-16' alt="" />
                        <p className='mt-4  font-medium'>Create a Sample Menu</p>
                        <p className='text-sm text-center text-gray-700'>Start by modifying an already built menu.</p>



                    </div>
                </div>
                <div className="action-b mt-4 flex w-full justify-end items-end">
                    <button
                        disabled={!module}
                        className={`m-3 text-white px-3 py-2 rounded-md transition-all duration-200 ${module ? "bg-sky-700 hover:bg-sky-600" : "bg-sky-300 cursor-not-allowed"
                            }`}
                    >Continue</button>
                </div>

            </div>




        </div>



    </>


}
