import React, { useEffect, useState } from 'react'
import cover from "../../assets/cover.jpg"
import cover2 from "../../assets/cover2.jpg"
import QRCode from 'qrcode'; // You'll need to install this package


import cover3 from "../../assets/cover3.jpg"
import reslogo from "../../assets/res-logo.jpg"
import qr from "../../assets/qr.png"
import reslogo2 from "../../assets/relogo2.png"

import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

import { Clipboard, ClipboardCheck } from "lucide-react"; // Lucide icons
import toast, { Toaster } from 'react-hot-toast'
import { compressImage, createFormData } from '../../utils/index.js'
const apiUrl = import.meta.env.VITE_API_URL;
export default function MenuSettings() {
    const m_id = localStorage.getItem("m_id")

    const menu_id = localStorage.getItem("menu")
    const menuUrl = `https://eats.takkasmart.com/menu/${menu_id}`;

    const [qrCodeUrl, setQrCodeUrl] = useState('');

    const [menuSettings, setMenuSettings] = useState({
        name: "",
        bio: "",
        start_time: "",
        end_time: "",
        profile_image: "",
        cover_image: "",
    });
    const [iframeKey, setIframeKey] = useState(Date.now()); // Key to force iframe reload
    const [isIframeLoading, setIsIframeLoading] = useState(false); // Track loading state
    const [menuFile, setMenuFile] = useState(null);
    const [isUpdatingSettings, setIsUpdatingSettings] = useState(false); // Track loading state



    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset icon after 2s
        });
    };
    let owner_id = localStorage.getItem("owner")
    function authHeader() {
        const accessToken = localStorage.getItem("token");
        //  if (user && user.accessToken) {
        if (accessToken) {
            // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
            return { "x-access-token": accessToken }; // for Node.js Express back-end
        } else {
            return {};
        }
    }
    useEffect(() => {

        if (m_id) {
            fetchMenuSettings(m_id);
        }
    }, [m_id]); // Runs when 'menu_id' changes

    console.log(owner_id);

    const fetchMenuSettings = async (m_id) => {
        console.log(m_id);

        try {
            // Fetch menu settings
            const response = await axios.get(`${apiUrl}/menu-settings/${m_id}`
            );

            console.log("menu settings", response.data.result);


            // Set menu settings
            setMenuSettings(response.data.result);


            // Fetch profile image if it exists
            if (response.data.result.profile_image) {
                const profileImageUrl = `${apiUrl}/api/file/${response.data.result.profile_image} `
                const profileImageResponse = await axios.get(profileImageUrl, { responseType: 'blob' },
                    {
                        headers: authHeader(),
                    }
                );
                const profileImageObjectURL = URL.createObjectURL(profileImageResponse.data);
                setMenuSettings((prevSettings) => ({
                    ...prevSettings,
                    profileImageUrl: profileImageObjectURL, // Add profile image URL to the menu settings
                }));
            }

            // Fetch cover image if it exists
            if (response.data.result.cover_image) {
                const coverImageUrl = `${apiUrl}/api/file/${response.data.result.cover_image}`

                const coverImageResponse = await axios.get(coverImageUrl, { responseType: 'blob' }, {
                    headers: authHeader(),
                });
                const coverImageObjectURL = URL.createObjectURL(coverImageResponse.data);
                setMenuSettings((prevSettings) => ({
                    ...prevSettings,
                    coverImageUrl: coverImageObjectURL, // Add cover image URL to the menu settings
                }));
            }

            console.log("meniiiiiii", menuSettings);

        } catch (error) {
            console.error("Error fetching menu settings or images:", error);
            setError("Failed to load menu settings or images.");
        } finally {
            setLoading(false);
        }
    };






    useEffect(() => {
        const generateQrCode = async () => {
            try {
                const url = await QRCode.toDataURL(menuUrl, {
                    width: 300,
                    margin: 2
                });
                setQrCodeUrl(url);
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        };

        if (menu_id) {
            generateQrCode();
        }



    }, [menu_id]); // Runs when 'menu_id' changes
    if (error) return <p>{error}</p>;
    const handleChange = (e) => {
        setMenuSettings({ ...menuSettings, [e.target.name]: e.target.value });
    };

    const handleDownload = () => {
        if (!qrCodeUrl) return;

        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `menu-${menu_id}-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    async function handleUpdateMenu(event) {
        event.preventDefault();
        setIsUpdatingSettings(true)
        console.log(owner_id);

        console.log("profileee", menuSettings.profileImageUrl);

        const menuObject = {
            owner_id,
            name: menuSettings.name,
            bio: menuSettings.bio,
            start_time: menuSettings.start_time,
            end_time: menuSettings.end_time,

        };
        let compressedFile = menuFile


        if (menuFile && menuFile.size > 2 * 1024 * 1024) {
            compressedFile = await compressImage(menuFile);


        }




        try {
            await handleSaveMenu(menuObject, compressedFile);
            // await getSections(m_id);
            // toast.success("تم تحديث العرض بنجاح");
            // closeEditOfferForm();
        } catch (error) {
            console.error('Error updating offer:', error);
            toast.error('حدث خطأ أثناء تعديل العرض');
        }
    }
    const handleSaveMenu = async (menuObject, file) => {

        const menuPayload = file ? createFormData(menuObject, file, "profile_image") : menuObject;


        console.log("payload", menuPayload);

        const response = await axios.post(`${apiUrl}/api/menu/update/${m_id}`, menuPayload,
            {
                headers: authHeader(),
            }
        );
        console.log("menu successfully created:", response.data);
        toast.success("تم تعديل المنيو بنجاح");
        setIsUpdatingSettings(false)

        setIframeKey(Date.now());
        setIsIframeLoading(true); // Show loading state while iframe reloads
        setTimeout(() => setIsIframeLoading(false), 3000);



    }







    function handleMenuFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setMenuSettings((prev) => ({ ...prev, profileImageUrl: imageUrl }));
            setMenuFile(file)

        };
    }



    return <>
        <div className="menu-settings min-h-screen relative pb-20 flex md:flex-row flex-col gap-4  md:p-10 p-7">
            <Toaster></Toaster>

            <div className="menu-info md:w-2/5 w-full p-5 rounded-md bg-white shadow-lg h-fit">

                <div className="menu-info-f-section md:flex justify-between">
                    <p className='md:text-lg text-sm pb-4 font-medium cairo text-gray-700'>البيانات الأساسية</p>

                    <p className="text-sky-700 cairo text-sm font-medium flex items-center gap-2">
                        كود الحساب :
                        <span className="font-normal text-black text-xs">{menu_id}</span>

                        <button onClick={() => copyToClipboard(menu_id)} className="hover:text-green-500">
                            {copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
                        </button>
                    </p>

                </div>



                <div className="menu-images relative mb-12 mt-3">
                    {/* Cover Image */}
                    <div className="cover bg-slate-300 relative w-full ">
                        <img src={cover3} className="md:h-40 h-32 rounded-md w-full" alt="" />
                        {/* <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const imageUrl = URL.createObjectURL(file);
                                    setMenuSettings((prev) => ({ ...prev, coverImageUrl: imageUrl }));
                                }
                            }}
                            className="hidden"
                            id="cover-image-input"
                        />
                        <label
                            htmlFor="cover-image-input"
                            className="edit-cover cursor-pointer w-9 h-9 absolute bottom-2 right-2 flex justify-center items-center bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-full"
                        >
                            <i className="fa-regular fa-pen-to-square"></i>
                        </label> */}
                    </div>

                    {/* Profile Image */}
                    <div className="rest-logo absolute -bottom-8  left-14">
                        <img src={menuSettings.profileImageUrl || reslogo2} className="md:w-32 bg-white md:h-32 w-28 h-28 border-4 border-white rounded-full" alt="" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleMenuFileChange}
                            className="hidden"
                            id="profile-image-input"
                        />
                        <label
                            htmlFor="profile-image-input"
                            className="edit-img cursor-pointer w-9 h-9 absolute bottom-2 right-2 flex justify-center items-center bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-full"
                        >
                            <i className="fa-regular fa-pen-to-square"></i>
                        </label>
                    </div>
                </div>


                <div className="menu-name mt-7">
                    <label htmlFor="" className='block pb-3 cairo text-sky-900 font-semibold'>أسم البزنس</label>

                    <input type="text" name="name" value={menuSettings.name} onChange={handleChange} className="md:w-2/3 w-full h-9 border-2 rounded-md px-2" />

                </div>
                <div className="bio mt-7">
                    <label htmlFor="" className='block pb-3 cairo font-semibold text-sky-900'>
                        نبذة
                    </label>

                    <input type="text" name="bio" value={menuSettings.bio} onChange={handleChange} className="md:w-2/3 w-full h-9 border-2 rounded-md px-2" />

                </div>
                <div className="open-time pb-8 mt-7">
                    <label htmlFor="open-time" className="block pb-3 cairo font-semibold text-sky-900">موعد البدأ</label>
                    <input type="time" name="start_time" value={menuSettings.start_time} onChange={handleChange} id="open-time" className="md:w-2/3 w-full h-9 border-2 rounded-md px-2" />
                </div>

                <div className="close-time pb-8 mt-7">
                    <label htmlFor="close-time" className="block pb-3 cairo text-sky-900 font-semibold">موعد الأنتهاء</label>
                    <input type="time" name="end_time" value={menuSettings.end_time} onChange={handleChange} id="close-time" className="md:w-2/3 w-full h-9 border-2 rounded-md px-2" />

                </div>
                <hr className='pb-6' /> <div className="save-personal-info ">
                    <div className="save flex justify-end">

                        <button
                            onClick={handleUpdateMenu} className={`py-2 px-6 rounded-md text-white bg-green-600 cairo hover:bg-green-700  transition-colors flex items-center`}

                        >
                            {isUpdatingSettings ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    جاري الحفظ...
                                </>
                            ) : 'حفظ'}
                        </button>



                    </div>

                </div>


            </div >
            <div className="view md:w-1/3 w-full flex flex-col pb-6 pt-4 items-center rounded-md bg-white shadow-lg">
                <p className='cairo p-4'>معاينة</p>
                {/* Mobile Frame - 390x844 (iPhone 13 size) */}
                <div className="mobile-frame relative mx-auto o border-[12px] border-gray-800 rounded-[50px] h-[650px] w-[300px] overflow-hidden bg-gray-800 shadow-xl">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 r w-full h-12 bg-gray-800 flex justify-between items-center px-6 z-10">
                        <span className="text-white text-xs font-semibold">
                            {new Date().toLocaleTimeString('en-US', {
                                hour12: false,  // 24-hour format
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>                        <div className="flex gap-2">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 10.2h14v1.6H5z" />
                                <path d="M11.4 6.2h1.2v2h-1.2z" fillRule="evenodd" />
                            </svg>
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 6a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1z" fillRule="evenodd" />
                                <path d="M17 11a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zM7 11a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1z" fillRule="evenodd" />
                            </svg>
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.5 8a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" fillRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    {/* Loading Skeleton (shown while iframe loads) */}
                    {isIframeLoading && (
                        <div className='iframe-loading bg-white flex flex-col justify-center items-center' style={{ height: 'calc(100% - 68px)' }}>
                            {/* Your skeleton loader (repeated for demo) */}
                            <div className="flex flex-row gap-2">
                                <div className="w-4 h-4 rounded-full bg-sky-500 animate-bounce"></div>
                                <div
                                    className="w-4 h-4 rounded-full bg-sky-500 animate-bounce [animation-delay:-.3s]"
                                ></div>
                                <div
                                    className="w-4 h-4 rounded-full bg-sky-500 animate-bounce [animation-delay:-.5s]"
                                ></div>
                            </div>

                            {/* {[...Array(5)].map((_, index) => (
                                <div key={index} dir='ltr' className="relative flex w-64 animate-pulse gap-2 p-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-400"></div>
                                    <div className="flex-1">
                                        <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
                                        <div className="h-5 w-[90%] rounded-lg bg-slate-400 text-sm"></div>
                                    </div>
                                    <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-400"></div>
                                </div>
                            ))} */}
                        </div>
                    )}

                    {/* Iframe (hidden until loaded) */}
                    {/* <iframe
                        key={iframeKey}
                        src={`/menu/${menu_id}?v=${iframeKey}`} // Cache-busting query param
                        className={`w-full h-[calc(100%-68px) overflow-hidden] mt-12 border-0 ${isIframeLoading ? 'hidden' : 'block'}`}
                        style={{ height: 'calc(100% - 68px)' }}
                        frameBorder="0"
                        loading="lazy"
                        title="Menu Preview"
                        onLoad={() => setIsIframeLoading(false)} // Hide loader when loaded
                    /> */}
                    <iframe
                        key={iframeKey}
                        src={`/menu/${menu_id}?v=${iframeKey}`}
                        className={`w-full h-[calc(100%-68px) overflow-hidden] mt-12 border-0 ${isIframeLoading ? 'hidden' : 'block'}`}
                        style={{ height: 'calc(100% - 68px)' }}
                        frameBorder="0"
                        loading="lazy"
                        title="Menu Preview"
                        onLoad={() => {
                            console.log("Iframe loaded successfully");
                            setIsIframeLoading(false); // Hide loader when fully loaded
                        }}
                        onError={() => {
                            console.error("Iframe failed to load");
                            setIsIframeLoading(false); // Ensure loading state is reset even if there's an error
                        }}
                    />
                    {/* Home Indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
                </div>
            </div>
            <div className="qr-img flex flex-col h-fit p-8 bg-white gap-3 rounded-lg items-center">
                {qrCodeUrl ? (
                    <img src={qrCodeUrl} className='w-32' alt="QR Code" />
                ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100">
                        <p className="text-xs text-gray-500">جارٍ إنشاء QR...</p>
                    </div>
                )}

                <div className="qr-btns">
                    <button
                        onClick={handleDownload}
                        disabled={!qrCodeUrl}
                        className='w-full max-w-xs bg-sky-600 hover:bg-sky-500 text-white rounded-md p-1  px-3 cairo disabled:bg-gray-400 disabled:cursor-not-allowed'
                    >
                        <i className="fa-solid fa-download"></i> تحميل
                    </button>
                </div>
            </div>






        </div>





    </>
}
