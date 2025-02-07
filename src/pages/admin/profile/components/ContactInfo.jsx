// // import React, { useState } from 'react'
// // import Button from '../../../../components/small/Button';
// // import Input from '../../../../components/small/Input';
// // import Dropdown from '../../../../components/small/Dropdown';

// // function ContactInfo({ tabs, activeTab }) {



// //     const [formData, setFormData] = useState({});

// //     const handleDropdownChange = (name, value) => {
// //         setFormData((prev) => ({ ...prev, [name]: value }));
// //     };
// //     const formDataChangeHandler = (e) => {
// //         setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// //     };


// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const userData = { ...formData, priority: ["High"] };
// //             const response = await signUp(userData).unwrap();
// //             dispatch(setCredentials(response));
// //             toast.success("SignUp Successful");
// //             navigate("/user"); // Redirect to /user page

// //         } catch (error) {
// //             toast.error("SignUp Failed");
// //         }
// //     };


// //     return (
// //         <div className="flex flex-col gap-8">
// //             {/* User Info Card */}
// //             <section className='flex items-center justify-between'>
// //                 <section className='flex items-center justify-center gap-8'>
// //                     <section>
// //                         <img
// //                             src="https://placehold.co/600x400/white/18bc9c?text=AZ"
// //                             alt="image"
// //                             className="w-24 h-24 rounded-full object-cover"
// //                         />
// //                     </section>
// //                     <section className='flex flex-col gap-3'>
// //                         <section>name</section>
// //                         <section>email</section>
// //                     </section>
// //                 </section>
// //                 <section className=' flex flex-col gap-5'>
// //                     <section className='flex gap-5 '>
// //                         <Button text="free" className="!h-0 p-5" />
// //                         <Button text="free" className="!h-0 p-5" />
// //                     </section>
// //                     <section>
// //                         add by email address
// //                     </section>
// //                 </section>
// //             </section>
// //             <section className='grid text-primary grid-cols-12 gap-4'>

// //                 {[
// //                     { name: "name", label: "Full Name", type: "text" },
// //                     { name: "email", label: "Email", type: "email" },
// //                     { name: "password", label: "Password", type: "password" },
// //                     { name: "dob", label: "Date of Birth", type: "date" },
// //                     { name: "location", label: "Location", type: "text" },
// //                     { name: "num_clients", label: "Number of Clients", type: "text" },
// //                 ].map(({ name, label, type }) => (
// //                     <div key={name} className="lg:col-span-6">
// //                         <Input label={label} placeholder={label} name={name} type={type} onChange={formDataChangeHandler} />
// //                     </div>
// //                 ))}

// //                 <div className="lg:col-span-6">
// //                     <Dropdown
// //                         defaultText="Select Role"
// //                         label="Role"
// //                         options={[
// //                             { option: "Practitioner Account", value: "Practitioner Account" },
// //                             { option: "Admin", value: "Admin" },
// //                         ]}
// //                         onSelect={(selectedOption) => handleDropdownChange("role", selectedOption.value)}
// //                     />
// //                 </div>
// //             </section>
// //             <section className='flex items-center justify-between'>
// //                 <section>
// //                     <Button text="Delete Account" />
// //                 </section>
// //                 <section className='flex gap-4'>
// //                     <Button text="Cancel" />
// //                     <Button text="Save" onClick={handleSubmit} />
// //                     <Button text="Edit" />
// //                 </section>
// //             </section>

// //         </div>
// //     )
// // }

// // export default ContactInfo


// import React, { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// // import { toast } from 'react-toastify';
// import Button from '../../../../components/small/Button';
// import Input from '../../../../components/small/Input';
// import Dropdown from '../../../../components/small/Dropdown';
// // import { signUp } from '../../../../services/authService'; // Ensure this import exists
// // import { setCredentials } from '../../../../store/authSlice'; // Ensure correct import

// function ContactInfo({ userProfile }) {
//     // const [formData, setFormData] = useState({});
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     console.log("userProfile", userProfile)


//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         dob: "",
//         location: "",
//         num_clients: "",
//         role: ""
//     });

//     // Update formData when userProfile is received
//     useEffect(() => {
//         if (userProfile) {
//             setFormData({
//                 name: userProfile.name || "",
//                 email: userProfile.email || "",
//                 password: "",  // Keep password empty for security reasons
//                 dob: userProfile.dob || "",
//                 location: userProfile.location || "",
//                 num_clients: userProfile.num_clients || "",
//                 role: userProfile.role || ""
//             });
//         }
//     }, [userProfile]);

//     // Handle dropdown changes
//     const handleDropdownChange = useCallback((name, value) => {
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     }, []);

//     // Handle text input changes
//     const formDataChangeHandler = useCallback((e) => {
//         setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     }, []);

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formData.name || !formData.email || !formData.password) {
//             // toast.error('Please fill all required fields.');
//             return;
//         }
//         // try {
//         //     const userData = { ...formData, priority: ["High"] };
//         //     const response = await signUp(userData).unwrap();
//         //     dispatch(setCredentials(response));
//         //     toast.success('SignUp Successful');
//         //     navigate('/user');
//         // } catch (error) {
//         //     toast.error('SignUp Failed');
//         // }
//     };

//     return (
//         <div className="flex flex-col gap-6 p-4 sm:p-6 bg-white rounded-lg shadow-md">
//             {/* User Info Card */}
//             <section className="flex flex-wrap items-center justify-between gap-6">
//                 <section className="flex items-center gap-6">
//                     <img
//                         src="https://placehold.co/600x400/white/18bc9c?text=AZ"
//                         alt="User"
//                         className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full object-cover"
//                     />
//                     <section className="flex flex-col gap-2">
//                         <p className="text-lg font-semibold">User Name</p>
//                         <p className="text-sm text-gray-500">email@example.com</p>
//                     </section>
//                 </section>
//                 <section className="flex flex-col gap-4  item-end place-items-end ">
//                     <section className="flex gap-3">
//                         <Button text="Free" className="py-2 px-4 text-sm" />
//                         <Button text="Premium" className="py-2 px-4 text-sm" />
//                     </section>
//                     <section >

//                         <p className="text-sm text-gray-600">Add by email address</p>
//                     </section>
//                 </section>
//             </section>

//             {/* Form Fields */}
//             <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 text-primary">
//                 {[
//                     { name: "name", label: "Full Name", type: "text" },
//                     { name: "email", label: "Email", type: "email" },
//                     { name: "password", label: "Password", type: "password" },
//                     { name: "dob", label: "Date of Birth", type: "date" },
//                     { name: "location", label: "Location", type: "text" },
//                     { name: "num_clients", label: "Number of Clients", type: "text" },
//                 ].map(({ name, label, type }) => (
//                     <Input
//                         key={name}
//                         label={label}
//                         placeholder={label}
//                         name={name}
//                         type={type}
//                         onChange={formDataChangeHandler}
//                     />
//                 ))}

//                 <Dropdown
//                     defaultText="Select Role"
//                     label="Role"
//                     options={[
//                         { option: "Practitioner Account", value: "Practitioner Account" },
//                         { option: "Admin", value: "Admin" },
//                     ]}
//                     onSelect={(selectedOption) => handleDropdownChange("role", selectedOption.value)}
//                 />
//             </section>

//             {/* Buttons */}
//             <section className="flex flex-wrap justify-between items-center gap-4">
//                 <Button text="Delete Account" className="bg-red-500 text-white" />
//                 <div className="flex gap-3">
//                     <Button text="Cancel" className="bg-gray-300 text-white" />
//                     <Button text="Save" onClick={handleSubmit} className=" text-white" />
//                     <Button text="Edit" className="bg-blue-500 text-white" />
//                 </div>
//             </section>
//         </div>
//     );
// }

// export default ContactInfo;

import React, { useState, useEffect } from "react";
import Button from "../../../../components/small/Button";
import Input from "../../../../components/small/Input";
import Dropdown from "../../../../components/small/Dropdown";

function ContactInfo({ tabs, activeTab, userProfile }) {
    // Initialize state with empty values
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        dob: "",
        location: "",
        num_clients: "",
        role: ""
    });

    // Update formData when userProfile is received
    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || "",
                email: userProfile.email || "",
                password: "",  // Keep password empty for security reasons
                dob: userProfile.dob || "",
                location: userProfile.location || "",
                num_clients: userProfile.num_clients || "",
                role: userProfile.role || ""
            });
        }
    }, [userProfile]);

    // Handle input change
    const formDataChangeHandler = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handle dropdown change
    const handleDropdownChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting Data:", formData);
            // Perform API call or update user data
            toast.success("Profile Updated Successfully");
        } catch (error) {
            toast.error("Update Failed");
        }
    };

    return (
        <div className="flex flex-col gap-8 p-4 sm:p-6 bg-white rounded-lg shadow-md">
            {/* User Info Card */}
            <section className="flex items-center justify-between">
                <section className="flex items-center justify-center gap-8">
                    <section className="w-24 h-24 border rounded-full">
                        <img
                            src="https://placehold.co/600x400/white/18bc9c?text=AZ"
                            alt="image"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    </section>
                    <section className="flex flex-col gap-3">
                        <section>{userProfile?.name || "Name"}</section>
                        <section>{userProfile?.email || "Email"}</section>
                    </section>
                </section>
                <section className="flex flex-col gap-4  item-end place-items-end ">
                    <section className="flex gap-3">
                        <Button text="Free" className="py-2 px-4 text-sm" />
                        <Button text="Premium" className="py-2 px-4 text-sm" />
                    </section>
                    <section >

                        <p className="text-sm text-gray-600">Add by email address</p>
                    </section>

                </section>
            </section>

            {/* Form Fields */}
            <section className="grid text-primary grid-cols-12 gap-4">
                {[
                    { name: "name", label: "Full Name", type: "text" },
                    { name: "email", label: "Email", type: "email" },
                    // { name: "password", label: "Password", type: "password" },
                    { name: "dob", label: "Date of Birth", type: "date" },
                    { name: "location", label: "Location", type: "text" },
                    { name: "num_clients", label: "Number of Clients", type: "text" },
                ].map(({ name, label, type }) => (
                    <div key={name} className="lg:col-span-6">
                        <Input
                            label={label}
                            placeholder={label}
                            name={name}
                            type={type}
                            value={formData[name]} // Set value from state
                            onChange={formDataChangeHandler}
                        />
                    </div>
                ))}

                {/* Dropdown for Role Selection */}
                <div className="lg:col-span-6">
                    <Dropdown
                        defaultText="Select Role"
                        label="Role"
                        options={[
                            { option: "Practitioner Account", value: "Practitioner Account" },
                            { option: "Admin", value: "Admin" },
                        ]}
                        selected={formData.role} // Set selected value
                        onSelect={(selectedOption) => handleDropdownChange("role", selectedOption.value)}
                    />
                </div>
            </section>

            {/* Action Buttons */}
            <section className="flex items-center justify-between">
                <Button text="Delete Account" />
                <section className="flex gap-4">
                    <Button text="Cancel" />
                    <Button text="Save" onClick={handleSubmit} />
                    <Button text="Edit" />
                </section>
            </section>
        </div>
    );
}

export default ContactInfo;
