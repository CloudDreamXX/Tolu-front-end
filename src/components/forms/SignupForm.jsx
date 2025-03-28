/* eslint-disable no-unused-vars */
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../app/services/auth.service';
import { setCredentials, setUser } from '../../app/store/slice/authSlice';
import { getUserType, navigateByUserType, signupFormFields } from './utils';
import Button from '../small/Button';
import Input from '../small/Input';
import SingUpModal1 from '../../components/modals/SingUpModal1';

const SignupForm = () => {
  const [formData, setFormData] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(true);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formDataChangeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    setConfirmPasswordError('');

    try {
      const userData = {
        ...formData,
        priority: ['High'],
        num_clients: '3',
        role: 'user',
        location: 'location',
      };

      const response = await authService.signUp(userData);
      dispatch(setCredentials(response));

      const email = response.user?.email;
      const userType = getUserType(email);

      dispatch(setUser({ email }));
      localStorage.setItem('userType', JSON.stringify(userType));
      toast.success('SignUp Successful');
      navigateByUserType(navigate, userType.role);
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error(error || 'SignUp Failed');
    }
  };

  return (
    <>
      {isModalOpen && (
        <SingUpModal1
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
          <h5 className="text-xl md:text-[32px] text-primary font-extrabold leading-none">
            Sign up
          </h5>
        </div>
        {signupFormFields.map(({ name, label, type }) => (
          <div key={name} className="lg:col-span-12">
            <Input
              label={label}
              placeholder={label}
              name={name}
              type={type}
              onChange={formDataChangeHandler}
            />
            {name === 'confirmPassword' && confirmPasswordError && (
              <p className="text-red-500 text-sm">{confirmPasswordError}</p>
            )}
          </div>
        ))}
        <div
          className={`lg:col-span-12 ${verifyEmail ? 'opacity-50' : 'opacity-100'}`}
        >
          <Button text="Sign Up" type="submit" width="w-full" />
        </div>
      </form>
    </>
  );
};

export default SignupForm;
