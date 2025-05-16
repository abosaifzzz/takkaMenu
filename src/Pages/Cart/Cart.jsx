import React, { useState } from 'react'
import reslogo from "../../assets/res-logo.jpg"
import { Link } from 'react-router-dom'
import ClientAuth from '../../Components/ClientAuth/ClientAuth.jsx';

export default function Cart() {
    const [selectedOrderWay, setSelectedOrderWay] = useState('');
    console.log(selectedOrderWay);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // const handleOrderWayChange = (event) => {
    //     setSelectedOrderWay(event.target.id);  // Update the state with the selected order way
    //     console.log(selectedOrderWay);

    // };


    return <>
        <div dir='rtl' className="cart-page p-3 pb-14  w-full h-full bg-white">
            <div className="cart-details  h-fit border-2">
                <div className="res-logo  h-36 pb-5 flex justify-center items-center  ">
                    <img className='rounded-full border-8 border-white shadow-lg w-32 h-32' src={reslogo} alt="" />


                </div>
                <hr />
                <div dir='rtl' className="items-details p-3">
                    <p className='text-xl font-bold cairo'>تفاصيل الطلب</p>


                </div>
                <hr />
                <div dir='rtl' className="items ">
                    <div className="item p-3 bg-slate-100">
                        <div className="item-name-price flex justify-between">

                            <p className='cairo font-semibold'>فرخة مخلية مشوية - chickn grill</p> <p>250 EGP</p>

                        </div>
                        <div className="item-size">
                            <p className='font-medium'>حجم صغير</p>

                        </div>
                        <div className="item-extras flex justify-between">
                            <p>اضافة جبنة</p> <p>25 EGP</p>
                        </div>
                        <div className="item-extras flex justify-between">
                            <p>اضافة بيبسي</p> <p>35 EGP</p>
                        </div>
                        <div className="item-count  mt-4 flex justify-center w-full">
                            <div className="count flex justify-evenly items-center gap-3 w-28 h-9 border bg-white rounded-lg">
                                <i className="fa-solid p-1 rounded-full bg-slate-100 hover:bg-slate-200 fa-plus "></i>
                                <p className='text-xl'>2</p>
                                <i className="fa-solid fa-minus p-1 rounded-full bg-slate-100 hover:bg-slate-200 "></i>
                            </div>


                        </div>
                    </div>
                    <div className="item p-3 bg-slate-100">
                        <div className="item-name-price flex justify-between">

                            <p className='cairo font-semibold'>فرخة مخلية مشوية - chickn grill</p> <p>250 EGP</p>

                        </div>
                        <div className="item-size">
                            <p className='font-medium'>حجم صغير</p>

                        </div>
                        <div className="item-extras flex justify-between">
                            <p>اضافة جبنة</p> <p>25 EGP</p>
                        </div>
                        <div className="item-extras flex justify-between">
                            <p>اضافة بيبسي</p> <p>35 EGP</p>
                        </div>
                        <div className="item-count  mt-4 flex justify-center w-full">
                            <div className="count flex justify-evenly items-center gap-3 w-28 h-9 border bg-white rounded-lg">
                                <i className="fa-solid p-1 rounded-full bg-slate-100 hover:bg-slate-200 fa-plus "></i>
                                <p className='text-xl'>2</p>
                                <i className="fa-solid fa-minus p-1 rounded-full bg-slate-100 hover:bg-slate-200 "></i>
                            </div>


                        </div>
                    </div>
                    <div className="item p-3 bg-slate-100">
                        <div className="item-name-price flex justify-between">

                            <p className='cairo font-semibold'>فرخة مخلية مشوية - chickn grill</p> <p>250 EGP</p>

                        </div>
                        <div className="item-size">
                            <p className='font-medium'></p>

                        </div>
                        <div className="item-extras flex justify-between">
                            <p></p> <p></p>
                        </div>

                        <div className="item-count  mt-4 flex justify-center w-full">
                            <div className="count flex justify-evenly items-center gap-3 w-28 h-9 border bg-white rounded-lg">
                                <i className="fa-solid p-1 rounded-full bg-slate-100 hover:bg-slate-200 fa-plus "></i>
                                <p className='text-xl'>2</p>
                                <i className="fa-solid fa-minus p-1 rounded-full bg-slate-100 hover:bg-slate-200 "></i>
                            </div>


                        </div>
                    </div>
                    <div className="add-more flex justify-center my-3">
                        <Link to={"/menu"}>
                            <button className='bg-lime-600 cairo text-white px-3 py-2 rounded-md '> اضافة المزيد</button>
                        </Link>
                    </div>

                </div>
                <hr />
                <div className="total-price p-3 flex justify-between">
                    <p className='cairo font-bold'>السعر الكلي </p> <p className=' font-bold'>350 EGP</p>


                </div>
                <hr />
                <div className="order-way p-3">
                    <input onClick={() => {
                        setSelectedOrderWay("table")
                    }}

                        name="order-group" id={`table`} className="items-button__input" type="radio" />
                    <label htmlFor={`table`} className="items-button__label w-full">
                        <span className="items-button__custom"></span>
                        <p className='font-medium cairo'>داخل المطعم</p>
                    </label>
                    <input onClick={() => {
                        setSelectedOrderWay("pickup")
                    }} name="order-group" id={`pickup`} className="items-button__input" type="radio" />
                    <label htmlFor={`pickup`} className="items-button__label w-full">
                        <span className="items-button__custom"></span>
                        <p className='font-medium cairo'>Pickup</p>
                    </label>
                    <input onClick={() => {
                        setSelectedOrderWay("takeaway")
                    }} name="order-group" id={`takeaway`} className="items-button__input" type="radio" />
                    <label htmlFor={`takeaway`} className="items-button__label w-full">
                        <span className="items-button__custom"></span>
                        <p className='font-medium cairo'>تيك اواي</p>
                    </label>
                    <input onClick={() => {
                        setSelectedOrderWay("delivery")
                    }} name="order-group" id={`delivery`} className="items-button__input" type="radio" />
                    <label htmlFor={`delivery`} className="items-button__label w-full">
                        <span className="items-button__custom"></span>
                        <p className='font-medium cairo'>دليفري</p>
                    </label>
                </div>
                <hr />

                <div className="go-login flex justify-center mb-7 items-center p-3">
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className='py-2 px-4 bg-green-500 rounded-md cairo font-semibold text-white'
                    >
                        تنفيذ الطلب
                    </button>
                </div>

            </div>

            {showAuthModal && (
                <ClientAuth
                    selectedOrderWay={selectedOrderWay}
                    onClose={() => setShowAuthModal(false)}
                />
            )}


        </div>


    </>
}
