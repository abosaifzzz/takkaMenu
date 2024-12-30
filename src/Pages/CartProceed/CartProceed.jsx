import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function CartProceed() {
    const [isNotesVisible, setIsNotesVisible] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    // Step 2: Handle change event for radio buttons
    const handleRadioChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };


    // Step 2: Toggle visibility when clicking the text
    const toggleNotesVisibility = () => {
        setIsNotesVisible(prevState => !prevState);
    };
    const location = useLocation();  // Access the location object
    const selectedOrderWay = location.state?.selectedOrderWay;
    console.log(selectedOrderWay);

    return <>
        <div dir='rtl' className="cart-page p-3 pb-14  w-full h-full bg-white">
            <div className="cart-details  h-fit border-2">
                <div dir='rtl' className="items-details flex justify-between p-3">
                    <p className='text-lg font-bold cairo'>تفاصيل الطلب</p>
                    <Link to={"/cart"}>
                        <p className='text-lg font-bold cairo text-green-600'>تعديل الطلب</p>
                    </Link>
                </div>
                <hr />
                <div dir='rtl' className="items mt-3 ">
                    <div className="items-head flex bg-gray-200  p-2  ">
                        <p className='w-2/5 font-bold cairo'>الصنف</p>
                        <p className='w-1/5 text-center font-bold cairo'>الكمية</p>
                        <p className='w-1/5 text-center font-bold cairo'>السعر</p>
                        <p className='w-1/5 text-center font-bold cairo'>المجموع</p>


                    </div>
                    <div className="item  p-3 bg-slate-50">
                        <div className="item-name-price  flex justify-between">

                            <p className='cairo w-2/5 font-semibold'>فرخة مخلية مشوية - chickn grill</p>
                            <p className='w-1/5 text-center'>2</p>

                            <p className='text-center w-1/5 text-sm font-semibold'>250 EGP</p>
                            <p className='text-end w-1/5 text-sm font-semibold'>300 EGP</p>


                        </div>
                        <div className="item-size ">
                            <p className='text-slate-500'>حجم صغير</p>

                        </div>
                        <div className="item-extras flex justify-between">
                            <p className='cairo w-2/5 font-semibold'>اضافة جبنة</p>
                            <p className='w-1/5 text-center'>-</p>

                            <p className='text-center w-1/5 text-sm font-semibold'>250 EGP</p>
                            <p className='text-end w-1/5 text-sm font-semibold'>300 EGP</p>

                        </div>
                        <div className="item-extras flex justify-between">
                            <p className='cairo w-2/5 font-semibold'>اضافة جبنة</p>
                            <p className='w-1/5 text-center'>-</p>

                            <p className='text-center w-1/5 text-sm font-semibold'>250 EGP</p>
                            <p className='text-end w-1/5 text-sm font-semibold'>300 EGP</p>

                        </div>
                        <hr className='my-2' />
                    </div>
                    <div className="item  p-3 bg-slate-50">
                        <div className="item-name-price  flex justify-between">

                            <p className='cairo w-2/5 font-semibold'>فرخة مخلية مشوية - chickn grill</p>
                            <p className='w-1/5 text-center'>1</p>

                            <p className='text-center w-1/5 text-sm font-semibold'>250 EGP</p>
                            <p className='text-end w-1/5 text-sm font-semibold'>250 EGP</p>


                        </div>


                        <div className="item-extras flex justify-between">
                            <p className='cairo w-2/5 font-semibold'>اضافة جبنة</p>
                            <p className='w-1/5 text-center'>-</p>

                            <p className='text-center w-1/5 text-sm font-semibold'>250 EGP</p>
                            <p className='text-end w-1/5 text-sm font-semibold'>300 EGP</p>

                        </div>
                        <hr className='my-2' />
                    </div>
                    <div className="item  p-3 bg-slate-50">
                        <div className="item-name-price  flex justify-between">

                            <p className='cairo w-2/5 font-semibold'>لحمة مستوية</p>
                            <p className='w-1/5 text-center'>2</p>

                            <p className='text-center w-1/5 text-sm font-semibold'>250 EGP</p>
                            <p className='text-end w-1/5 text-sm font-semibold'>300 EGP</p>


                        </div>
                        <div className="item-size ">
                            <p className='text-slate-500'>حجم صغير</p>

                        </div>
                        <div className="item-extras flex justify-between">
                            <p className='cairo w-2/5 font-semibold'>اضافة جبنة</p>
                            <p className='w-1/5 text-center'>-</p>

                            <p className='text-center w-1/5 text-sm font-semibold'>250 EGP</p>
                            <p className='text-end w-1/5 text-sm font-semibold'>300 EGP</p>

                        </div>
                        <div className="item-extras flex justify-between">
                            <p className='cairo w-2/5 font-semibold'>اضافة جبنة</p>
                            <p className='w-1/5 text-center'>-</p>

                            <p className='text-center w-1/5 text-sm font-semibold'>250 EGP</p>
                            <p className='text-end w-1/5 text-sm font-semibold'>300 EGP</p>

                        </div>
                        <hr className='my-2' />
                    </div>

                </div>
                <hr />
                <div className="order-notes px-3 py-2">
                    <p
                        className='cairo open-note hover:text-blue-500 cursor-pointer'
                        onClick={toggleNotesVisibility}
                    >
                        اضف ملاحظاتك الخاصة هنا
                        <i className={`fa-solid ps-1 ${isNotesVisible ? "fa-angle-up" : "fa-angle-down"}`}></i>
                    </p>
                    <div
                        className={`notes transition-all duration-300 ease-in-out overflow-hidden ${isNotesVisible ? "h-auto p-2" : "h-0 p-0"}`}
                        style={{ maxHeight: isNotesVisible ? "200px" : "0" }} // This allows a smooth slide effect
                    >
                        <textarea
                            className='border w-full min-h-10 px-2 overflow-auto border-gray-500 rounded-md resize-none'
                            placeholder='مثال: بدون خضار بدون كاتشب'
                            rows="2"
                        />
                        <p className='kufi text-gray-500 text-sm'>
                            يرجي العلم طلب اي اضافة لها مقابل مادي يعتبر الطلب لاغي
                        </p>
                    </div>
                </div>
                <hr />
                <div className="order-way-details p-3">
                    <div className={`table-way ${selectedOrderWay == "table" ? "" : "hidden"}`}>
                        <label htmlFor="table " className='font-medium'> رقم الطاولة:</label>
                        <input className='block mt-2 w-44 h-9 border-2 p-2 border-gray-300 rounded-md' type="text" name="" id="" placeholder="مثال : 5" />
                        <hr className='mt-2' />

                        <div className="proceed-price p-3 ">
                            <div className="price flex justify-between">
                                <p className='cairo font-semibold text-sm mt-2'>المبلغ الفرعي </p> <p className='text-sm font-semibold'>350 EGP</p>

                            </div>
                            <div className="delivery-fees flex justify-between">
                                <p className='cairo font-semibold text-sm mt-2'>خدمة توصيل </p> <p className='text-sm font-semibold'>20 EGP</p>


                            </div>
                            <div className="taxes flex justify-between">
                                <p className='cairo font-semibold text-sm mt-2'>الخدمة او الضريبة </p> <p className='text-sm font-semibold'>20 EGP</p>

                            </div>
                            <div className="total-price flex items-center justify-between">
                                <p className='cairo font-semibold cairo text-lg mt-2'>المبلغ الأجمالي  </p> <p className='text-lg font-semibold cairo'>580 EGP</p>

                            </div>



                        </div>
                        <hr />
                    </div>
                    <div className={`pickup-way ${selectedOrderWay == "pickup" ? "" : "hidden"}`}>
                        <label htmlFor="table " className='font-medium cairo'> الأسم</label>

                        <input className='block mt-2 w-full h-9 border-2 p-2 border-gray-300 rounded-md' type="text" name="" id="" placeholder="مثال : محمد طارق" />

                        <label htmlFor="pickup " className='font-medium pt-4 cairo'> رقم الموبايل</label>
                        <input className='block mt-2 w-full mb-3 h-9 border-2 p-2 border-gray-300 rounded-md' type="text" name="" id="" placeholder="مثال : 010105668135" />

                        <hr />
                        <div className="pay-options mt-3">
                            <p className='cairo font-semibold mb-2'>وسيلة الدفع </p>
                            <div className="credit-option shadow-md w-full flex items-center justify-between p-2 h-12 bg-slate-100">
                                <div className="credit-icon flex gap-2">
                                    <i className="text-xl text-pink-900 fa-brands fa-cc-visa"></i>
                                    <span className='cairo'>بطاقة ائتمان</span>
                                </div>
                                <div className="radio-btn">
                                    <input
                                        name="order-group"
                                        id="credit"
                                        className="items-button__input pt-3"
                                        type="radio"
                                        value="credit-card"
                                        onChange={handleRadioChange}
                                        checked={selectedPaymentMethod === 'credit-card'}
                                    />
                                    <label htmlFor="credit" className="items-button__label w-full">
                                        <span className="items-button__custom"></span>
                                    </label>
                                </div>
                            </div>
                            <div
                                className={`credit-data overflow-hidden transition-all duration-500 ease-in-out 
          ${selectedPaymentMethod === 'credit-card' ? 'max-h-[500px] opacity-100 p-2' : 'max-h-0 opacity-0 p-0'}`}
                                style={{ maxHeight: selectedPaymentMethod === 'credit-card' ? '500px' : '0' }}
                            >
                                <input
                                    type="text"
                                    className='w-full px-2 cairo border border-slate-400 h-10 rounded-md'
                                    placeholder='اسم حامل البطاقة' // "Cardholder's Name" in Arabic
                                />
                                <input
                                    type="text"
                                    className='w-full px-2 cairo mt-3 border border-slate-400 h-10 rounded-md'
                                    placeholder='رقم بطاقة الائتمان' // "Credit Card Number" in Arabic
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className='w-1/2 px-2 mt-3 border border-slate-400 h-10 rounded-md'
                                        placeholder='MM/YY' // Expiration date format
                                    />
                                    <input
                                        type="text"
                                        className='w-1/2 px-2 mt-3 border border-slate-400 h-10 rounded-md'
                                        placeholder='CVV' // Card verification value
                                    />
                                </div>
                            </div>
                            {/* Cash Option */}
                            <div className="cash-option shadow-md mt-2 w-full flex items-center justify-between p-2 h-12 bg-slate-100">
                                <div className="credit-icon flex items-center gap-2">
                                    <i className="fa-solid text-xl text-yellow-600 fa-money-bill"></i>
                                    <span className='cairo'>نقداّ</span>
                                </div>
                                <div className="radio-btn">
                                    <input
                                        name="order-group"
                                        id="cash"
                                        className="items-button__input pt-3"
                                        type="radio"
                                        value="cash"
                                        onChange={handleRadioChange}
                                        checked={selectedPaymentMethod === 'cash'}
                                    />
                                    <label htmlFor="cash" className="items-button__label w-full">
                                        <span className="items-button__custom"></span>
                                    </label>
                                </div>
                            </div>

                            {/* Credit Data Section - Shown when "credit-card" is selected */}


                        </div>
                        <hr className='mt-2' />

                        <div className="proceed-price p-3 ">
                            <div className="price flex justify-between">
                                <p className='cairo font-semibold text-sm mt-2'>المبلغ الفرعي </p> <p className='text-sm font-semibold'>350 EGP</p>

                            </div>
                            <div className="delivery-fees flex justify-between">
                                <p className='cairo font-semibold text-sm mt-2'>خدمة توصيل </p> <p className='text-sm font-semibold'>20 EGP</p>


                            </div>
                            <div className="taxes flex justify-between">
                                <p className='cairo font-semibold text-sm mt-2'>الخدمة او الضريبة </p> <p className='text-sm font-semibold'>20 EGP</p>

                            </div>
                            <div className="total-price flex items-center justify-between">
                                <p className='cairo font-semibold cairo text-lg mt-2'>المبلغ الأجمالي  </p> <p className='text-lg font-semibold cairo'>580 EGP</p>

                            </div>



                        </div>
                        <hr />

                    </div>
                </div>
                <hr />

                <div className="proceed flex justify-center mb-7 items-center p-3">

                    <button className='py-2 px-4 bg-green-500 rounded-md cairo font-semibold text-white'>تنفيذ الطلب</button>

                </div>

            </div>





        </div >
    </>
}
