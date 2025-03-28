export const getUserType = (email) => {
  if (email === 'admin@example.com') {
    return { role: 'admin' };
  } else if (email === 'test@example.com') {
    return { role: 'coaches' };
  } else {
    return { role: 'user' };
  }
};

export const navigateByUserType = (navigate, role) => {
  switch (role) {
    case 'admin':
      navigate('/admin');
      break;
    case 'coaches':
      navigate('/coaches');
      break;
    default:
      navigate('/user');
      break;
  }
};

export const signupFormFields = [
  { name: 'name', label: 'Full Name', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'dob', label: 'Date of Birth', type: 'date' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
];
