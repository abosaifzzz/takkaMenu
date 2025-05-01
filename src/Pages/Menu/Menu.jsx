import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import def from '../../assets/download.png'
import eats from '../../assets/eats-logo.png'
import eats2 from '../../assets/eats2.png'



import cover from "../../assets/cover.jpeg"
import cover3 from "../../assets/cover3.jpg"

import reslogo from "../../assets/res-logo.jpg"
import kofta from "../../assets/kofta.jpg"
import reslogo2 from "../../assets/relogo2.png"

import fb from "../../assets/fb.png"
import wp from "../../assets/wp.png"
import call from "../../assets/call.png"
import rev from "../../assets/rev.png"
import add from "../../assets/add.png"
import closed from "../../assets/closed.png"



import massenger from "../../assets/massenger.png"

import instapay from "../../assets/instapay.png"
import instagram from "../../assets/instagram.png"
import locationImg from "../../assets/location.png"

import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaStar, FaTimes, FaPaperclip } from 'react-icons/fa';



export default function Menu() {
    const location = useLocation();
    const pathName = location.pathname
    const id_hash = pathName.split("/")[2];
    localStorage.setItem("menu_id", id_hash)

    const [displayEndTime, setDisplayEndTime] = useState(null);



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
    const [showContacts, setShowContacts] = useState(false);
    const [menuData, setMenuData] = useState("");
    const [menuLive, setMenuLive] = useState(true); // Stored Location URL

    const [toggleReview, setToggleReview] = useState(false); // Stored Location URL
    const [imageLoaded, setImageLoaded] = useState(true);

    const [locationUrl, setLocationUrl] = useState(""); // Stored Location URL
    const [instagramUrl, setInstagramUrl] = useState(""); // Stored Instagram URL
    const [whatsAppUrl, setWhatsAppUrl] = useState("");
    const [facebookUrl, setFacebookUrl] = useState(""); // Stored Facebook URL

    const [socialLinks, setSocialLinks] = useState({
        whatsapp: "",
        facebook: "",
        instagram: "",
        location: "",
    });
    const [isClosed, setIsClosed] = useState(false);
    const [endTime, setEndTime] = useState('');


    const [error, setError] = useState(null);
    const [phones, setPhones] = useState([]); // Initialize as empty array


    const [review, setReview] = useState({
        rate: 0,
        comment: '',
        client_name: '',
        client_phone: '',
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [offerItems, setOfferItems] = useState([]);
    const [offerSectionId, setOfferSectionId] = useState(null);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const sectionRefs = useRef({});

    // Function to handle section click
    const handleSectionClick = (sectionId) => {
        setSelectedSectionId(sectionId);
        const sectionElement = sectionRefs.current[sectionId];
        if (sectionElement) {
            sectionElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Intersection Observer for auto-highlighting while scrolling
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setSelectedSectionId(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 } // Adjust as needed
        );

        Object.values(sectionRefs.current).forEach(el => {
            if (el) observer.observe(el);
        });

        return () => {
            Object.values(sectionRefs.current).forEach(el => {
                if (el) observer.unobserve(el);
            });
        };
    }, [sections]);


    const fetchMenuData = async () => {
        try {
            const response = await axios.get(`http://localhost:234/api/menu/${id_hash}`);
            console.log(id_hash);

            console.log("API response menu data:", response.data);
            let menu_id = response.data.id

            localStorage.setItem("m_id", menu_id)
            console.log(menu_id);


            // Update all state at once
            setMenuData(response.data);

            // Extract other values you need
            const { is_closed, end_time } = response.data;
            setMenuLive(!is_closed);
            if (end_time) {
                // Store original 24-hour format for calculations
                setEndTime(end_time);

                // Convert to 12-hour format for display
                const [hours, minutes] = end_time.split(':').map(Number);
                const period = hours >= 12 ? 'PM' : 'AM';
                const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
                const displayTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                setDisplayEndTime(displayTime); // You'll need to add this state

                // Time check logic (using original 24-hour format)
                const now = new Date();
                const endTimeToday = new Date();
                endTimeToday.setHours(hours, minutes, 0, 0);
                setIsClosed(now >= endTimeToday);
            } else {
                setDisplayEndTime(null);
            }


        } catch (error) {
            toast.error("Error loading menu");
            console.error("Fetch error:", error);
            setError("Failed to load menu data");
        } finally {
            setLoading(false);
        }
    };

    let menu_id = localStorage.getItem("m_id")

    // const coverImageUrl = menuData.cover_image
    //     ? `http://localhost:234/api/file/${menuData.cover_image}`
    //     : '';


    const profileImageUrl = menuData.profile_image
        ? `http://localhost:234/api/file/${menuData.profile_image}`
        : '';



    useEffect(() => {
        setTimeout(() => {
            setImageLoaded(false)
        }, 300);
        fetchSocialLinks(id_hash);
        fetchMenuData()
        fetchPhones(id_hash);
        getSections(id_hash)
        fetchOfferItems(id_hash); // Call the function directly



    }, [id_hash]);




    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReview(prev => ({ ...prev, attachment: file }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);




        let reviewObj = {
            menu_id,

            rate: review.rate,
            comment: review.comment,
            client_name: review.client_name,
            client_phone: review.client_phone
        }
        console.log(reviewObj);




        try {
            await axios.post('http://localhost:234/api/menu/reviews', reviewObj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('تم ارسال التقييم بنجاح');
            setReview({
                rate: 0,
                comment: '',
                client_name: '',
                client_phone: '',

            })
            setToggleReview(false)
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };



    // const menu_id = localStorage.getItem("m_id"); // Get menu_id dynamically from the URL


    const fetchOfferItems = async () => {

        const { sectionId, items } = await getOfferSectionWithItems(id_hash);
        if (sectionId, items) {
            setOfferItems(items);
            // await console.log(offerItems);

            setOfferSectionId(sectionId);

        } else {
            console.log("no section id or items");


        }
    };


    async function getOfferSectionWithItems(id_hash) {
        try {
            const response = await axios.get(`http://localhost:234/api/menu-offers-client/${id_hash}`);

            if (!response.data || response.data.message === "Sections not found") {
                console.log("No sections found for this menu");
                return { sectionId: null, items: [] };
            }

            // Find the offer section (is_offer = true)
            const offerSection = response.data[0]

            if (!offerSection) {
                console.log("No offer section found");
                return { sectionId: null, items: [] };
            }

            // Save the section ID globally
            // offerSectionId = offerSection.id;

            // Process items with their images
            const itemsWithImages = await Promise.all(
                offerSection.items.map(async (item) => {
                    let itemImageUrl = null;
                    if (item.image) {
                        try {
                            const itemImageResponse = await axios.get(
                                `http://localhost:234/api/file/${item.image}`,
                                { responseType: "blob" }
                            );
                            itemImageUrl = URL.createObjectURL(itemImageResponse.data);
                        } catch (itemImageError) {
                            console.error("Error fetching item image:", itemImageError);
                        }
                    }
                    return { ...item, image_url: itemImageUrl };
                })
            );

            // Log the items before returning

            return {
                sectionId: offerSection.id,
                items: itemsWithImages,
                sectionData: {
                    name: offerSection.name,
                    description: offerSection.description
                }
            };

        } catch (error) {
            if (error.response.data && error.response.data.message === "Sections not found for the given MenuId") {
                return console.log("Specific error: Sections not found");
                // Handle this specific case
            }

            console.error("Error fetching offer section:", error);
            toast.error("حدث خطأ أثناء جلب قسم العروض");
            return { sectionId: null, items: [] };
        }
    }







    const fetchPhones = async () => {

        try {

            const response = await axios.get(`http://localhost:234/api/contacts-client/${id_hash}`);

            if (response.data.contacts.length > 0) {

                setPhones(response.data.contacts.map(contact => contact.phone)); // Assuming API returns an array of objects with a `phone` field


            } else {
                setPhones([""]); // Default input field if no numbers exist
            }
        } catch (error) {
            console.error("Error fetching phone numbers:", error);
        }
    };

    async function getSections(id_hash) {
        try {
            // Fetch sections using menu_id
            const response = await axios.get(`http://localhost:234/api/menusection-client/${id_hash}`);

            if (response.data) {
                const sectionsWithImages = await Promise.all(
                    response.data.map(async (section) => {
                        let coverImageUrl = null;

                        // Fetch section cover image if available
                        if (section.cover_image) {
                            try {
                                const imageResponse = await axios.get(
                                    `http://localhost:234/api/file/${section.cover_image}`,
                                    { responseType: "blob" } // Fetch image as blob
                                );
                                coverImageUrl = URL.createObjectURL(imageResponse.data);
                            } catch (imageError) {
                                console.error(`Error fetching cover image for ${section.cover_image}`, imageError);
                            }
                        }

                        // Fetch images for section items
                        const itemsWithImages = await Promise.all(
                            section.items.map(async (item) => {
                                let itemImageUrl = null;

                                if (item.image) {
                                    try {
                                        const itemImageResponse = await axios.get(
                                            `http://localhost:234/api/file/${item.image}`,
                                            { responseType: "blob" }
                                        );
                                        itemImageUrl = URL.createObjectURL(itemImageResponse.data);
                                    } catch (itemImageError) {
                                        console.error(`Error fetching item image for ${item.image}`, itemImageError);
                                    }
                                }

                                return { ...item, image_url: itemImageUrl };
                            })
                        );

                        return {
                            ...section,
                            cover_image_url: coverImageUrl,
                            items: itemsWithImages, // Include updated items with images
                        };
                    })
                );

                setSections(sectionsWithImages); // Update state with sections and images
            }
        } catch (error) {
            if (error.response.data && error.response.data.message === "Sections not found for the given MenuId") {
                return console.log("Specific error: Sections not found");
                // Handle this specific case
            }


            console.error("Error fetching sections:", error);
            toast.error("حدث خطأ أثناء جلب الأقسام");

            // Fallback dummy data


        }
    }
    const fetchSocialLinks = async () => {
        try {

            const response = await axios.get(`http://localhost:234/api/menusocial-client/${id_hash}`);
            const updatedLinks = {
                whatsapp: "",
                facebook: "",
                instagram: "",
                location: "",
            };


            // ✅ Loop through the response and set each platform dynamically
            response.data.forEach((item) => {
                if (updatedLinks.hasOwnProperty(item.platform)) {
                    updatedLinks[item.platform] = item.url; // Set the URL
                }
            });

            setSocialLinks(updatedLinks); // ✅ Update state


        } catch (error) {
            console.error("Error fetching social links:", error);
            setError("Failed to load social links.");
        } finally {
            setLoading(false);
        }
    };

    // const fetchMenuData = async () => {
    //     try {
    //         // Fetch menu settings
    //         const response = await axios.get(`http://localhost:234/api/menu/${id_hash}`);
    //         console.log("menu-data", response.data);
    //         setMenuData(response.data);

    //         const { is_closed } = response.data
    //         if (is_closed) {
    //             setMenuLive(false)

    //         }
    //         const { end_time } = response.data;
    //         setEndTime(end_time);
    //         const { name } = response.data
    //         console.log(name);


    //         // Check if current time >= end_time (one-time check)
    //         const now = new Date();
    //         const [endHour, endMinute] = end_time.split(':').map(Number);
    //         const endTimeToday = new Date();
    //         endTimeToday.setHours(endHour, endMinute, 0, 0);

    //         setIsClosed(now >= endTimeToday);


    //         // Set menu settings
    //         await console.log("men naaaame:", menuData.name);

    //         toast.success("menu")

    //         // Fetch profile image if it exists
    //         // if (response.data.menuSettings.profile_image) {
    //         //     const profileImageUrl = `http://localhost:234/api/file/${response.data.menuSettings.profile_image}`;
    //         //     const profileImageResponse = await axios.get(profileImageUrl, { responseType: 'blob' });
    //         //     const profileImageObjectURL = URL.createObjectURL(profileImageResponse.data);
    //         //     setMenuSettings((prevSettings) => ({
    //         //         ...prevSettings,
    //         //         profileImageUrl: profileImageObjectURL, // Add profile image URL to the menu settings
    //         //     }));
    //         // }

    //         // // Fetch cover image if it exists
    //         // if (response.data.menuSettings.cover_image) {
    //         //     const coverImageUrl = `http://localhost:234/api/file/${response.data.menuSettings.cover_image}`;
    //         //     const coverImageResponse = await axios.get(coverImageUrl, { responseType: 'blob' });
    //         //     const coverImageObjectURL = URL.createObjectURL(coverImageResponse.data);
    //         //     setMenuSettings((prevSettings) => ({
    //         //         ...prevSettings,
    //         //         coverImageUrl: coverImageObjectURL, // Add cover image URL to the menu settings
    //         //     }));
    //         // }
    //     } catch (error) {
    //         toast.error("er")
    //         console.error("Error fetching menu settings or images:", error);
    //         setError("Failed to load menu settings or images.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };




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

    // const getPriceRange = (item) => {
    //     console.log(item);

    //     if (item.item_prices && item.item_prices.length > 1) {
    //         const prices = item.item_prices.map(itemPrice => parseFloat(itemPrice.price.replace('EGP ', '')));
    //         const minPrice = Math.min(...prices);
    //         const maxPrice = Math.max(...prices);
    //         return `EGP ${minPrice} - EGP ${maxPrice}`;
    //     }
    //     return item.price; // Return the base price if no multiple sizes
    // };

    const getPriceRange = (item) => {
        // If no price information exists at all
        if ((!item.item_prices || item.item_prices.length === 0) && !item.price) {
            return null; // or return '' if you prefer an empty string
        }

        // Case 1: Multiple prices in item_prices array
        if (item.item_prices && item.item_prices.length > 1) {
            const prices = item.item_prices.map(itemPrice => {
                const priceStr = itemPrice.price || itemPrice;
                return parseFloat(priceStr.toString().replace('EGP ', ''));
            });
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            return `EGP ${minPrice} - EGP ${maxPrice}`;
        }

        // Case 2: Single price in item_prices array
        if (item.item_prices && item.item_prices.length === 1) {
            const price = item.item_prices[0].price || item.item_prices[0];
            return price.toString().includes('EGP') ? price : `EGP ${price}`;
        }

        // Case 3: Direct price property
        if (item.price) {
            return item.price.toString().includes('EGP') ? item.price : `EGP ${item.price}`;
        }

        // If we get here, return null (no price available)
        return null;
    };

    return <>
        <Toaster></Toaster>
        <div dir='ltr' className="menu bg-white">


            {toggleReview && (
                <div className="review-form-page fixed flex justify-center items-center z-50 w-full  h-full">



                    <div dir='rtl' className="rev-form w-4/5 h-fit rounded-lg shadow-lg z-50 bg-white p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold cairo">اترك تقييم</h2>
                            <button

                                onClick={() => setToggleReview(false)}

                                className="text-gray-500 hover:text-gray-700">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Rating */}
                            <div>
                                <label className="block mb-2 cairo">تقييمك</label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setReview({ ...review, rate: star })}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="text-2xl focus:outline-none"
                                        >
                                            <FaStar
                                                className={
                                                    (hoverRating || review.rate) >= star
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label htmlFor="comment" className="block cairo mb-2">
                                    رسالتك
                                </label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    rows="3"
                                    value={review.comment}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="شاركنا رأيك..."
                                ></textarea>
                            </div>

                            {/* Name */}
                            <div>
                                <label htmlFor="client_name" className="block cairo mb-2">
                                    اسمك
                                </label>
                                <input
                                    type="text"
                                    id="client_name"
                                    name="client_name"
                                    value={review.client_name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="محمد"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="client_phone" className="block cairo mb-2">
                                    الموبايل
                                </label>
                                <input
                                    type="tel"
                                    id="client_phone"
                                    name="client_phone"
                                    value={review.client_phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="01018665XXXX"
                                />
                            </div>

                            {/* Attachment */}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || review.rate === 0}
                                className={`w-full cairo py-2 px-4 rounded text-white ${isSubmitting || review.rate === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600'
                                    }`}
                            >
                                {isSubmitting ? 'ارسال...' : 'ارسال التقييم'}
                            </button>
                        </form>
                    </div>

                </div>

            )
            }




            <div className="contact-us-button fixed z-40 bottom-4 right-4 cursor-pointer"
                onClick={() => setShowContacts(!showContacts)}
            >
                <img src={call} className={`w-11 h-11 border-2 rounded-full ${showContacts ? 'border-sky-300' : 'border-white'}`} alt="Call" />
            </div>
            <div onClick={() => setToggleReview(true)} className="review-us-button fixed z-40 bottom-20 right-4 cursor-pointer"
            >
                <img src={rev} className={`w-11 h-11 bg-white  p-1 rounded-full `} alt="Call" />

                <div className="add-rev-btn absolute w-4 h-4 flex text-sm justify-center items-center rounded-full -left-2 bottom-0 text-white ">
                    <img src={add} className='border-2 border-white rounded-full' alt="" />
                </div>
            </div>

            {/* Contact Numbers with CSS Transition */}
            <div className={`contact-numbers fixed bottom-16 z-50 rounded-md flex flex-col right-4 bg-white shadow-lg transition-all duration-300 ease-in-out ${showContacts
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-5 scale-95 pointer-events-none'
                }`}
            >
                <i className="fa-solid absolute -bottom-3 right-3 text-2xl text-white fa-sort-down"></i>

                {phones.map((phone, index) => (
                    <div key={index} className="number flex gap-2 p-3 hover:bg-slate-100 items-center">
                        <i className="fa-solid text-xl text-green-700 fa-phone"></i>
                        <p className='cairo text-lg'>{phone}</p>
                    </div>
                ))}
            </div>
            <div className="menu-cover-pic relative h-44 shadow-xl shadow-slate-200 rounded-b-3xl flex justify-center items-center">
                {isClosed && (
                    <div className="close-label bg-red-500 flex justify-center items-center absolute top-0 left-0 right-0 h-8">
                        <p className='cairo text-white'>
                            <i className="fa-solid fa-circle-exclamation text-gray-400 mr-2"></i>
                            Closed at {displayEndTime}
                        </p>
                    </div>
                )}
                <img className='w-full h-full rounded-b-3xl object-cover' src={cover3}
                    alt="Restaurant cover"

                />
                <div className="profile-pic absolute -bottom-1/3 border-4 border-white shadow-lg md:w-44 md:h-44 w-36 h-36 rounded-full overflow-hidden">
                    {/* Show spinner only while loading */}
                    {imageLoaded && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
                        </div>
                    )}

                    {/* Show profile image if available and loaded */}
                    {!imageLoaded && profileImageUrl ? (
                        <img
                            src={profileImageUrl}
                            alt="Profile"
                            className="w-full bg-white h-full object-cover"
                        // onLoad={() => setImageLoaded(true)}
                        // onError={() => setImageLoaded(false)}
                        />
                    ) : (
                        /* Default image if no profile image or error */
                        <img src={reslogo2} alt="Default Profile" className="w-full bg-white h-full object-cover" />
                    )}
                </div>
            </div>
            <div className="name-bio  flex flex-col items-center mt-20">

                <p className='cairo name text-center text-xl font-medium' dir="rtl">
                    {menuData.name}
                </p>

                <p dir='rtl' className='bio cairo px-3 text-center md:text-base text-sm text-gray-600'> {menuData.bio} </p>

            </div>
            <div className="contact-icons w-72 mx-auto mt-3 gap-2 flex justify-center">


                {socialLinks.whatsapp && (
                    <div className="whatsapp w-8 h-8 flex justify-center items-center bg-sky-700 rounded-full">
                        <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                            {/* <img className="w-full h-full rounded-full" src={wp} alt="WhatsApp" /> */}
                            <i className="fa-brands text-white fa-whatsapp"></i>
                        </a>
                    </div>
                )}

                {socialLinks.facebook && (
                    <div className="face w-8 h-8 flex justify-center items-center bg-sky-700 rounded-full">
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                            {/* <img className="w-full h-full rounded-full" src={fb} alt="Facebook" /> */}
                            <i className="fa-brands text-white fa-facebook-f"></i>
                        </a>
                    </div>
                )}

                {socialLinks.instagram && (
                    <div className="insta w-8 h-8 flex justify-center items-center bg-sky-700 rounded-full">
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands text-white fa-instagram"></i>
                            {/* <img className="w-full h-full rounded-full" src={instagram} alt="Instagram" /> */}
                        </a>
                    </div>
                )}

                {socialLinks.location && (
                    <div className="location w-8 h-8 flex justify-center items-center bg-sky-700 rounded-full">
                        <a href={socialLinks.location} target="_blank" rel="noopener noreferrer">
                            {/* <img className="w-full h-full rounded-full" src={locationImg} alt="Location" /> */}
                            <i className="fa-solid text-white fa-location-dot"></i>
                        </a>
                    </div>
                )}

            </div>

            {menuLive ? (
                <>
                    <div className="menu-not-live flex flex-col items-center gap-2 border-t-2 mt-5 pt-12 min-h-screen">
                        <img src={closed} alt="" />
                        <p className='cairo'>المنيو مغلق الأن</p>


                    </div>



                </>


            ) : (<>

                <div className="w-full position-relative">
                    <div className="flex justify-center border-b border-gray-200 pt-2  ">


                        <div
                            className={sectionTab("pay")}
                            onClick={() => setActiveSection("pay")}
                        >
                            العروض
                        </div>
                        <div
                            className={sectionTab("menu")}
                            onClick={() => setActiveSection("menu")}
                        >
                            المنيو
                        </div>

                    </div>

                    <div className="  mt-4  md:pb-28 pb-20 relative  rounded-md">
                        {activeSection === "menu" && (
                            <div className="menu">
                                <div className="search-categories flex items-center mx-2 border-2 rounded-s-full mt-1 h-11">
                                    {/* Search Icon */}
                                    <div
                                        className="search-icon flex justify-center items-center bg-slate-50   rounded-s-full  border-e-2 w-11 h-11 cursor-pointer"
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

                                    <div
                                        className={`categories h-full flex gap-2 items-center px-1 bg-slate-50 overflow-x-auto whitespace-nowrap transition-all duration-300 ${isSearchVisible ? 'hidden' : 'flex w-full'}`}
                                        ref={scrollRef}
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseUp}
                                        onMouseUp={handleMouseUp}
                                        style={{
                                            cursor: isDragging ? 'grabbing' : 'grab',
                                            scrollbarWidth: 'none',
                                            msOverflowStyle: 'none'
                                        }}
                                    >
                                        {sections.map((section) => (
                                            <div
                                                key={section.id}
                                                onClick={() => handleSectionClick(section.id)}
                                                className={`category-section border px-4 py-1 rounded-2xl ${selectedSectionId === section.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-slate-200 hover:bg-slate-300'
                                                    } transition-colors duration-200 cursor-pointer`}
                                            >
                                                <p className='cairo md:text-base text-sm'>{section.name}</p>
                                            </div>
                                        ))}
                                    </div>


                                </div>

                                <div className="menu-categories-items p-4">
                                    {sections.length > 0 ? (
                                        sections.map((section) => (
                                            <div
                                                key={section.id}
                                                id={section.id}
                                                ref={(el) => (sectionRefs.current[section.id] = el)}
                                                className="category-and-items border shadow-lg shadow-sky-50 rounded-t-3xl mt-5 rounded-md"
                                            >
                                                <div className="category bg-slate-100 rounded-md rounded-t-3xl shadow-md border-2 pb-3">
                                                    <img
                                                        className='w-full object-cover bg-white h-28 rounded-md rounded-t-3xl'
                                                        src={section.cover_image_url ? section.cover_image_url : def}
                                                        alt={section.name}
                                                    />
                                                    <div className="category-name text-center mt-2">
                                                        <p className='cairo font-semibold'>{section.name}</p>
                                                        <p className='cairo text-sm pt-5 text-sky-800'>{section.note}</p>
                                                    </div>
                                                </div>

                                                {section.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => handleItemDetailsClick(item)}
                                                        className="items hover:transition-transform hover:translate-y-1 h-28 bg-white rounded-md shadow-md flex justify-between mt-4 p-2 cursor-pointer"
                                                    >
                                                        <div className="left-side w-3/4 h-full p-1">
                                                            <div className="item-name">
                                                                <p className='cairo font-medium text-sm kufi'>{item.name}</p>
                                                            </div>
                                                            <div className="item-price-and-add w-full h-full flex justify-between">
                                                                <p className='cairo kufi text-[#20617c] text-lg font-medium mt-2'>
                                                                    {getPriceRange(item)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="right-side relative h-full">
                                                            <img
                                                                className='h-full w-24 object-cover rounded-md'
                                                                src={item.image_url ? item.image_url : def}
                                                                alt={item.name}
                                                            />
                                                            <div className="add-item flex justify-center bg-white rounded-full w-fit h-fit bottom-0 -left-5 absolute">
                                                                <button
                                                                    onClick={(e) => handleItemClick(e, item)}
                                                                    title="Add New"
                                                                    className="group cursor-pointer outline-none hover:rotate-90 duration-300"
                                                                >
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
                                        ))


                                    ) : (

                                        <>
                                            <div className="no-sections w-full h-16 flex   justify-center items-center">
                                                <p className=' cairo p-12'>لا يوجد اقسام</p>


                                            </div>

                                        </>
                                    )}






                                </div>




                            </div>

                        )}
                        {activeSection === "contact" && (

                            <div className="contact mt-3 flex flex-col items-center  rounded-md ">
                                <div className="contact-tools  w-full p-4 flex justify-center gap-3">
                                    <div className="facebook w-32 h-32  flex justify-center items-center bg-blue-50 rounded-md">
                                        {/* <img src={fb} alt="" /> */}
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

                                <div className="menu-categories-items min-h-screen w-full p-4 ">

                                    {/* Item Size Form */}
                                    {isFormVisible && selectedItem && (
                                        <div className="item-size-form z-10 flex justify-center bg-black/25 items-center fixed inset-0">
                                            <div dir='rtl' className="size-form w-full pb-4 rounded-md p-2 mx-4 bg-white">
                                                <div className="close-form float-end text-2xl px-3 cursor-pointer" onClick={closeForm}>
                                                    X
                                                </div>
                                                <p className='cairo text-lg p-3 mt-5 mb-0 font-medium kufi text-gray-500'>اسم الصنف</p>
                                                <p className='cairo item-name text-lg kufi mt-0 mb-3 font-semibold px-2'>{selectedItem.name}</p>
                                                <hr />
                                                <p className='cairo text-lg p-3 mb-0 font-medium kufi text-gray-500'>الخيارات</p>

                                                {/* Sizes */}
                                                <div className="sizes items-buttons-container pb-2 px-3">
                                                    {selectedItem.sizes.map((size, index) => (
                                                        <div className="Size items-button w-full" key={index}>
                                                            <input name="items-group" id={`size${index}`} className="items-button__input" type="radio" />
                                                            <label htmlFor={`size${index}`} className="items-button__label w-full">
                                                                <span className="items-button__custom"></span>
                                                                <div className="item-option w-full justify-between flex">
                                                                    <p className='cairo font-medium'>{size.name}</p>
                                                                    <p className='cairo font-medium'>{size.price}</p>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                                <hr />

                                                {/* Extras */}
                                                <p className='cairo text-lg p-3 mb-0 font-medium kufi text-gray-500'>الأضافات</p>
                                                <div className="extras items-buttons-container px-3">
                                                    {selectedItem.extras.map((extra, index) => (
                                                        <div className="extra items-button w-full" key={index}>
                                                            <input name="extras-group" id={`extra${index}`} className="items-button__input" type="radio" />
                                                            <label htmlFor={`extra${index}`} className="items-button__label w-full">
                                                                <span className="items-button__custom"></span>
                                                                <div className="item-option w-full justify-between flex">
                                                                    <p className='cairo font-medium'>{extra.name}</p>
                                                                    <p className='cairo font-medium'>{extra.price}</p>
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


                                    {offerItems.map((item) => (
                                        <div key={item.id} onClick={() => handleItemDetailsClick(item)} className="items hover:transition-transform hover:translate-y-1 h-28 bg-white rounded-md shadow-md flex justify-between mt-4 p-2 cursor-pointer">
                                            <div className="left-side w-3/4 h-full p-1">
                                                <div className="item-name">
                                                    <p className='cairo font-medium text-sm kufi'>{item.name}</p>
                                                </div>
                                                <div className="item-price-and-add w-full h-full flex justify-between">
                                                    <p className='cairo kufi text-[#20617c] text-lg font-medium mt-2'>{item?.item_prices[0]?.price}</p>
                                                </div>
                                            </div>
                                            <div className="right-side relative h-full">
                                                <img className='h-full w-24 object-cover rounded-md' src={item.image_url ? item.image_url : def} alt={item.name} />
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

                            </div>
                        )}
                    </div>
                </div>
                <div className={`cart fixed w-full ${cartCount == 0 ? "hidden" : "flex"} flex flex-col items-center  z-10  bottom-0  `}>


                    <div dir='rtl' className="cart-icon w-1/3 flex items-center justify-between px-3 bg-sky-400 border-t border-blue-600 shadow-2xl h-12 mx-4 rounded-t-3xl ">
                        <div className="cart-and-count text-white flex items-center justify-center">
                            <i className="fa-solid fa-cart-shopping text-red-600 text-2xl pe-5"></i>
                            <p className='cairo cart-count text-2xl '>{cartCount}</p>
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
                                <p className='cairo text-xl font-bold cairo'>تفاصيل الطلب</p>


                            </div>
                            <hr />
                            <div dir='rtl' className="items ">
                                <div className="item p-3 bg-slate-100">
                                    <div className="item-name-price flex justify-between">

                                        <p className='cairo cairo font-semibold'>فرخة مخلية مشوية - chickn grill</p> <p>250 EGP</p>

                                    </div>
                                    <div className="item-size">
                                        <p className='cairo font-medium'>حجم صغير</p>

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
                                            <p className='cairo text-xl'>2</p>
                                            <i className="fa-solid fa-minus p-1 rounded-full bg-slate-100 hover:bg-slate-200 "></i>
                                        </div>


                                    </div>
                                </div>
                                <div className="item p-3 bg-slate-100">
                                    <div className="item-name-price flex justify-between">

                                        <p className='cairo cairo font-semibold'>فرخة مخلية مشوية - chickn grill</p> <p>250 EGP</p>

                                    </div>
                                    <div className="item-size">
                                        <p className='cairo font-medium'>حجم صغير</p>

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
                                            <p className='cairo text-xl'>2</p>
                                            <i className="fa-solid fa-minus p-1 rounded-full bg-slate-100 hover:bg-slate-200 "></i>
                                        </div>


                                    </div>
                                </div>
                                <div className="item p-3 bg-slate-100">
                                    <div className="item-name-price flex justify-between">

                                        <p className='cairo cairo font-semibold'>فرخة مخلية مشوية - chickn grill</p> <p>250 EGP</p>

                                    </div>
                                    <div className="item-size">
                                        <p className='cairo font-medium'></p>

                                    </div>
                                    <div className="item-extras flex justify-between">
                                        <p></p> <p></p>
                                    </div>

                                    <div className="item-count  mt-4 flex justify-center w-full">
                                        <div className="count flex justify-evenly items-center gap-3 w-28 h-9 border bg-white rounded-lg">
                                            <i className="fa-solid p-1 rounded-full bg-slate-100 hover:bg-slate-200 fa-plus "></i>
                                            <p className='cairo text-xl'>2</p>
                                            <i className="fa-solid fa-minus p-1 rounded-full bg-slate-100 hover:bg-slate-200 "></i>
                                        </div>


                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="total-price p-3 flex justify-between">
                                <p className='cairo cairo font-bold'>السعر الكلي </p> <p className='cairo  font-bold'>350 EGP</p>


                            </div>
                            <hr />
                            <div className="order-way p-3">
                                <input name="order-group" id={`table`} className="items-button__input" type="radio" />
                                <label htmlFor={`table`} className="items-button__label w-full">
                                    <span className="items-button__custom"></span>
                                    <p className='cairo font-medium cairo'>داخل المطعم</p>
                                </label>
                                <input name="order-group" id={`pickup`} className="items-button__input" type="radio" />
                                <label htmlFor={`pickup`} className="items-button__label w-full">
                                    <span className="items-button__custom"></span>
                                    <p className='cairo font-medium cairo'>Pickup</p>
                                </label>
                                <input name="order-group" id={`takeaway`} className="items-button__input" type="radio" />
                                <label htmlFor={`takeaway`} className="items-button__label w-full">
                                    <span className="items-button__custom"></span>
                                    <p className='cairo font-medium cairo'>تيك اواي</p>
                                </label>
                                <input name="order-group" id={`delivery`} className="items-button__input" type="radio" />
                                <label htmlFor={`delivery`} className="items-button__label w-full">
                                    <span className="items-button__custom"></span>
                                    <p className='cairo font-medium cairo'>دليفري</p>
                                </label>
                            </div>
                            <hr />

                            <div className="proceed flex justify-center mb-7 items-center p-3">

                                <button className='py-2 px-4 bg-green-500 rounded-md cairo font-semibold text-white'>تنفيذ الطلب</button>

                            </div>

                        </div>



                    </div> */}

                </div>
            </>
            )


            }
            <div className="powred-by flex justify-center items-center pb-3 gap-2">

                <p className='cairo kufi text-center text-gray-700 '>Powered by Takka </p>
                <Link to={"/"}>
                    <span>
                        <img className='w-16 shadow' src={eats2} alt="" /></span>

                </Link>

            </div>
        </div >




    </>
}
