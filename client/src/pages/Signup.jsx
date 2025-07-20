import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    age: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touchedFields, setTouchedFields] = useState({
    fullName: false,
    username: false,
    email: false,
    password: false,
    age: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await API.post('/auth/signup', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Very Weak';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Moderate';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join our community
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account in just a few simple steps
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl sm:px-10 transition-all duration-300 hover:shadow-xl">
          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-4 animate-fade-in">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="ml-3 text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`peer h-10 w-full border-b-2 ${touchedFields.fullName && !formData.fullName ? 'border-red-500' : 'border-gray-300'} focus:border-blue-600 text-gray-900 placeholder-transparent focus:outline-none bg-transparent`}
                placeholder=" "
              />
              <label
                htmlFor="fullName"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Full Name
              </label>
              {touchedFields.fullName && !formData.fullName && (
                <p className="mt-1 text-xs text-red-600">Full name is required</p>
              )}
            </div>

            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`peer h-10 w-full border-b-2 ${touchedFields.username && !formData.username ? 'border-red-500' : 'border-gray-300'} focus:border-blue-600 text-gray-900 placeholder-transparent focus:outline-none bg-transparent`}
                placeholder=" "
              />
              <label
                htmlFor="username"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Username
              </label>
              {touchedFields.username && !formData.username && (
                <p className="mt-1 text-xs text-red-600">Username is required</p>
              )}
            </div>

            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`peer h-10 w-full border-b-2 ${touchedFields.email && !formData.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-600 text-gray-900 placeholder-transparent focus:outline-none bg-transparent`}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Email address
              </label>
              {touchedFields.email && !formData.email && (
                <p className="mt-1 text-xs text-red-600">Email is required</p>
              )}
              {formData.email && !/^\S+@\S+\.\S+$/.test(formData.email) && (
                <p className="mt-1 text-xs text-red-600">Please enter a valid email</p>
              )}
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength="6"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`peer h-10 w-full border-b-2 ${touchedFields.password && !formData.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-600 text-gray-900 placeholder-transparent focus:outline-none bg-transparent`}
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Password
              </label>
              {touchedFields.password && !formData.password && (
                <p className="mt-1 text-xs text-red-600">Password is required</p>
              )}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Password strength:</span>
                    <span className={`font-medium ${getPasswordStrengthColor().replace('bg-', 'text-')}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div
                      className={`h-1.5 rounded-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                id="age"
                name="age"
                type="number"
                min="13"
                max="120"
                required
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`peer h-10 w-full border-b-2 ${touchedFields.age && !formData.age ? 'border-red-500' : 'border-gray-300'} focus:border-blue-600 text-gray-900 placeholder-transparent focus:outline-none bg-transparent`}
                placeholder=" "
              />
              <label
                htmlFor="age"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Age
              </label>
              {touchedFields.age && !formData.age && (
                <p className="mt-1 text-xs text-red-600">Age is required</p>
              )}
              {formData.age && (formData.age < 13 || formData.age > 120) && (
                <p className="mt-1 text-xs text-red-600">Age must be between 13 and 120</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Sign up
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <svg className="-ml-1 mr-2 h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Login to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;