import { useState } from "react";
import Input from "../small/Input";
import Button from "../small/Button";
import Dropdown from "../small/Dropdown";
import SingUpModal1 from "../modals/SingUpModal1";
import SignUpModal2 from "../modals/SignUpModal2";
import { useLoginMutation, useSignUpMutation } from "../../redux/apis/apiSlice";
import { setCredentials } from "../../redux/slice/authSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const SignupForm = () => {
  const [formData, setFormData] = useState({});
  const [verifyEmail, setVerifyEmail] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  // const [personalExp, setPersonalExp] = useState(false);
  const formDataChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  console.log("user", user ,"token",token);
  const dispatch = useDispatch();
  // const [login] = useLoginMutation();
  const [signUp] = useSignUpMutation();
  const [login] = useLoginMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // const userData = { email, password };
      const userData = {
        email: "ttttbttett@example.com",
        password: "Admin@12345",
        name: "John Doee",
        dob: "1990-01-01",
        role: "Practitioner Account",
        type: "Psychologist",
        location: "New York",
        num_clients: "10",
        priority: ["High"]
      }
      const response = await login(userData).unwrap()
      console.log("response", response);

      dispatch(setCredentials(response)); // Store user & token in Redux
      toast.success("SignUp Successful");

      // alert(` Successful!`);
    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error("SignUp Failed");
    }


    console.log("form", formData);
    // setIsModalOpen(true);
    // alert("Form submitted successfully");
  };


  const categories = [
    "Menopause",
    "Perimenopause",
    "Depression",
    "Weight Loss",
    "Women’s Health",
    "Hormone Replacement Therpay",
    "Bone Health",
    "Brainfog Management",
    "Natural Remedies",
    "Autoimmune Diseases",
    "Sleep Management",
    "Kindney Stone",
    "Digestive Health",
    "Managing Anxiety Naturally",
    "IBS",
    "Reproductive Health",
    "Boosting Immune System",
    "Nutrition & Lifestyle",
    "Managing Cravings",
    "Managing  Inflammations",
    "Others",
  ];



  // Handle category selection
  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
    } else {
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setIsModalOpen(false);
    setPersonalExp(false);
  };

  // Handle Next button
  const handleNext = () => {

    alert(`Selected categories: ${selectedCategories.join(", ")}`);
    // setIsModalOpen2(true);  
    handleClose()
  };

  return (
    <>
      {isModalOpen && <SingUpModal1
        isModalOpen={isModalOpen}
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryClick={handleCategoryClick}
        onClose={handleClose}
        onNext={handleNext}
      />}

      {/* {isModalOpen2&& <SignUpModal2
      isOpen={isModalOpen2}
      onClose={() => setIsModalOpen(false)}
      />} */}
      <form
        onSubmit={handleSubmit}
        className="bg-transparent shadow-md backdrop-blur-[20px] py-5 px-5 sm:py-[25px] lg:py-[30px] sm:px-[35px] border-2 border-primary/10 rounded-[20px] mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 "
      >
        <div className="lg:col-span-12 flex justify-center">
          <h5 className="text-xl md:text-[32px] bg-gradientText text-transparent bg-clip-text font-extrabold leading-none">
            Sign up
          </h5>
        </div>
        <div className="lg:col-span-6">
          <Input
            label="Full name"
            placeholder="Full Name"
            name="fullName"
            onChange={formDataChangeHandler}
          />
        </div>
        <div className="lg:col-span-6">
          <Input
            label="Last name"
            placeholder="Last Name"
            name="lastName"
            onChange={formDataChangeHandler}
          />
        </div>
        <div className="lg:col-span-6">
          <Input
            label="Nick name"
            placeholder="Nick Name"
            name="nickName"
            onChange={formDataChangeHandler}
          />
        </div>
        <div className="lg:col-span-6">
          <Dropdown
            defaultText="Select"
            label="Gender"
            options={[
              { option: "Male", value: "male" },
              { option: "Female", value: "female" },
            ]}
          />
        </div>

        <div className="lg:col-span-6">
          <Input
            label="Phone number"
            placeholder="number"
            type="tel"
            name="phoneNumber"
            onChange={formDataChangeHandler}
          />
        </div>

        <div className="lg:col-span-6">
          <Input
            label="Nationality"
            placeholder="nationality"
            name="nationality"
            onChange={formDataChangeHandler}
          />
        </div>
        <div className="lg:col-span-10">
          <Input
            label="Email address"
            placeholder="mail@gmail.com"
            name="email"
            onChange={formDataChangeHandler}
          />
        </div>
        <div className="lg:col-span-2 flex items-end">
          <Button
            text="Verify email"
            width="w-full"
            type="button" // Add this line to prevent form submission
            onClick={(event) => {
              event.stopPropagation(); // Stop event propagation
              setVerifyEmail(false); // Update the verifyEmail state
            }}
          />
        </div>
        {/* <div className="lg:col-span-6">
        <Input
          label="Date"
          placeholder="Date of birth"
          name="date"
          type="date"
          onChange={formDataChangeHandler}
        />
      </div> */}
        <div
          className={`lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 ${verifyEmail ? "opacity-50" : "opacity-100"
            }`}
        >
          <div className="lg:col-span-12">
            <Input
              label="Enter OTP code"
              placeholder="code"
              name="otp-code"
              type="number"
              onChange={formDataChangeHandler}
              disabled={verifyEmail}
            />
          </div>
          <div className="lg:col-span-12">
            <Button text="Sign up" type="submit" width="w-full" disabled={verifyEmail} />
          </div>
        </div>
      </form>
    </>

  );
};

export default SignupForm;
