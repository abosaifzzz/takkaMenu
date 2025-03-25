// ApiService.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import { useToast } from 'app/contexts/ToastContext';
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router

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
const isProduction = true;
const baseUrl = `http://localhost:234`;
const useFetchData = () => {
  // const { handleOpenToast } = useToast();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const API = baseUrl;
  const Navigate = useNavigate();
  useEffect(() => {
    const axiosSource = axios.CancelToken.source();

    return () => {
      axiosSource.cancel("Request canceled by cleanup"); // <-- Cancel the request on cleanup
    };
  }, []);
  const axiosSource = useRef(null); // <-- Define axiosSource outside the fetchData function

  const fetchData = async (url, data = false, headers = false) => {
    axiosSource.current = axios.CancelToken.source(); // <-- Update the current reference

    try {
      setIsLoading(true);
      if (data && !data.params) {
        if (!isProduction) {
          console.log("posting data to", url);
        }
        let response = await axios.post(API + url, data, {
          headers: authHeader(),
          cancelToken: axiosSource.current.token,
        });
        setData(response.data?.result);

        if (response?.data?.message) {
          let msgType = response.data.success ? "success" : "error";
          // handleOpenToast(msgType, response.data.message, true);
        }

        return response;
      } else {
        if (!isProduction) {
          console.log("getting data from", url);
        }

        let response = await axios.get(API + url, {
          headers: authHeader(),
          cancelToken: axios.CancelToken.source().token,
          params: data.params || {},
        });
        setData(response.data?.result);
        if (response?.data?.message) {
          let msgType = response.data.success ? "success" : "error";
          // handleOpenToast(msgType, response.data.message, true);
        }

        return response;
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data);

      if (error.response?.data) {
        // handleOpenToast(
        //   'error',
        //   error.response?.data.message ||
        //     (typeof error.response?.data !== 'object' && error.response?.data) ||
        //     'Error',
        //   true
        // );
        console.log(error.response.status === 401);

        if (error.response.status === 401) {
          Navigate("/session/signin");
        }
      }

      return error.response?.data;
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return { isLoading, setIsLoading, error, fetchData, data };
};
export default useFetchData;
