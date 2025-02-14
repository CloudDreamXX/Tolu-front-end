// // import { useState } from "react";
// // import Input from "../small/Input";
// // import Button from "../small/Button";
// // import Dropdown from "../small/Dropdown";
// // import SingUpModal1 from "../modals/SingUpModal1";
// // import { useLoginMutation, useSignUpMutation } from "../../redux/apis/apiSlice";
// // import { setCredentials, setUser } from "../../redux/slice/authSlice";
// // import toast from "react-hot-toast";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate } from "react-router-dom";

// // const SignupForm = () => {
// //   const [formData, setFormData] = useState({});
// //   const [selectedCategories, setSelectedCategories] = useState([]);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [verifyEmail, setVerifyEmail] = useState(true);

// //   const dispatch = useDispatch();
// //   const [signUp] = useSignUpMutation();
// //   const navigate = useNavigate();

// //   const formDataChangeHandler = (e) => {
// //     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// //   };

// //   const handleDropdownChange = (name, value) => {
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const userData = { ...formData, priority: ["High"], num_clients: '3', location: "location" };
// //       const response = await signUp(userData).unwrap();
// //       console.log("response", response)
// //       dispatch(setCredentials(response));
// //       toast.success("SignUp Successful");

// //       const email = response.user?.email;
// //       const userType = {
// //         role: email === "admin@example.com" ? "admin" : "user",
// //       };
// //       console.log("usertype", userType);
// //       dispatch(setUser({ email }));
// //       localStorage.setItem("userType", JSON.stringify(userType));

// //       toast.success("Login Successful");

// //       // Redirect based on user role
// //       navigate(userType.role === "admin" ? "/admin" : "/user");


// //     } catch (error) {
// //       console.error("Signup failed:", error);
// //       toast.error("SignUp Failed");
// //     }
// //   };

// //   const handleCategoryClick = (category) => {
// //     setSelectedCategories((prev) =>
// //       prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
// //     );
// //   };

// //   return (
// //     <>
// //       {isModalOpen && (
// //         <SingUpModal1
// //           isModalOpen={isModalOpen}
// //           selectedCategories={selectedCategories}
// //           onCategoryClick={handleCategoryClick}
// //           onClose={() => setIsModalOpen(false)}
// //         />
// //       )}
// //       <form
// //         onSubmit={handleSubmit}
// //         className="bg-transparent max-w-7xl  shadow-md backdrop-blur-[20px] p-4 border-2 border-primary/10 rounded-[20px] m-6 grid grid-cols-1 lg:grid-cols-12 gap-4 "
// //       >
// //         <div className="lg:col-span-12 flex justify-center">
// //           <h5 className="text-xl md:text-[32px] bg-gradientText text-transparent bg-clip-text font-extrabold leading-none">
// //             Sign up
// //           </h5>
// //         </div>
// //         {[
// //           { name: "name", label: "Full Name", type: "text" },
// //           { name: "email", label: "Email", type: "email" },
// //           { name: "dob", label: "Date of Birth", type: "date" },
// //           { name: "password", label: "Password", type: "password" },
// //           { name: "Confirm Password", label: "Confirm Password", type: "password" },
// //           // { name: "location", label: "Location", type: "text" },
// //           // { name: "num_clients"'3',, label: "Number of Clients", type: "text" },
// //         ].map(({ name, label, type }) => (
// //           <div key={name} className="lg:col-span-6">
// //             <Input label={label} placeholder={label} name={name} type={type} onChange={formDataChangeHandler} />
// //           </div>
// //         ))}
// //         {/* <div className="lg:col-span-6">
// //           <Dropdown
// //             defaultText="Select Role"
// //             label="Role"
// //             options={[
// //               { option: "Practitioner Account", value: "Practitioner Account" },
// //               { option: "Admin", value: "Admin" },
// //             ]}
// //             onSelect={(selectedOption) => handleDropdownChange("role", selectedOption.value)}
// //           />
// //         </div> */}
// //         {/* <div className="lg:col-span-2 flex items-end">
// //           <Button
// //             text="Verify Email"
// //             width="w-full"
// //             type="button"
// //             onClick={() => setVerifyEmail(false)}
// //           />
// //         </div> */}
// //         <div className={`lg:col-span-12 ${verifyEmail ? "opacity-50" : "opacity-100"}`}>
// //           {/* <Input label="Enter OTP Code" placeholder="Code" name="otp-code" type="number" onChange={formDataChangeHandler} disabled={verifyEmail} /> */}
// //           <Button text="Sign Up" type="submit" width="w-full"  />
// //         </div>
// //       </form>
// //     </>
// //   );
// // };

// // export default SignupForm;

// import { useState } from "react";
// import Input from "../small/Input";
// import Button from "../small/Button";
// import Dropdown from "../small/Dropdown";
// import SingUpModal1 from "../modals/SingUpModal1";

// // import SignUpModal1 from "../modals/SignUpModal1"; // Fixed spelling
// import { useSignUpMutation } from "../../redux/apis/apiSlice";
// import { setCredentials, setUser } from "../../redux/slice/authSlice";

// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const SignupForm = () => {
//   const [formData, setFormData] = useState({});
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [verifyEmail, setVerifyEmail] = useState(true);

//   const dispatch = useDispatch();
//   const [signUp] = useSignUpMutation();
//   const navigate = useNavigate();

//   const formDataChangeHandler = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleDropdownChange = (name, value) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userData = {
//         ...formData,
//         priority: ["High"],
//         num_clients: '3', // Fixed value type
//         role: "user",
//         location: "location",
//       };
//       const response = await signUp(userData).unwrap();
//       console.log("response", response);
//       dispatch(setCredentials(response));
//       toast.success("SignUp Successful");

//       const email = response.user?.email;
//       const userType = { role: email === "admin@example.com" ? "admin" : "user" };

//       localStorage.setItem("userType", JSON.stringify(userType));
//       dispatch(setUser({ email }));

//       // Redirect based on user role
//       navigate(userType.role === "admin" ? "/admin" : "/user");
//     } catch (error) {
//       console.error("Signup failed:", error);
//       toast.error("SignUp Failed");
//     }
//   };

//   const handleCategoryClick = (category) => {
//     setSelectedCategories((prev) =>
//       prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
//     );
//   };

//   return (
//     <>
//       {isModalOpen && (
//         <SingUpModal1
//           isModalOpen={isModalOpen}
//           selectedCategories={selectedCategories}
//           onCategoryClick={handleCategoryClick}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-transparent max-w-7xl shadow-md backdrop-blur-[20px] p-4 border-2 border-primary/10 rounded-[20px] m-6 grid grid-cols-1 lg:grid-cols-12 gap-4"
//       >
//         <div className="lg:col-span-12 flex justify-center">
//           <h5 className="text-xl md:text-[32px] bg-gradientText text-transparent bg-clip-text font-extrabold leading-none">
//             Sign up
//           </h5>
//         </div>
//         {[
//           { name: "name", label: "Full Name", type: "text" },
//           { name: "email", label: "Email", type: "email" },
//           { name: "dob", label: "Date of Birth", type: "date" },
//           { name: "password", label: "Password", type: "password" },
//           { name: "confirmPassword", label: "Confirm Password", type: "password" }, // Fixed key
//         ].map(({ name, label, type }) => (
//           <div key={name} className="lg:col-span-6">
//             <Input label={label} placeholder={label} name={name} type={type} onChange={formDataChangeHandler} />
//           </div>
//         ))}
//         <div className={`lg:col-span-12 ${verifyEmail ? "opacity-50" : "opacity-100"}`}>
//           <Button text="Sign Up" type="submit" width="w-full" />
//         </div>
//       </form>
//     </>
//   );
// };

// export default SignupForm;
import { useState } from "react";
import Input from "../small/Input";
import Button from "../small/Button";
import Dropdown from "../small/Dropdown";
// import SignUpModal1 from "../modals/SignUpModal1";

import { useSignUpMutation } from "../../redux/apis/apiSlice";
import { setCredentials, setUser } from "../../redux/slice/authSlice";

import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(true);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const dispatch = useDispatch();
  const [signUp] = useSignUpMutation();
  const navigate = useNavigate();

  const formDataChangeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    setConfirmPasswordError(""); // Clear the error if passwords match

    try {
      const userData = {
        ...formData,
        priority: ["High"],
        num_clients: "3",
        role: "user",
        location: "location",
      };
      const response = await signUp(userData).unwrap();
      console.log("response", response);
      dispatch(setCredentials(response));
      toast.success("SignUp Successful");

      const email = response.user?.email;
      const userType = { role: email === "admin@example.com" ? "admin" : "user" };

      localStorage.setItem("userType", JSON.stringify(userType));
      dispatch(setUser({ email }));

      navigate(userType.role === "admin" ? "/admin" : "/user");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("SignUp Failed");
    }
  };

  return (
    <>
      {isModalOpen && (
        <SignUpModal1
          isModalOpen={isModalOpen}
          selectedCategories={selectedCategories}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-transparent w-full max-w-3xl p-8 shadow-md backdrop-blur-[20px] border-2 border-primary/10 rounded-[20px] mt-6 space-y-6 gap-4"
      >
        <div className="lg:col-span-12 flex justify-center">
          <h5 className="text-xl md:text-[32px]  text-primary font-extrabold leading-none">
            Sign up
          </h5>
        </div>
        {[
          { name: "name", label: "Full Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "dob", label: "Date of Birth", type: "date" },
          { name: "password", label: "Password", type: "password" },
          { name: "confirmPassword", label: "Confirm Password", type: "password" },
        ].map(({ name, label, type }) => (
          <div key={name} className="lg:col-span-12 ">
            <Input label={label} placeholder={label} name={name} type={type} onChange={formDataChangeHandler} />
            {name === "confirmPassword" && confirmPasswordError && (
              <p className="text-red-500 text-sm">{confirmPasswordError}</p>
            )}
          </div>
        ))}
        <div className={`lg:col-span-12 ${verifyEmail ? "opacity-50" : "opacity-100"}`}>
          <Button text="Sign Up" type="submit" width="w-full" />
        </div>
      </form>
    </>
  );
};

export default SignupForm;
