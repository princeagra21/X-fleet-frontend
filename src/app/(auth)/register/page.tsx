"use client";

import { Checkbox, CopyableInput, CustomInput, JsonKVInput, NumberInput, OTPInput, PasswordInput, SearchInput, SelectInput, TagInput, TextArea, ToggleSwitch } from '@/components/form/custominput'
import { useState } from 'react'
import Image from 'next/image'


const VEHICLES = [
    { label: "Car", value: "car" },
    { label: "Truck", value: "truck" },
    { label: "Bus", value: "bus" },
    { label: "Van", value: "van" },
];

function RegisterPage() {
    const [vehicle, setVehicle] = useState<string>("");
    const [autoProvision, setAutoProvision] = useState(true);
    const [tos, setTos] = useState(false);
    const [apiKey] = useState("sk_live_2a7f_•••_9c12");
    const [code, setCode] = useState("");
    const [query, setQuery] = useState("");

    const handleSearch = (q: string) => {
        // fire your search (API, router, etc.)
        console.log("Search:", q);
    };

    const handleClear = () => {
        console.log("Cleared");
    };

    const [skills, setSkills] = useState<string[]>(["tracking", "iot"]);

    // Validation & transform helpers
    const validateNoSpaces = (t: string) => !/\s{2,}/.test(t); // block multi-spaces
    const transformKebab = (t: string) => t.replace(/\s+/g, "-"); // "real time" -> "real-time"

    const [env, setEnv] = useState<Record<string, string>>({ region: "asia" });

    return (
        <div className="h-screen w-screen grid grid-cols-12">
            {/* Left Section (4/12) */}
            <div className="col-span-12 md:col-span-4 flex flex-col items-center justify-center bg-white p-6">
                {/* Logo */}
                <div className="mb-6 flex items-center justify-center text-white text-xl font-bold">
                    <Image
                        src="/images/fleetstack-logo.png"
                        alt="Fleet Stack Logo"
                        width={200}
                        height={10}
                        className="h-auto w-[160px] md:w-[200px]"
                    />
                </div>
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800">Super Admin Registration</h1>
            </div>

            {/* Right Section (8/12) */}
            <div className="col-span-12 md:col-span-8 flex items-center justify-center bg-gray-100 p-8">
                <form className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">


                    {/* Name Input */}
                    <CustomInput
                        id="name"
                        label="Name"
                        placeholder="John Doe"
                        leadingIconName="FaUser"
                    />

                      {/* Mobile Prefix  */}
                    <SelectInput
                        id="mobile-prefix"
                        label="Mobile Prefix"
                        placeholder="+1"
                        leadingIconName="FaPhone"
                        options={[{ label: "+1 (USA)", value: "+1" }, { label: "+91 (India)", value: "+91" }, { label: "+44 (UK)", value: "+44" }]}
                    />

                    {/* Mobile Number */}
                    <CustomInput
                        id="mobile-number"
                        label="Mobile Number"
                        placeholder="Enter your mobile number"
                        leadingIconName="FaPhone"
                        hint='Enter Your Mobile Number'
                        showCounter
                        maxLength={15}
                    />



                    {/* Email  */}
                    <CustomInput
                        id="email"
                        label="Email"
                        placeholder="you@company.com"
                        leadingIconName="FaEnvelope"
                        hint='Enter Your Email Address'
                        showCounter
                        maxLength={60}
                    />

                    {/* username */}
                    <CustomInput
                        id="username"
                        label="Username"
                        placeholder="Enter your username"
                        leadingIconName="FaUser"
                        hint='Enter Your Username'
                        showCounter
                        maxLength={30}
                    />

                    {/* 2) Password with icon by name + reveal button */}
                    <PasswordInput
                        id="pwd"
                        label="Password"
                        placeholder="••••••••"
                        leadingIconName="FaLock"


                    />

                                                            {/* Company  */}
                    <CustomInput
                        id="company"
                        label="Company Name"
                        placeholder="Fleet Stack"
                        leadingIconName="FaBuilding"
                        hint='Enrter Your Company Name'
                        showCounter
                        maxLength={60}
                    />
                  
                   {/* Country  */}
                    <SelectInput
                        id="country"
                        label="Country"
                        placeholder="Select your country"
                        leadingIconName="FaGlobe"
                        options={[
                            { label: "United States", value: "US" },
                            { label: "India", value: "IN" },
                            { label: "United Kingdom", value: "UK" },
                        ]}
                    />

                    {/* State */}
                    <SelectInput
                        id="state"
                        label="State"
                        placeholder="Select your state"
                        leadingIconName="FaMapMarkerAlt"
                        options={[
                            { label: "California", value: "CA" },
                            { label: "Maharashtra", value: "MH" },
                            { label: "England", value: "ENG" },
                        ]}
                    />


                    {/* City */}
                    <CustomInput
                        id="city"
                        label="City"
                        placeholder="Enter your city"
                        leadingIconName="FaMapMarkerAlt"
                        hint='Enter Your City'
                        showCounter
                        maxLength={60}
                    />

                    {/* Address */}
                    <TextArea
                        id="address"
                        label="Address" 
                        placeholder="Enter your address"
                        hint='Enter Your Address'
                        showCounter
                        maxLength={190}
                        autoGrow
                    />

                    {/* Pincode  */}
                    <CustomInput
                        id="pincode"
                        label="Pincode"
                        placeholder="Enter your pincode"
                        leadingIconName="FaMapPin"
                        hint='Enter Your Pincode'
                        showCounter
                        maxLength={6}
                    />







                

                   


                    {/* <NumberInput
                        id="fleet-size"
                        label="Fleet Size"
                        hint="Target 50+ vehicles"
                        min={0}
                        step={5}
                        defaultValue={50}
                    /> */}


                    {/* <SelectInput
                        id="vehicle-type"
                        label="Vehicle Type"
                        hint="Search & select"
                        leadingIconName="FaUser"
                        options={VEHICLES}
                        value={vehicle}
                        onValueChange={setVehicle}
                    /> */}




                    <Checkbox
                        id="tos"
                        label="Terms & Conditions"
                        text="I agree to the Fleet Stack Terms"
                        hint="Required to continue"
                        checked={tos}
                        onChange={setTos}
                    />






    




                    {/* Button (full row) */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 flex justify-end mt-6">
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg"
                        >
                            Register Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage