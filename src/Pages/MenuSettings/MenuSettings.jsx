import React, { useEffect, useState } from 'react'
import cover from "../../assets/cover.jpg"
import reslogo from "../../assets/res-logo.jpg"
import qr from "../../assets/qr.png"

import { useParams } from 'react-router-dom'
import axios from 'axios'

import { Clipboard, ClipboardCheck } from "lucide-react"; // Lucide icons
import toast, { Toaster } from 'react-hot-toast'
import { createFormData } from '../../utils/index.js'

export default function MenuSettings() {

    const menu_id = localStorage.getItem("menu")
    const [menuSettings, setMenuSettings] = useState({
        name: "",
        bio: "",
        start_time: "",
        end_time: "",
        profile_image: "",
        cover_image: "",
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset icon after 2s
        });
    };


    // useEffect(() => {
    //     const fetchMenuSettings = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:234/menu-settings/${menu_id}`);
    //             console.log(response.data.menuSettings);

    //             setMenuSettings(response.data.menuSettings); // Assuming the API returns { updatedMenu: { ... } }
    //             console.log(menuSettings);

    //         } catch (error) {
    //             console.error("Error fetching menu settings:", error);
    //             setError("Failed to load menu settings.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (menu_id) {
    //         fetchMenuSettings();
    //     }
    // }, [menu_id]); // Runs when 'id' changes
    // if (loading) return <p>Loading...</p>;
    useEffect(() => {
        const fetchMenuSettings = async () => {
            try {
                // Fetch menu settings
                const response = await axios.get(`http://localhost:234/menu-settings/${menu_id}`);
                console.log(response.data.menuSettings);

                // Set menu settings
                setMenuSettings(response.data.menuSettings);

                // Fetch profile image if it exists
                if (response.data.menuSettings.profile_image) {
                    const profileImageUrl = `http://localhost:234/api/file/${response.data.menuSettings.profile_image}`;
                    const profileImageResponse = await axios.get(profileImageUrl, { responseType: 'blob' });
                    const profileImageObjectURL = URL.createObjectURL(profileImageResponse.data);
                    setMenuSettings((prevSettings) => ({
                        ...prevSettings,
                        profileImageUrl: profileImageObjectURL, // Add profile image URL to the menu settings
                    }));
                }

                // Fetch cover image if it exists
                if (response.data.menuSettings.cover_image) {
                    const coverImageUrl = `http://localhost:234/api/file/${response.data.menuSettings.cover_image}`;
                    const coverImageResponse = await axios.get(coverImageUrl, { responseType: 'blob' });
                    const coverImageObjectURL = URL.createObjectURL(coverImageResponse.data);
                    setMenuSettings((prevSettings) => ({
                        ...prevSettings,
                        coverImageUrl: coverImageObjectURL, // Add cover image URL to the menu settings
                    }));
                }
            } catch (error) {
                console.error("Error fetching menu settings or images:", error);
                setError("Failed to load menu settings or images.");
            } finally {
                setLoading(false);
            }
        };

        if (menu_id) {
            fetchMenuSettings();
        }
    }, [menu_id]); // Runs when 'menu_id' changes
    if (error) return <p>{error}</p>;
    const handleChange = (e) => {
        setMenuSettings({ ...menuSettings, [e.target.name]: e.target.value });
    };
    const handleSave = async () => {
        try {
            const response = await axios.patch(`http://localhost:234/menu-settings/${menu_id}`, menuSettings);

            toast.success("Menu Settings Updated Successfully")
        } catch (error) {
            console.error("Error updating menu settings:", error);
            alert("Failed to update menu.");
        }
    };


    return <>
        <div className="menu-settings min-h-screen relative pb-20 flex md:flex-row flex-col gap-4  md:p-10 p-7">
            <Toaster></Toaster>

            <div className="menu-info md:w-2/3 w-full p-5 rounded-md bg-white shadow-lg h-fit">

                <div className="menu-info-f-section md:flex justify-between">
                    <p className='md:text-lg text-sm pb-4 font-medium text-gray-700'>Menu Information</p>

                    <p className="text-sky-700 text-sm font-medium flex items-center gap-2">
                        Menu ID :
                        <span className="font-normal text-black text-xs">{menu_id}</span>

                        <button onClick={() => copyToClipboard(menu_id)} className="hover:text-green-500">
                            {copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
                        </button>
                    </p>

                </div>


                {/* <div className="menu-images relative mb-12  mt-3">




                    <div className="cover bg-slate-300 relative lg:w-4/6 md:w-4/5">

                        <img src={menuSettings.coverImageUrl} className='md:h-40 h-32 rounded-md w-full' alt="" />
                        <div className="edit-cover cursor-pointer w-9 h-9 absolute bottom-2 right-2 flex justify-center items-center bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-full">
                            <i className="fa-regular fa-pen-to-square"></i>

                        </div>
                        <div className="rest-logo absolute -bottom-8 left-1/3">
                            <img src={menuSettings.profileImageUrl} className='md:w-32 md:h-32 w-28 h-28 border-4 border-white rounded-full' alt="" />
                            <div className="edit-img cursor-pointer w-9 h-9 absolute bottom-2 right-2 flex justify-center items-center bg-slate-50 border-2 border-slate-300 hover:border-slate-400 rounded-full">
                                <i className="fa-regular fa-pen-to-square"></i>

                            </div>

                        </div>
                    </div>


                </div> */}

                <div className="menu-images relative mb-12 mt-3">
                    {/* Cover Image */}
                    <div className="cover bg-slate-300 relative lg:w-4/6 md:w-4/5">
                        <img src={menuSettings.coverImageUrl} className="md:h-40 h-32 rounded-md w-full" alt="" />
                        <input
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
                        </label>
                    </div>

                    {/* Profile Image */}
                    <div className="rest-logo absolute -bottom-8 left-1/3">
                        <img src={menuSettings.profileImageUrl} className="md:w-32 md:h-32 w-28 h-28 border-4 border-white rounded-full" alt="" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const imageUrl = URL.createObjectURL(file);
                                    setMenuSettings((prev) => ({ ...prev, profileImageUrl: imageUrl }));
                                }
                            }}
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
                    <label htmlFor="" className='block pb-3'>Menu Name</label>

                    <input type="text" name="name" value={menuSettings.name} onChange={handleChange} className="md:w-2/3 w-full h-9 border-2 rounded-md px-2" />

                </div>
                <div className="bio mt-7">
                    <label htmlFor="" className='block pb-3'>Bio</label>

                    <input type="text" name="bio" value={menuSettings.bio} onChange={handleChange} className="md:w-2/3 w-full h-9 border-2 rounded-md px-2" />

                </div>
                <div className="open-time pb-8 mt-7">
                    <label htmlFor="open-time" className="block pb-3">Open Time</label>
                    <input type="time" name="start_time" value={menuSettings.start_time} onChange={handleChange} id="open-time" className="md:w-2/3 w-full h-9 border-2 rounded-md px-2" />
                </div>

                <div className="close-time pb-8 mt-7">
                    <label htmlFor="close-time" className="block pb-3">Close Time</label>
                    <input type="time" name="end_time" value={menuSettings.end_time} onChange={handleChange} id="close-time" className="md:w-2/3 w-full h-9 border-2 rounded-md px-2" />

                </div>
                <hr className='pb-6' /> <div className="save-personal-info ">
                    <div className="save flex justify-end">
                        <button onClick={handleSave} className='px-6 py-2  rounded-md bg-sky-600 text-white hover:bg-sky-500'>Save</button>

                    </div>

                </div>


            </div >
            <div className="qrcode md:w-1/4 w-full h-60 flex flex-col items-center rounded-md bg-white shadow-lg">
                <div className="qr-img m-5">
                    <img src={qr} className='w-40' alt="" />
                    <button className='w-full bg-sky-600 hover:bg-sky-500 text-white rounded-md p-1'><i className="fa-solid fa-download"></i> Download</button>

                </div>



            </div>







        </div>





    </>
}
