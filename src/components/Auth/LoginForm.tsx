import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Stethoscope, LogIn, UserPlus } from 'lucide-react';
import useFirebaseAuth from '../../firebase/useFirebaseAuth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const { signInWithGoogle, loading: googleLoading } = useFirebaseAuth();

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      // Default role is patient; can be extended to allow user selection
      await signInWithGoogle('patient');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 transition-all duration-300 transform hover:scale-[1.01]">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full shadow-lg transform transition-all duration-300 hover:rotate-12">
              <Stethoscope className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-4 text-4xl font-extrabold text-gray-900 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Welcome to MedConsult
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-medium">
            Your health is our priority. Sign in to continue.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                'border-blue-500 text-blue-600' 
              }`}
            >
              <span className="flex items-center justify-center">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </span>
            </button>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-all duration-300 ${
                'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center justify-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </span>
            </button>
          </div>

          <div className="px-8 py-6">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {googleLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" width="24" height="24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.229 -9.42426 56.479 -10.7843 57.329 L -10.7843 60.609 L -6.82426 60.609 C -4.56426 58.649 -3.264 55.359 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.80426 62.159 -6.82426 60.609 L -10.7843 57.329 C -11.7643 58.049 -13.074 58.489 -14.754 58.489 C -17.884 58.489 -20.5343 56.379 -21.4143 53.529 L -25.4643 53.529 L -25.4643 56.959 C -23.4943 60.869 -19.4443 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.4143 53.529 C -21.7343 52.549 -21.9043 51.509 -21.9043 50.439 C -21.9043 49.369 -21.7243 48.329 -21.4143 47.349 L -21.4143 43.919 L -25.4643 43.919 C -26.5243 46.079 -27.0843 48.459 -27.0843 50.439 C -27.0843 52.419 -26.5243 54.799 -25.4643 56.959 L -21.4143 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 42.389 C -12.4443 42.389 -10.3943 43.249 -8.78426 44.689 L -6.70426 42.599 C -8.93426 40.589 -11.6743 39.489 -14.754 39.489 C -19.4443 39.489 -23.4943 41.859 -25.4643 45.759 L -21.4143 49.199 C -20.5243 46.339 -17.884 44.239 -14.754 44.239 C -13.074 44.239 -11.7643 44.689 -10.7843 45.409 L -6.82426 42.129 C -8.80426 40.589 -11.514 39.499 -14.754 39.499 L -14.754 42.389 Z"/>
                  </g>
                </svg>
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with email</span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm">
                  <div className="flex">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium">Error</p>
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-3 border-gray-300 rounded-lg transition duration-150 ease-in-out"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-3 border-gray-300 rounded-lg transition duration-150 ease-in-out"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:underline"
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};