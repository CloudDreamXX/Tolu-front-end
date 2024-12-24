import Button from "../../components/small/Button";
import logo from "../../assets/images/logo.png";
import SignupForm from "../../components/forms/SignupForm";

const Signup = () => {
  return (
    <section className="w-full bg-white py-5 md:py-[44px] min-h-screen bg-[url('src/assets/images/auth/layout-bg.png')] bg-no-repeat bg-left-top bg-contain">
      <section className="container mx-auto flex flex-col justify-between gap-20 sm:gap-8 h-full">
        <div className="flex justify-end">
          <div className="flex items-center gap-4 w-full sm:w-auto px-4">
            <Button text="Login" bg="bg-white text-primary" />
            <Button text="Sign Up" />
          </div>
        </div>
        <div className="mx-auto w-full lg:w-[1200px]">
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="w-[130px]" />
          </div>
          <SignupForm />
        </div>
        <div className="flex flex-col items-center justify-center gap-1 pb-3">
          <p className="text-sm text-textColor/30">Already have an Account?</p>
          <button className="text-primary text-sm">Log In</button>
        </div>
      </section>
    </section>
  );
};

export default Signup;
