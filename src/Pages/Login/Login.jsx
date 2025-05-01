import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import useFetchData from '../../utils/useApi.js';
// import { useGoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [menuID, setMenuId] = useState("");

    // const [googleToken, setGoogleToken] = useState("");
    const { isLoading, error, fetchData, data } = useFetchData();


    const [showPassword, setShowPassword] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    // Initialize toast notifications
    // const notifyError = (message) => toast.error(message);

    const handleLogin = async (e, googleToken = null) => {

        // Prepare the data to send to the API

        let data = {};

        // If Google login, use the Google credentials
        if (googleToken) {
            data = {
                google_token: googleToken, // assuming googleData contains the tokenId from Google
            };
            console.log(data);

        } else {
            e.preventDefault();

            // If using email/password, use the state variables
            data = { email, password };
            console.log(data);

        }


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
                localStorage.setItem("uId", response.data.user.id)


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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    // const login = useGoogleLogin({
    //     onSuccess: tokenResponse => console.log(tokenResponse),

    // });


    return <>
        <Toaster />
        <section dir='rtl' className="bg-gray-100 min-h-screen flex box-border justify-center items-center">
            <div className="bg-white shadow-lg rounded-2xl flex max-w-3xl p-5 items-center">
                <div className="md:w-1/2 px-8">
                    <h2 className="font-bold text-3xl text-[#002D74] cairo">تسجيل الدخول</h2>
                    <p className="text-sm mt-4 text-[#002D74] cairo"> اذا كنت بالفعل عميل سجل دخولك الأن</p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            className="p-2 mt-8 cairo rounded-xl border"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="الأيميل"
                            required />
                        <div className="relative">
                            <input
                                className="p-2 rounded-xl cairo border w-full"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                placeholder="كلمة المرور"
                                required />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="gray"
                                id="togglePassword"
                                className="bi bi-eye absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer z-20 opacity-100"
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
                        <button type="submit" className="bg-[#002D74] cairo flex justify-center items-center text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium">

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
                            تسجيل الدخول
                        </button>
                    </form>
                    <div className="mt-6  items-center text-gray-100">
                        <hr className="border-gray-300" />
                        <p className="text-center text-sm">OR</p>
                        <hr className="border-blue-300" />
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                console.log(credentialResponse.credential);
                                let googleToken = credentialResponse.credential

                                const credentialResponseDecoded = jwtDecode(credentialResponse.credential)
                                console.log(credentialResponseDecoded);
                                handleLogin(null, googleToken);

                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />;
                    </div>
                    {/* <button onClick={() => login()} className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-[#60a8bc4f] font-medium">
                        <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        </svg>

                        Login with Google
                    </button> */}
                    <div className="mt-10 text-sm border-b border-gray-500 py-5 playfair cairo tooltip">نسيت كلمة المرور ؟</div>

                    <div className="mt-4 text-sm flex justify-between items-center container-mr">
                        <p className="mr-3 md:mr-0 cairo ">ليس لديك حساب؟</p>
                        <button className="hover:border cairo register text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">

                            <Link to={"/"}>سجل الأن</Link>
                        </button>
                    </div>
                </div>
                <div className="md:block hidden w-1/2">
                    <img className="rounded-2xl max-h-[1600px]" src="https://images.unsplash.com/photo-1552010099-5dc86fcfaa38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmcmVzaHxlbnwwfDF8fHwxNzEyMTU4MDk0fDA&ixlib=rb-4.0.3&q=80&w=1080" alt="login form image" />
                </div>
            </div>
        </section>

    </>
}
