import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import useFetchData from '../../utils/useApi.js';


export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);



    const { isLoading, error, fetchData, data } = useFetchData();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email);

        // Validation checks
        if (!phone) {
            toast.error("Phone is required");
            return;
        }

        if (!password) {
            toast.error("Password is required");
            return;
        }

        if (!email) {
            toast.error("Email is required");
            return;
        }

        if (!fullName) {
            toast.error("Name is required");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const data = {
            name: fullName,
            email,
            password,
            phone_number: phone
        };

        console.log(data);

        try {
            console.log("Making the API request...");

            const response = await axios.post('http://localhost:234/auth/signup', data);

            console.log("Response received");
            console.log(response.data);
            toast.success("تم التسجبل بنجاح")
            setLoginLoading(true)

            setTimeout(() => {
                window.location.href = "/login";  // Redirect to dashboard

            }, 3000);

            // Redirect or handle successful signup
            // Example: navigate to another page on success
            // history.push('/success');

        } catch (error) {
            console.error('There was an error!', error);

            // Handle specific error responses
            if (error.response) {
                // Server responded with an error status code
                console.error("Response error:", error.response);
                toast.error(`Error: ${error.response.data.message || "Something went wrong"}`);
            } else if (error.request) {
                // No response received from the server
                console.error("Request error:", error.request);
                toast.error("No response from server");
            } else {
                // Any other errors
                console.error("Error:", error.message);
                toast.error("Error: " + error.message);
            }
        }
    };
    const handleLogin = async (googleToken = null, email) => {

        // Prepare the data to send to the API

        // let data = {};

        // // If Google login, use the Google credentials
        // if (googleToken) {
        //     data = {
        //         google_token: googleToken, // assuming googleData contains the tokenId from Google
        //     };
        //     console.log(data);

        // } else {
        //     e.preventDefault();

        //     // If using email/password, use the state variables
        //     data = { email, password };
        //     console.log(data);

        // }

        console.log(email);


        let data = {
            google_token: googleToken
        }
        console.log(data);


        try {
            // Call the login API using Axios
            console.log("Sending data to API...");

            const response = await axios.post("http://localhost:234/auth/login", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(response);
            if (response.data.user) {
                console.log("good");
                console.log(response.data.user.owner_id);
                const ownerId = response.data.user.owner_id
                localStorage.setItem("owner", ownerId)

                fetchData(`/api/ownermenus/${ownerId}`) // Fetch menus for the owner
                    .then((response) => {
                        console.log("Response data:", response?.data); // Debug log
                        if (response?.data[0]) {
                            console.log('Fetched Menus:', response.data);

                            localStorage.setItem('menu', response.data[0].id_hash);
                            localStorage.setItem('m_id', response.data[0].id);

                            let menuId = response.data[0].id_hash
                            console.log("from log", menuId);

                            localStorage.setItem('owner', ownerId);
                            setLoginLoading(true)
                            setTimeout(() => {
                                toast.success("تم تسجيل الدخول بنجاح")

                            }, 2000);



                            // const menusId = localStorage.getItem("menu")
                            // console.log(menusId);

                            setTimeout(() => {
                                window.location.href = `menu/${menuId}/dashboard`;  // Redirect to dashboard

                            }, 3000);



                        } else {
                            window.location.href = `/start`;  // Redirect to dashboard




                        }
                    })

                localStorage.setItem('token', response.data.accessToken);
                console.log(response.data.user.name);
                localStorage.setItem('name', response.data.user.name);  // Save name in localStorage


            } else {
                console.log("not good");
                toast.error(" رجاء التحقق من الايميل و كلمة المرور")

            }

            // Handle successful login
            // if (response.status === 200) {
            //     // You can store the token or handle it as required
            //     // Example: localStorage.setItem('token', response.data.token);
            // }
        } catch (error) {
            if (error.response) {
                // Handle server error response
                // notifyError(error.response.data.message || "Login failed");
            } else {
                // Handle network or other errors
                console.log("errrrrr");
            }
        }
    };
    return <>
        <Toaster />
        <div className="relative signup min-h-screen bg-gradient-to-br p-6 from-sky-500 to-sky-700">
            <div className=" absolute flex justify-center items-center top-6 right-6 left-6 bottom-6 rounded-md  bg-white/35 ">

                {/* <div className="sign-form relative  pt-12 flex flex-col items-center w-1/3 pb-4 rounded-lg bg-white">
                    <div className="shape w-12  rounded-full absolute -top-3 -left-4 h-10 bg-sky-300/35">
                    </div>

                    <div className="shape w-12  rounded-full absolute -bottom-3 -right-4 h-10 bg-sky-300/35">
                    </div>

                    <p className='text-2xl font-medium'>Let's Get Started!</p>


                    <div className="names w-full mt-5 p-3 flex gap-4 ">
                        <div className="first w-1/2 flex flex-col">
                            <label htmlFor="">First Name</label>
                            <input className='mt-2 border-2 rounded-md h-8 w-full' type="text" />

                        </div>
                        <div className="last w-1/2 flex flex-col">
                            <label htmlFor="">Last Name</label>
                            <input className='mt-2 border-2 rounded-md h-8 w-full' type="text" />

                        </div>
                    </div>
                    <div className="email w-full flex p-3 flex-col">
                        <label htmlFor="">Email</label>
                        <input className='mt-2 border-2 rounded-md h-8 w-full' type="text" />

                    </div>
                    <div className="phone w-full flex p-3 flex-col">
                        <label htmlFor="">phone Number</label>
                        <input className='mt-2 border-2 rounded-md h-8 w-full' type="text" />

                    </div>
                    <div className="names w-full mt-5 p-3 flex gap-4 ">
                        <div className="password w-1/2 flex flex-col">
                            <label htmlFor="">Password</label>
                            <input className='mt-2 border-2 rounded-md h-8 w-full' type="text" />

                        </div>
                        <div className="confirm w-1/2 flex flex-col">
                            <label htmlFor="">Confirm Password</label>
                            <input className='mt-2 border-2 rounded-md h-8 w-full' type="text" />

                        </div>
                    </div>
                    <div className="signup-btn w-full p-3">
                        <button className='w-full  p-3 rounded-md text-white bg-sky-500 hover:bg-sky-600 '>Get Started</button>
                    </div>

                    or
                    <GoogleLogin
                        text="signup_with"  // Ensures the button says "Sign up with Google"
                        onSuccess={(credentialResponse) => {
                            const userData = jwtDecode(credentialResponse.credential);
                            console.log("Signup Success:", userData);
                            // Send userData to your backend for registration
                        }}
                        onError={() => {
                            console.log("Signup Failed");
                        }}
                    />

                </div> */}

                <div className=" flex items-center xl:bg-slate-950  xl:w-2/6 lg:w-2/3 md:w-3/5 w-full lg:h-4/5 md:h-5/6 justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                    <div className="relative w-full h-full">
                        <div className="absolute   -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-sky-400 via-red-500 to-sky-700 shadow-lg animate-pulse"></div>
                        <div id="form-container" className="bg-white p-10 rounded-lg shadow-2xl h-full  relative z-10 transform transition duration-500 ease-in-out">
                            <h2 id="form-title" className="text-center lg:text-xl md:text-lg text-sm font-bold mb-3 text-gray-800 cairo">منيو جديد خبرة <span className='text-red-600 cairo'>جديدة</span> </h2>

                            <h2 id="form-title" className="text-center lg:text-2xl md:text-lg text-sm cairo font-bold mb-3 text-sky-800">سجل دلوقتي </h2>

                            <form dir='rtl' className="space-y-5">
                                <input value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text" className="bg-gray-100 text-gray-900 border-0 mb-0 rounded-md p-2  w-full focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out cairo duration-150" placeholder="الأسم بالكامل" />
                                <input type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} className="bg-gray-100 text-gray-900 border-0 rounded-md m-0 p-2 mb-4 w-full cairo focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="الأيميل" />
                                <div className="passwords lg:flex  justify-between gap-4">

                                    <div className="relative w-full">
                                        <input value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={showPassword ? "text" : "password"}
                                            className="bg-gray-100 text-gray-900 border-0 cairo rounded-md p-2 mb-4 w-full focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" placeholder="كلمة المرور" />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="gray"
                                            id="togglePassword"
                                            className="bi bi-eye absolute top-1/3 left-3 -translate-y-1/2 cursor-pointer z-20 opacity-100"
                                            viewBox="0 0 16 16"
                                            onClick={togglePasswordVisibility}
                                        >
                                            <path
                                                d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
                                            ></path>
                                            <path
                                                d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                                            ></path>
                                        </svg>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-eye-slash-fill absolute top-1/2 right-3 -z-1 -translate-y-1/2 cursor-pointer hidden"
                                            id="mama"
                                            viewBox="0 0 16 16"
                                            onClick={togglePasswordVisibility}
                                        >
                                            <path
                                                d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"
                                            ></path>
                                            <path
                                                d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"
                                            ></path>
                                        </svg>
                                    </div>


                                    <div className="relative w-full">
                                        <input value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)} type="password"
                                            className="bg-gray-100 text-gray-900 border-0 rounded-md p-2     w-full focus:bg-gray-200 focus:outline-none focus:ring-1  cairo focus:ring-blue-500 transition ease-in-out duration-150" placeholder="تأكيد كلمة المرور" />


                                    </div>
                                </div>
                                <input value={phone}
                                    onChange={(e) => setPhone(e.target.value)} type="text" className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 w-full focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out cairo duration-150" placeholder="الموبايل" />

                                <button onClick={handleSubmit} type="submit"
                                    className="w-full md:h-12 h-8 cairo flex justify-center items-center md:text-base text-sm bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    {loginLoading ? (
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="animate-spin h-5 w-5 mr-3 text-white"
                                        >
                                            <circle
                                                strokeWidth="4"
                                                stroke="currentColor"
                                                r="10"
                                                cy="12"
                                                cx="12"
                                                className="opacity-25"
                                            ></circle>
                                            <path
                                                d="M4 12a8 8 0 018-8v8H4z"
                                                fill="currentColor"
                                                className="opacity-75"
                                            ></path>
                                        </svg>
                                    ) : null}
                                    تسجيل
                                </button>
                                <p className="cairo text-blue-500 inline-block me-1 text-sm m-0">لديك حساب بالفعل ؟ </p>
                                <Link to={"/login"} className='cairo text-sm font-medium cursor-pointer hover:text-sky-600 '>تسجيل الدخول</Link>

                            </form>
                            <div className="flex items-center justify-between mt-4 mb-3">
                                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                                <a
                                    className="text-sm cairo text-gray-500 uppercase dark:text-gray-400 hover:underline"

                                >أو </a>
                                <span className="w-1/5 border-b dark:border-gray-400 md:w-1/4"></span>
                            </div>
                            <GoogleLogin
                                text="signup_with"  // Ensures the button says "Sign up with Google"
                                onSuccess={(credentialResponse) => {
                                    console.log(credentialResponse);

                                    let googleToken = credentialResponse.credential
                                    const credentialResponseDecoded = jwtDecode(credentialResponse.credential)
                                    let email = credentialResponseDecoded.email

                                    handleLogin(googleToken, email);
                                }}
                                onError={() => {
                                    console.log("Signup Failed");
                                }}
                            />

                        </div>
                    </div>
                </div>





            </div>



        </div>

    </>


}
