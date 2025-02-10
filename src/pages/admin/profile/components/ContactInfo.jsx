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
                            readOnly
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
