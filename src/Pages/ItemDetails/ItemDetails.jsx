import React, { useEffect } from 'react';
import itemimg from "../../assets/res-logo.jpg";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function ItemDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {}; // Destructure item from state or set as undefined if not passed
  useEffect(() => {
    // Scroll to the top of the page on component mount
    window.scrollTo(0, 0);
  }, []);


  if (!item) {
    // If item is undefined, redirect back to menu
    navigate('/');
    return null;
  }
  return (
    <div dir='rtl' className="item-details">
      {/* Background image section with bg-fixed */}
      <div
        className="item-img relative h-64 bg-fixed bg-contain  "
        style={{ backgroundImage: `url(${item.image || itemimg})` }}
      >
        <div className="back-btn flex justify-center items-center absolute left-5 top-5 bg-white rounded-full h-9 w-9">
          <Link to={"/menu"}>
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
        </div>


      </div>

      {/* Item data section */}
      <div className="item-data relative">
        <div className="data w-full h-screen pt-9 rounded-t-3xl absolute -top-11 bg-slate-100 shadow-2xl p-6 ">
          <p className='w-full text-center cairo text-lg font-semibold '>{item.name}</p>
          <div dir='rtl' className="item-desc kufi font-medium mt-5">
            {item.description || ''}
          </div>
          {item.sizes && item.sizes.length > 0 && (
            <div className="item-sizes mt-5">
              <p className="text-lg font-medium kufi text-blue-900">الخيارات</p>
              {item.sizes.map((size, index) => (
                <div key={index} className="item-size mt-2 flex justify-between">
                  <p className="size-name font-medium">{size.name}</p>
                  <p className="size-price font-medium">{size.price} EGP</p>
                </div>
              ))}
            </div>
          )}

          {item.extras && item.extras.length > 0 && (
            <div className="item-extras mt-5">
              <p className="text-lg font-medium kufi text-blue-900">الأضافات</p>
              {item.extras.map((extra, index) => (
                <div key={index} className="item-extra mt-2 flex justify-between">
                  <p className="extra-name font-medium">{extra.name}</p>
                  <p className="extra-price font-medium">{extra.price} EGP</p>
                </div>
              ))}
            </div>
          )}


        </div>
      </div>
    </div>
  );
}