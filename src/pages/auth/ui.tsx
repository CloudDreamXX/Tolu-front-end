import { useState } from "react";
import { LoginForm, SignupForm } from "widgets/auth-forms";

export const Auth: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <section className="w-full h-screen py-0">
      {showLogin ? <SignupForm /> : <LoginForm setShowLogin={setShowLogin}/>}
    </section>
  );
};
