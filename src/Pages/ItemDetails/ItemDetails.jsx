import React, { useEffect } from 'react';
import itemimg from "../../assets/res-logo.jpg";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import def from '../../assets/download.png'


export default function ItemDetails({ item, onClose }) {
  const navigate = useNavigate();


  if (!item) {
    navigate('/');

    return null;
  }

  // const { item } = location.state || {}; // Destructure item from state or set as undefined if not passed

  let menu_id = localStorage.getItem("menu_id")

  // if (!item) {
  //   // If item is undefined, redirect back to menu
  //   navigate('/');
  //   return null;
  // }
  return (
    <div dir='rtl' className="item-details relative inset-0">
      {/* Background image section with bg-fixed */}
      <div
        className="item-img relative h-64 bg-fixed bg-contain  "
      // style={{ backgroundImage: `url(${item.image_url || def})` }}
      >
        <img src={item.image_url} className='w-full h-full ' alt="" />

        <div onClick={onClose} className="back-btn flex cursor-pointer justify-center items-center absolute left-5 top-5 bg-white rounded-full h-9 w-9">

          <i className="fa-solid fa-arrow-left"></i>

        </div>


      </div>

      {/* Item data section */}
      <div className="item-data relative">
        <div className="data w-full h-screen pt-9 rounded-t-3xl absolute -top-11 bg-slate-100 shadow-2xl p-6 ">
          <p className='w-full text-center cairo text-lg font-semibold '>{item.name}</p>
          <div dir='rtl' className="item-desc text-center kufi text-slate-600  mt-5">
            {item.description || ''}
          </div>
          {item.item_prices && item.item_prices.length > 0 && (
            <div className="item-sizes mt-5">
              <p className="text-lg font-medium kufi text-blue-900">الخيارات</p>
              {item.item_prices.map((price, index) => (
                <div key={index} className="item-size mt-2 flex justify-between">
                  <p className="size-name text-slate-700 ">{price.label}</p>
                  <p className="size-price text-slate-700 font-medium">{price.price} EGP</p>
                </div>
              ))}
            </div>
          )}

          {item.item_extras && item.item_extras.length > 0 && (
            <div className="item-extras mt-5">
              <p className="text-lg font-medium kufi text-blue-900">الأضافات</p>
              {item.item_extras.map((extra, index) => (
                <div key={index} className="item-extra mt-2 flex justify-between">
                  <p className="extra-name text-slate-700 ">{extra.label}</p>
                  <p className="extra-price text-slate-700 font-medium">{extra.price} EGP</p>
                </div>
              ))}
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
