// import Button from "../../components/small/Button";
// // import logo from "../../assets/images/logo.png";
// import SignupForm from "../../components/forms/SignupForm";
// import LoginForm from "../../components/forms/LoginForm";

// const Signup = () => {
//   return (
//     <section className="w-full bg-white py-5 md:py-[30px] min-h-screen lg:h-screen  bg-[url('src/assets/images/auth/layout-bg.png')] bg-no-repeat bg-left-top bg-contain">
//       <section className="container mx-auto flex flex-col gap-20 sm:gap-10 h-full">
//         <div className="flex justify-end ">
//           <div className="flex items-center gap-4 w-full sm:w-auto ">
//             <Button text="Login" bg="bg-white text-primary" />
//             <Button text="Sign Up" />
//           </div>
//         </div>
//         <div className="mx-auto w-full lg:w-[1100px]">
//           <div className="flex justify-center">
//             {/* <img src={logo} alt="logo" className="w-[130px]" /> */}
//           </div>
//           <SignupForm />
//           <LoginForm/>
//         </div>
//         <div className="flex flex-col items-center justify-center gap-1 pb-3">
//           <p className="text-sm text-textColor/30">Already have an Account?</p>
//           <button className="text-primary text-sm">Log In</button>
//         </div>
//       </section>
//     </section>
//   );
// };

// export default Signup;

import { useState } from "react";
import Button from "../../components/small/Button";
// import logo from "../../assets/images/logo.png";
import SignupForm from "../../components/forms/SignupForm";
import LoginForm from "../../components/forms/LoginForm";

const Signup = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <section className="w-full bg-white py-5 md:py-[30px] min-h-screen lg:h-screen bg-[url('src/assets/images/auth/layout-bg.png')] bg-no-repeat bg-left-top bg-contain">
      <section className="container mx-auto flex flex-col gap-20 sm:gap-10 h-full">
        <div className="flex justify-end">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              text="Login"
              bg={`bg-white ${showLogin ? "text-primary" : "text-gray-500"}`}
              onClick={() => setShowLogin(true)}
            />
            <Button
              text="Sign Up"
              bg={`bg-white ${!showLogin ? "text-primary" : "text-gray-500"}`}
              onClick={() => setShowLogin(false)}
            />
          </div>
        </div>
        <div className="mx-auto w-full lg:w-[1100px]">
          <div className="flex justify-center">
            {/* <img src={logo} alt="logo" className="w-[130px]" /> */}
          </div>
          {showLogin ? <LoginForm /> : <SignupForm />}
        </div>
        <div className="flex flex-col items-center justify-center gap-1 pb-3">
          <p className="text-sm text-textColor/30">
            {showLogin ? "Don't have an account?" : "Already have an Account?"}
          </p>
          <button
            className="text-primary text-sm"
            onClick={() => setShowLogin((prev) => !prev)}
          >
            {showLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </section>
    </section>
  );
};

export default Signup;
