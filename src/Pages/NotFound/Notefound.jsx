import React from 'react'

import notfound from "../../assets/404.png"
import { Link } from 'react-router-dom'
export default function Notefound() {
    return <>

        <div className="not-found-page min-h-screen flex flex-col justify-center items-center">
            <div className="img  flex justify-center w-3/5 h-1/2">

                <img className='md:w-2/3 w-full' src={notfound} alt="" />


            </div>

            <div className="texts flex items-center gap-2">
                <Link to={"/"}>                <button className='bg-red-200  rounded-md px-2 py-1 hover:bg-red-100 cairo md:text-2xl text-lg'>الرئيسية</button></Link>


                <p className='cairo md:text-2xl text-lg'> طريقك مسدود مسدود اذهب للصفحة</p>
            </div>

        </div>


    </>
}
