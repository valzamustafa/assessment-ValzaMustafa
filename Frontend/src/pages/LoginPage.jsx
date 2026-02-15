import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({ email, password });
      
      console.log('Login response full:', response);
      
      if (response && response.accessToken) {
        toast.success('Login successful! 🎉');
      
        const userRole = response.role;
        console.log('User role:', userRole);
        
        if (userRole === 'Admin') {  
          console.log('Redirecting to admin page');
          navigate('/admin');
        } else {
          console.log('Redirecting to dashboard');
          navigate('/dashboard');
        }
      } else {
        toast.error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Invalid email or password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            VideoAnnotation
          </h1>
          <p className="text-gray-500 mt-2">Welcome back! Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={EnvelopeIcon}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={LockClosedIcon}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
              icon={ArrowRightIcon}
            >
              Sign In
            </Button>

            <button
              type="button"
              onClick={fillTestCredentials}
              className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Use test credentials
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">New here?</span>
            </div>
          </div>

          <Link to="/register">
            <Button variant="outline" size="lg" fullWidth>
              Create new account
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2024 VideoAnnotation. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;