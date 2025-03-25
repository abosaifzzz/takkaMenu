import React from 'react'

export default function ConfirmEmail() {
    return <>
        <div className="bg-confirm">



            <div className="otp-confirmation bg-black/70 flex flex-col gap-24 justify-center items-center min-h-screen ">


                <p className='text-white text-3xl'>Check your Email Inbox Or Span box to get the Code </p>

                <form className="form-confirm px-14 py-9">
                    <div className="content-confirm">
                        <p className='text-center' >OTP Verification</p>
                        <div className="inp">
                            <input placeholder="" type="text" className="input-confirm" maxlength="1" />
                            <input placeholder="" type="text" className="input-confirm" maxlength="1" />
                            <input placeholder="" type="text" className="input-confirm" maxlength="1" />
                            <input placeholder="" type="text" className="input-confirm" maxlength="1" />
                        </div>
                        <button>Verify</button>
                        <svg className="svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4073ff" d="M56.8,-23.9C61.7,-3.2,45.7,18.8,26.5,31.7C7.2,44.6,-15.2,48.2,-35.5,36.5C-55.8,24.7,-73.9,-2.6,-67.6,-25.2C-61.3,-47.7,-30.6,-65.6,-2.4,-64.8C25.9,-64.1,51.8,-44.7,56.8,-23.9Z" transform="translate(100 100)" className="path"></path>
                        </svg>
                    </div>

                </form>


            </div>
        </div>


    </>
}
