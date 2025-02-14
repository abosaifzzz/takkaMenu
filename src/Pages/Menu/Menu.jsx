import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import def from '../../assets/download.png'

import cover from "../../assets/cover.jpeg"
import reslogo from "../../assets/res-logo.jpg"
import kofta from "../../assets/kofta.jpg"

import fb from "../../assets/fb.png"
import wp from "../../assets/wp.png"
import call from "../../assets/call.png"
import massenger from "../../assets/massenger.png"

import instapay from "../../assets/instapay.png"
import instagram from "../../assets/instagram.png"
import location from "../../assets/location.png"

import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';



export default function Menu() {
    const navigate = useNavigate();

    const handleItemDetailsClick = (item) => {
        navigate('/item-details', { state: { item } });
    };
    const [sections, setSections] = useState([]);

    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [activeSection, setActiveSection] = useState("menu");
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected item data
    const [isFormVisible, setFormVisible] = useState(false); // State to control the form visibility
    const [cart, setCart] = useState([]); // Stores items in the cart
    const [cartCount, setCartCount] = useState(0); // 
    const { menu_id } = useParams(); // Get menu_id dynamically from the URL
    const [locationUrl, setLocationUrl] = useState(""); // Stored Location URL
    const [instagramUrl, setInstagramUrl] = useState(""); // Stored Instagram URL
    const [whatsAppUrl, setWhatsAppUrl] = useState("");
    const [facebookUrl, setFacebookUrl] = useState(""); // Stored Facebook URL


    const fetchLocationAccount = async () => {
        try {
            const response = await axios.get(`http://localhost:234/api/location-account/${menu_id}`);
            if (response.data?.url) {
                setLocationUrl(response.data.url);
            }
        } catch (err) {
            console.error("Error fetching Location URL:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInstagramAccount = async () => {
        try {
            const response = await axios.get(`http://localhost:234/api/instagram-account/${menu_id}`);
            if (response.data?.url) {
                console.log(response.data?.url);

                setInstagramUrl(response.data.url);
            }
        } catch (err) {
            console.error("Error fetching Instagram URL:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFacebookAccount = async (menu_id) => {


        try {
            console.log(menu_id);

            const response = await axios.get(`http://localhost:234/api/facebook-account/${menu_id}`);

            if (response.data && response.data.url) {

                setFacebookUrl(response.data.url);

            } else {
                console.log("errrrr");

            }
        } catch (err) {
            console.log(err);

        } finally {
            setLoading(false);
        }
    };
    const fetchWhatsappAccount = async (menu_id) => {


        try {

            const response = await axios.get(`http://localhost:234/api/whatsapp-account/${menu_id}`);

            if (response.data && response.data.url) {
                let url = response.data.url;
                let phoneNumber = url.replace("https://wa.me/", "");

                // setFacebookAccount(response.data);
                setWhatsAppUrl(response.data.url);
                setTempWhatsAppUrl(phoneNumber); // Sync temp value
                setIsWhatsAppDisabled(true); // Disable input if URL exists
                setIsUpdateWhatsApp(true); // Show "Update" button            } else {


                // setFacebookAccount(null);
            }
        } catch (err) {
            console.log(err);

            // setFacebookAccount(null);
        } finally {
            setLoading(false);
        }
    };
    const fetchPhones = async () => {
        try {
            const response = await axios.get(`http://localhost:234/api/contacts/${menu_id}`);
            if (response.data.length > 0) {
                setPhones(response.data.map(contact => contact.phone)); // Assuming API returns an array of objects with a `phone` field
            } else {
                setPhones([""]); // Default input field if no numbers exist
            }
        } catch (error) {
            console.error("Error fetching phone numbers:", error);
        }
    };

    async function getSections(menu_id) {
        try {
            // Fetch sections using menu_id
            const response = await axios.get(`http://localhost:234/api/menusection/${menu_id}`);
            console.log(response);

            if (response.data) {
                const sectionsWithImages = await Promise.all(
                    response.data.map(async (section) => {
                        // If a cover_image exists, fetch the image URL
                        if (section.cover_image) {
                            try {
                                const imageResponse = await axios.get(
                                    `http://localhost:234/api/file/${section.cover_image}`,
                                    { responseType: "blob" } // Fetch the image as a blob
                                );
                                const imageUrl = URL.createObjectURL(imageResponse.data); // Create a URL for the blob
                                return { ...section, cover_image_url: imageUrl }; // Add the URL to the section object
                            } catch (imageError) {
                                console.error(`Error fetching image for ${section.cover_image}`, imageError);
                                return { ...section, cover_image_url: null }; // Fallback to null if image fetch fails
                            }
                        }
                        return { ...section, cover_image_url: null }; // No image case
                    })
                );
                console.log(sectionsWithImages);
                setSections(sectionsWithImages); // Update the state with sections including image URLs
            }
        } catch (error) {
            console.error("Error fetching sections:", error);
            toast.error("حدث خطأ أثناء جلب الأقسام");

            // Fallback dummy data
            const dummyData = [
                {
                    id: 15,
                    menu_id: menu_id,
                    name: "Sample Section 1",
                    note: "",
                    badge: null,
                    cover_image: null,
                    is_available: true,
                    is_offer: false,
                    items: [],
                    cover_image_url: "blob:http://localhost:5173/ef391261-b773-46e5-b1c4-b44e174bd44f",
                },
                {
                    id: 16,
                    menu_id: menu_id,
                    name: "Sample Section 2",
                    note: "",
                    badge: null,
                    cover_image: null,
                    is_available: true,
                    is_offer: false,
                    items: [],
                    cover_image_url: null,
                },
                {
                    id: 17,
                    menu_id: menu_id,
                    name: "Sample Section 3",
                    note: "Note for section 3",
                    badge: null,
                    cover_image: null,
                    is_available: true,
                    is_offer: false,
                    items: [],
                    cover_image_url: "blob:http://localhost:5173/57972719-e9be-4752-9b36-399961d135b4",
                },
            ];
            setSections(dummyData);
        }
    }

    useEffect(() => {

        fetchWhatsappAccount(menu_id);
        fetchLocationAccount(menu_id);
        fetchPhones(menu_id);
        getSections(menu_id)
        fetchFacebookAccount(menu_id);
        fetchInstagramAccount(menu_id);


    }, [menu_id]);



    // Function to handle item click
    const handleItemClick = (e, item) => {
        e.stopPropagation(); // Stop event from bubbling up only in specific cases

        if ((item.sizes && item.sizes.length > 1) || (item.extras && item.extras.length > 0)) {

            setSelectedItem(item);
            setFormVisible(true);
        } else {
            addToCart(item); // Directly add item to the cart if no additional options are needed
        }
    };

    const addToCart = (item) => {
        setCart([...cart, item]); // Adds the item to the cart
        setCartCount(cartCount + 1); // Increments the item count by 1
    };

    // Function to close the form
    const closeForm = () => {
        setFormVisible(false);
        setSelectedItem(null);
    };

    const handleClick = (e) => {
        e.preventDefault();
        if (!loading) {
            setLoading(true);
            setTimeout(() => setLoading(false), 3700); // Reset loading after 3.7 seconds
        }
    };


    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1; // Adjust scroll speed if needed
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const sectionTab = (sectionName) =>
        `cursor-pointer py-2 px-2   md:text-xl text-[1rem] cairo font-[650] ${activeSection === sectionName
            ? "border-b-2 border-[#20617c]"
            : "text-[#20617c] "
        } `;
    const categories = [
        {
            id: 1,
            image: cover,
            name: 'الأفطار الصباحي',
            items: [
                {
                    id: 101,
                    name: 'Grilled chicken - فرخة مشوية',
                    price: 'EGP 200',
                    image: reslogo,
                    sizes: [
                        { name: 'Small', price: 'EGP 200' },
                        { name: 'Medium', price: 'EGP 350' },
                        { name: 'Large', price: 'EGP 600' }
                    ],
                    extras: [
                        { name: 'Extra Sauce', price: 'EGP 20' },
                        { name: 'Extra Cheese', price: 'EGP 30' }
                    ]
                },
                {
                    id: 102,
                    name: 'Grilled werk - فرخة نص',
                    price: 'EGP 100',
                    image: kofta,
                    sizes: [],
                    extras: []
                },
                {
                    id: 103,
                    name: 'Scrambled Eggs - بيض مقلي',
                    price: 'EGP 500 - EGP 3600',
                    image: kofta,
                    sizes: [
                        { name: 'Single', price: 'EGP 500' },
                        { name: 'Family Pack', price: 'EGP 3600' }
                    ],
                    extras: [
                        { name: 'Extra Butter', price: 'EGP 10' },
                        { name: 'Vegetables', price: 'EGP 15' }
                    ]
                },
                {
                    id: 104,
                    name: 'Foul & Falafel - فول و فلافل',
                    price: 'EGP 20 ',
                    image: kofta,
                    sizes: [],
                    extras: []
                }
            ]
        },
        {
            id: 2,
            image: instapay,
            name: 'الأفطار المسائي',
            items: [
                {
                    id: 201,
                    name: 'Grilled - مشوية',
                    price: 'EGP 350',
                    image: kofta,
                    sizes: [

                    ],
                    extras: [
                        { name: 'Grilled Vegetables', price: 'EGP 30' },
                        { name: 'Extra Lemon', price: 'EGP 10' }
                    ]
                },
                {
                    id: 202,
                    name: 'موزة كبيرة اوي',
                    price: 'EGP 500',
                    image: kofta,
                    sizes: [
                        { name: 'Regular', price: 'EGP 500' }
                    ],
                    extras: [
                        { name: 'Extra Garlic', price: 'EGP 15' },
                        { name: 'Mint Sauce', price: 'EGP 20' }
                    ]
                },
                {
                    id: 203,
                    name: 'Mixed Grill - مشاوي مشكلة',
                    price: 'EGP 450 ',
                    image: kofta,
                    sizes: [],
                    extras: []
                },
                {
                    id: 204,
                    name: 'Seafood Platter - طبق بحري',
                    price: 'EGP 600',
                    image: kofta,
                    sizes: [
                        { name: 'Single', price: 'EGP 600' },
                        { name: 'Family Size', price: 'EGP 1200' }
                    ],
                    extras: [
                    ]
                }
            ]
        },
        {
            id: 3,
            image: instapay,
            name: 'العشاء',
            items: [
                {
                    id: 301,
                    name: 'Stuffed Pigeon - حمام محشي',
                    price: 'EGP 150',
                    image: kofta,
                    sizes: [
                        { name: 'Single', price: 'EGP 150' },
                        { name: 'Double', price: 'EGP 250' },
                        { name: 'Duoble Dose', price: 'EGP 120' }

                    ],
                    extras: [
                        { name: 'Extra Rice', price: 'EGP 20' },
                        { name: 'Extra Pigeon', price: 'EGP 100' }
                    ]
                },
                {
                    id: 302,
                    name: 'Kebab & Kofta - كباب وكفتة',
                    price: 'EGP 400',
                    image: kofta,
                    sizes: [
                        { name: 'Half Plate', price: 'EGP 400' },
                        { name: 'Full Plate', price: 'EGP 600' }
                    ],
                    extras: [
                        { name: 'Extra Kofta', price: 'EGP 50' },
                        { name: 'Garlic Dip', price: 'EGP 10' }
                    ]
                },
                {
                    id: 303,
                    name: 'Roasted Lamb - خروف مشوي',
                    price: 'EGP 1000',
                    image: kofta,
                    sizes: [],
                    extras: [
                        { name: 'Extra Meat', price: 'EGP 200' },
                        { name: 'Mint Yogurt', price: 'EGP 15' }
                    ]
                },
                {
                    id: 304,
                    name: 'Stuffed Vegetables - محشي',
                    price: 'EGP 70 - EGP 120',
                    image: kofta,
                    sizes: [
                        { name: 'Small Tray', price: 'EGP 70' },
                    ],
                    extras: [
                        { name: 'Extra Filling', price: 'EGP 10' },
                        { name: 'Extra Vegetables', price: 'EGP 15' }
                    ]
                }
            ]
        },
        {
            id: 4,
            image: cover,
            name: 'الغداء',
            items: [
                {
                    id: 401,
                    name: 'Molokhia with Rice - ملوخية بالأرز',
                    price: 'EGP 80',
                    image: kofta,
                    sizes: [
                        { name: 'Small', price: 'EGP 50' },
                        { name: 'Large', price: 'EGP 80' }
                    ],
                    extras: [
                        { name: 'Extra Molokhia', price: 'EGP 15' },
                        { name: 'Extra Rice', price: 'EGP 10' }
                    ]
                },
                {
                    id: 402,
                    name: 'Shish Tawook - شيش طاووق',
                    price: 'EGP 200',
                    image: kofta,
                    sizes: [
                        { name: 'Single', price: 'EGP 200' },
                        { name: 'Double', price: 'EGP 350' }
                    ],
                    extras: [
                        { name: 'Garlic Dip', price: 'EGP 10' },
                        { name: 'Extra Skewer', price: 'EGP 50' }
                    ]
                },
                {
                    id: 403,
                    name: 'Baked Fish - سمك مشوي',
                    price: 'EGP 300',
                    image: kofta,
                    sizes: [
                        { name: 'Single', price: 'EGP 300' },
                        { name: 'Family Size', price: 'EGP 600' }
                    ],
                    extras: [
                        { name: 'Extra Fish Fillet', price: 'EGP 100' },
                        { name: 'Lemon Sauce', price: 'EGP 20' }
                    ]
                },
                {
                    id: 404,
                    name: 'Beef Stroganoff - بيف ستروغانوف',
                    price: 'EGP 450',
                    image: kofta,
                    sizes: [
                        { name: 'Small', price: 'EGP 450' },
                        { name: 'Large', price: 'EGP 700' }
                    ],
                    extras: [
                        { name: 'Extra Beef', price: 'EGP 100' },
                        { name: 'Extra Sauce', price: 'EGP 30' }
                    ]
                }
            ]
        }
    ];

    const getPriceRange = (item) => {
        if (item.item_prices && item.item_prices.length > 1) {
            const prices = item.item_prices.map(itemPrice => parseFloat(itemPrice.price.replace('EGP ', '')));
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            return `EGP ${minPrice} - EGP ${maxPrice}`;
        }
        return item.price; // Return the base price if no multiple sizes
    };


    return <>
        <div className="menu  bg-slate-100">
            <div className="menu-cover-pic relative h-44 shadow-xl shadow-slate-200  bg-red-100 flex justify-center items-center">
                <div className="close-label bg-red-500 flex justify-center items-center absolute top-0 left-0 right-0 h-8">
                    <p className='text-white'><i className="fa-solid fa-circle-exclamation text-gray-400"></i> Closed at 2:00 Am </p>

                </div>
                <img className='w-full h-full object-cover' src={cover} alt="" />
                <div className="profile-pic absolute -bottom-1/3 border-4 border-white shadow-lg w-44 h-44 rounded-full overflow-hidden">
                    <img src={reslogo} alt="" className="w-full h-full object-cover" />
                </div>
            </div>
            <div className="name-bio flex flex-col items-center mt-20">
                <p className='name text-xl font-medium'>Mekato Cafe</p>
                <p className='bio text-gray-600'>20% taxes and services in weekend </p>

            </div>
            <div className="contact-icons w-72 mx-auto mt-3 gap-2 flex justify-center">


                {whatsAppUrl ?

                    <div className="whatsapp  w-8 h-8 flex justify-center items-center bg-green-50 rounded-full">

                        <a href={whatsAppUrl} target='blank'>
                            <img className='w-full rounded-full h-full' src={wp} alt="" />



                        </a>

                    </div> : ""}


                {facebookUrl ? <div className="face  w-8 h-8 flex justify-center items-center bg-green-50 rounded-full">
                    <img className='rounded-full' src={fb} alt="" />

                </div> : ""
                }

                {instagramUrl ? <div className="insta  w-8 h-8 flex justify-center items-center bg-green-50 rounded-full">
                    <a href={instagramUrl} target='blank'>

                        <img className='rounded-full' src={instagram} alt="" />


                    </a>

                </div>
                    : ""

                }



                {locationUrl ?

                    <div className="location  w-8 h-8 flex justify-center items-center bg-green-50 rounded-full">
                        <a href={locationUrl} target='blank'>
                            <img className='rounded-full' src={location} alt="" />


                        </a>

                    </div>
                    : ""
                }

            </div>


            <div className="w-full position-relative">
                <div className="flex justify-center border-b border-gray-200 pt-2  ">
                    <div
                        className={sectionTab("menu")}
                        onClick={() => setActiveSection("menu")}
                    >
                        المنيو
                    </div>


                    <div
                        className={sectionTab("pay")}
                        onClick={() => setActiveSection("pay")}
                    >
                        العروض
                    </div>
                </div>

                <div className="  mt-4  md:pb-28 pb-20 relative  rounded-md">
                    {activeSection === "menu" && (
                        <div className="menu">
                            <div className="search-categories flex items-center mt-1 h-11">
                                {/* Search Icon */}
                                <div
                                    className="search-icon flex justify-center items-center bg-slate-50 rounded-s-full border-e-2 w-11 h-11 cursor-pointer"
                                    onClick={toggleSearch}
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </div>

                                {/* Search Input */}
                                <div
                                    className={`search-input ${isSearchVisible ? 'w-full' : 'w-0'} h-full transition-all duration-300 overflow-hidden`}
                                >
                                    <input
                                        className="w-full h-full px-1 border-none outline-none bg-slate-50"
                                        type="search"
                                        placeholder="Search here .."
                                    />
                                </div>

                                {/* Categories Section with Horizontal Scroll */}
                                <div
                                    className={`categories  h-full flex gap-2 items-center px-1 bg-slate-50 overflow-x-auto whitespace-nowrap transition-all duration-300 ${isSearchVisible ? 'hidden' : 'flex w-full'
                                        }`}
                                    ref={scrollRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseUp}
                                    onMouseUp={handleMouseUp}
                                    style={{
                                        cursor: isDragging ? 'grabbing' : 'grab',
                                        scrollbarWidth: 'none', // for Firefox
                                        msOverflowStyle: 'none' // for IE and Edge
                                    }}

                                >

                                    {sections.map((section) => (
                                        <div key={section.id} className="category-section border border-red-500 bg-white px-4 py-1 rounded-2xl">
                                            <p>{section.name}</p>
                                        </div>


                                    ))}


                                    {/* Add more items as needed */}
                                </div>

                            </div>

                            <div className="menu-categories-items p-4 ">

                                {/* Item Size Form */}
                                {isFormVisible && selectedItem && (
                                    <div className="item-size-form z-10 flex justify-center bg-black/25 items-center fixed inset-0">
                                        <div dir='rtl' className="size-form w-full pb-4 rounded-md p-2 mx-4 bg-white">
                                            <div className="close-form float-end text-2xl px-3 cursor-pointer" onClick={closeForm}>
                                                X
                                            </div>
                                            <p className='text-lg p-3 mt-5 mb-0 font-medium kufi text-gray-500'>اسم الصنف</p>
                                            <p className='item-name text-lg kufi mt-0 mb-3 font-semibold px-2'>{selectedItem.name}</p>
                                            <hr />
                                            <p className='text-lg p-3 mb-0 font-medium kufi text-gray-500'>الخيارات</p>

                                            {/* Sizes */}
                                            <div className="sizes items-buttons-container pb-2 px-3">
                                                {selectedItem.sizes.map((size, index) => (
                                                    <div className="Size items-button w-full" key={index}>
                                                        <input name="items-group" id={`size${index}`} className="items-button__input" type="radio" />
                                                        <label htmlFor={`size${index}`} className="items-button__label w-full">
                                                            <span className="items-button__custom"></span>
                                                            <div className="item-option w-full justify-between flex">
                                                                <p className='font-medium'>{size.name}</p>
                                                                <p className='font-medium'>{size.price}</p>
                                                            </div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <hr />

                                            {/* Extras */}
                                            <p className='text-lg p-3 mb-0 font-medium kufi text-gray-500'>الأضافات</p>
                                            <div className="extras items-buttons-container px-3">
                                                {selectedItem.extras.map((extra, index) => (
                                                    <div className="extra items-button w-full" key={index}>
                                                        <input name="extras-group" id={`extra${index}`} className="items-button__input" type="radio" />
                                                        <label htmlFor={`extra${index}`} className="items-button__label w-full">
                                                            <span className="items-button__custom"></span>
                                                            <div className="item-option w-full justify-between flex">
                                                                <p className='font-medium'>{extra.name}</p>
                                                                <p className='font-medium'>{extra.price}</p>
                                                            </div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="add-to-cart flex justify-center mt-4">
                                                <button className={`button ${loading ? 'loading' : ''}`} onClick={handleClick}>
                                                    <span onClick={addToCart}>Add to cart</span>
                                                    <div className="cart">
                                                        <svg viewBox="0 0 36 26">
                                                            <polyline points="1 2.5 6 2.5 10 18.5 25.5 18.5 28.5 7.5 7.5 7.5"></polyline>
                                                            <polyline points="15 13.5 17 15.5 22 10.5"></polyline>
                                                        </svg>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Categories and Items */}
                                {sections.map((section) => (
                                    <div key={section.id} className="category-and-items mt-5 rounded-md">
                                        <div className="category bg-white rounded-md shadow-lg pb-3">
                                            <img className='w-full object-cover h-28 rounded-md' src={section.cover_image_url ? section.cover_image_url : def} alt={section.name} />
                                            <div className="category-name text-center mt-2">
                                                <p className='cairo font-semibold'>{section.name}</p>
                                            </div>
                                        </div>

                                        {section.items.map((item) => (
                                            <div key={item.id} onClick={() => handleItemDetailsClick(item)} className="items hover:transition-transform hover:translate-y-1 h-28 bg-white rounded-md shadow-md flex justify-between mt-4 p-2 cursor-pointer">
                                                <div className="left-side w-3/4 h-full p-1">
                                                    <div className="item-name">
                                                        <p className='font-medium text-sm kufi'>{item.name}</p>
                                                    </div>
                                                    <div className="item-price-and-add w-full h-full flex justify-between">
                                                        <p className='kufi text-[#20617c] text-lg font-medium mt-2'>{getPriceRange(item)}</p>
                                                    </div>
                                                </div>
                                                <div className="right-side relative h-full">
                                                    <img className='h-full w-24 object-cover rounded-md' src={item.image ? item.image : def} alt={item.name} />
                                                    <div className="add-item flex justify-center bg-white rounded-full w-fit h-fit bottom-0 -left-5 absolute">
                                                        <button onClick={(e) => handleItemClick(e, item)} title="Add New" className="group cursor-pointer outline-none hover:rotate-90 duration-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="35px" height="35px" viewBox="0 0 24 24" className="stroke-green-400 fill-none group-hover:fill-green-800 group-active:stroke-green-200 group-active:fill-green-600 group-active:duration-0 duration-300">
                                                                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" strokeWidth="1.5"></path>
                                                                <path d="M8 12H16" strokeWidth="1.5"></path>
                                                                <path d="M12 16V8" strokeWidth="1.5"></path>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}




                            </div>




                        </div>

                    )}
                    {activeSection === "contact" && (

                        <div className="contact mt-3 flex flex-col items-center  rounded-md ">
                            <div className="contact-tools  w-full p-4 flex justify-center gap-3">
                                <div className="facebook w-32 h-32  flex justify-center items-center bg-blue-50 rounded-md">
                                    <img src={fb} alt="" />
                                    {/* <i className="fa-brands text-3xl  fa-facebook-f"></i> */}
                                </div>
                                <div className="call w-32 h-32 flex justify-center items-center bg-green-50 rounded-md">

                                    {/* <i className="fa-solid  text-3xl fa-phone"></i>              */}
                                    <img className='w-full h-full' src={call} alt="" />

                                </div>


                            </div>

                        </div>

                    )}

                    {activeSection === "pay" && (
                        <div className="pay flex justify-center">
                            <div className="call shadow-lg border rounded-lg w-32 h-32 flex bg-slate-300 justify-center items-center ">

                                <img className='w-full h-full rounded-lg' src={instapay} alt="" />

                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={`cart fixed w-full ${cartCount == 0 ? "hidden" : "flex"} flex flex-col items-center  z-10  bottom-0  `}>


                <div dir='rtl' className="cart-icon w-1/3 flex items-center justify-between px-3 bg-sky-400 border-t border-blue-600 shadow-2xl h-12 mx-4 rounded-t-3xl ">
                    <div className="cart-and-count text-white flex items-center justify-center">
                        <i className="fa-solid fa-cart-shopping text-red-600 text-2xl pe-5"></i>
                        <p className='cart-count text-2xl '>{cartCount}</p>
                    </div>
                    <Link to={"/cart"}>
                        <i className="fa-solid fa-arrow-left text-white text-xl"></i>
                    </Link>
                </div>
                {/* <div dir='rtl' className="cart-page p-3 pb-14  w-full h-full bg-white">
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
                                        </div>
                                        <hr />
                                        <div className="total-price p-3 flex justify-between">
                                            <p className='cairo font-bold'>السعر الكلي </p> <p className=' font-bold'>350 EGP</p>


                                        </div>
                                        <hr />
                                        <div className="order-way p-3">
                                            <input name="order-group" id={`table`} className="items-button__input" type="radio" />
                                            <label htmlFor={`table`} className="items-button__label w-full">
                                                <span className="items-button__custom"></span>
                                                <p className='font-medium cairo'>داخل المطعم</p>
                                            </label>
                                            <input name="order-group" id={`pickup`} className="items-button__input" type="radio" />
                                            <label htmlFor={`pickup`} className="items-button__label w-full">
                                                <span className="items-button__custom"></span>
                                                <p className='font-medium cairo'>Pickup</p>
                                            </label>
                                            <input name="order-group" id={`takeaway`} className="items-button__input" type="radio" />
                                            <label htmlFor={`takeaway`} className="items-button__label w-full">
                                                <span className="items-button__custom"></span>
                                                <p className='font-medium cairo'>تيك اواي</p>
                                            </label>
                                            <input name="order-group" id={`delivery`} className="items-button__input" type="radio" />
                                            <label htmlFor={`delivery`} className="items-button__label w-full">
                                                <span className="items-button__custom"></span>
                                                <p className='font-medium cairo'>دليفري</p>
                                            </label>
                                        </div>
                                        <hr />

                                        <div className="proceed flex justify-center mb-7 items-center p-3">

                                            <button className='py-2 px-4 bg-green-500 rounded-md cairo font-semibold text-white'>تنفيذ الطلب</button>

                                        </div>

                                    </div>



                                </div> */}

            </div>
            <div className="powred-by">

                <p className='kufi text-center text-gray-700 '>Powered by <span>Takka</span> </p>

            </div>
        </div>




    </>
}
