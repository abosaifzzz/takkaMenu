import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

export default function TestMenu() {
    return <>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Menu Sample</title>
            <link rel="canonical" href="https://eats.takkasmart.com/test" />
        </Helmet>
        <div className="test-menu-page min-h-screen">
            <div className="layout bg-sky-400  relative h-screen  text-white w-full   flex justify-center  ">
                <div className="first-part  flex flex-col justify-center items-center  w-full   opacity-95 text-white">
                    <div className="iphone-frame  mt-28 mx-auto" style={{
                        width: 'min(90vw, 310px)',  // Responsive but max 310px wide
                        height: 'min(160vw, 672px)', // Maintain 19.5:9 aspect ratio
                        border: '12px solid #1a1a1a',
                        borderRadius: '50px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                        position: 'relative',
                        background: '#1a1a1a'
                    }}>
                        {/* Notch area */}
                        <div style={{
                            position: 'absolute',
                            top: '0',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '30%',
                            height: '20px',
                            background: '#1a1a1a',
                            borderRadius: '0 0 15px 15px',
                            zIndex: '10'
                        }}></div>

                        {/* Screen content */}
                        <iframe
                            src="https://eats.takkasmart.com/menu/mazezuk91a"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                display: 'block'
                            }}
                            title="Mobile Menu"
                            allow="geolocation; microphone; camera"
                            loading="lazy"
                        ></iframe>

                        {/* Home indicator (for modern iPhones) */}
                        <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '25%',
                            height: '5px',
                            background: 'rgba(255,255,255,0.5)',
                            borderRadius: '3px'
                        }}></div>
                    </div>


                </div>
            </div>




        </div>




    </>
}
