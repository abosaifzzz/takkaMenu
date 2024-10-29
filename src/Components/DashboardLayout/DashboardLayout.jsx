import React from 'react'
import { Outlet } from 'react-router-dom'
import DashSideBar from '../DashSideBar/DashSideBar'
import DashNavbar from '../DashNavbar/DashNavbar'

export default function DashboardLayout() {
    return <>
        <div className="dash-layout  bg-slate-100 relative flex">


            <DashSideBar />

            <div className="second-side w-[85%] m-0 ms-[15%]">


                <DashNavbar />

                <div className="content bg-slate-100 ">

                    <Outlet></Outlet>

                </div>


            </div>

        </div>


    </>
}
