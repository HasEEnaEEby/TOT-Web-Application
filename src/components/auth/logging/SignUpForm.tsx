import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Loader2, Mail, MapPin, Phone, QuoteIcon, User } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';
import { RegisterData, UserRole } from '../../../types/auth';
import RoleSelector from '../RoleSelector';

// Form data interface
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  restaurantName?: string;
  location?: string;
  quote?: string;
  contactNumber?: string;
}

interface SignUpFormProps {
  initialRole?: UserRole;
  onSignUpSuccess?: (userData: FormData & { role: UserRole }) => void;
}

export default function SignUpForm({ 
  initialRole = 'customer', 
  onSignUpSuccess 
}: SignUpFormProps) {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Initial form data
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    location: '',
    quote: '',
    contactNumber: '',
  });

  // Form validation
  const validateForm = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    setError('');

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain uppercase, lowercase, and number');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (selectedRole === 'customer' && !formData.username.trim()) {
      setError('Username is required');
      return false;
    }

    if (selectedRole === 'restaurant') {
      if (!formData.restaurantName?.trim()) {
        setError('Restaurant name is required');
        return false;
      }
      if (!formData.location?.trim()) {
        setError('Location is required');
        return false;
      }
      if (!formData.contactNumber?.trim()) {
        setError('Contact number is required');
        return false;
      }
    }

    return true;
  }, [formData, selectedRole]);


  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Prepare registration data based on role
      const registrationData: RegisterData = {
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        username: formData.username,
        ...(selectedRole === 'restaurant' && {
          restaurantName: formData.restaurantName,
          location: formData.location,
          contactNumber: formData.contactNumber,
          quote: formData.quote
        })
      };
  
      // Attempt registration
      const response = await register(registrationData);
      
      if (response.status === 'success') {
        toast.success('Registration successful! Please check your email for verification.');
        
        onSignUpSuccess?.({ ...formData, role: selectedRole });
  
        navigate('/verify-email-pending', { 
          state: { 
            email: formData.email,
            role: selectedRole 
          },
          replace: true // Replace current history entry
        });
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [validateForm, formData, selectedRole, register, navigate, onSignUpSuccess]);


  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Render input with consistent styling and icon
  const renderInput = (
    icon: React.ElementType, 
    type: string, 
    placeholder: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    additionalProps: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => {
    // Separate HTML input props from additional props
    const {
      required,
      disabled,
      pattern,
      min,
      max,
      minLength,
      maxLength,
      className    } = additionalProps;

    // Define input-specific props
    const inputProps = {
      type,
      placeholder,
      value,
      onChange,
      required,
      disabled,
      pattern,
      min,
      max,
      minLength,
      maxLength,
      className: `block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 
        border border-gray-300 dark:border-gray-600 rounded-md 
        shadow-sm focus:outline-none focus:ring-2 
        focus:ring-red-500 dark:focus:ring-orange-500 
        focus:border-transparent transition-all duration-200 
        ${className || ''}`
    };

    return (
      <div className="relative">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          {...inputProps}
        />
        {React.createElement(icon, {
          className: "h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
        })}
      </div>
    );
  };

  // Dynamic form description
  const formDescription = useMemo(() => {
    return selectedRole === 'customer'
      ? "Join the TOT Family and unlock personalized dining experiences!"
      : "Become a TOT Restaurant Partner and expand your customer reach.";
  }, [selectedRole]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg relative overflow-hidden"
    >
      {/* Form header */}
      <div className="text-center space-y-2 relative">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-red-600 to-orange-600 
            dark:from-red-500 dark:to-orange-500"
        >
          {selectedRole === 'customer' ? "Join TOT" : "TOT Restaurant Partner"}
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-400">{formDescription}</p>
      </div>

      {/* Role selector */}
      <RoleSelector 
        selectedRole={selectedRole} 
        onChange={setSelectedRole}
        disabled={isLoading} 
      />

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {/* Error display */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-md bg-red-50 dark:bg-red-900/30"
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic form fields based on role */}
        {selectedRole === 'customer' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            {renderInput(
              User, 
              "text", 
              "Choose a unique username", 
              formData.username, 
              (e) => setFormData(prev => ({ ...prev, username: e.target.value })),
              { required: true }
            )}
          </div>
        )}

        {selectedRole === 'restaurant' && (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Restaurant Name
              </label>
              {renderInput(
                User, 
                "text", 
                "Enter your restaurant name", 
                formData.restaurantName || '', 
                (e) => setFormData(prev => ({ ...prev, restaurantName: e.target.value })),
                { required: true }
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              {renderInput(
                MapPin, 
                "text", 
                "Restaurant address", 
                formData.location || '', 
                (e) => setFormData(prev => ({ ...prev, location: e.target.value })),
                { required: true }
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Number
              </label>
              {renderInput(
                Phone, 
                "tel", 
                "Business contact number", 
                formData.contactNumber || '', 
                (e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value })),
                { required: true }
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Restaurant Quote (Optional)
              </label>
              {renderInput(
                QuoteIcon, 
                "text", 
                "Your restaurant's motto", 
                formData.quote || '', 
                (e) => setFormData(prev => ({ ...prev, quote: e.target.value }))
              )}
            </div>
          </>
        )}

        {/* Common fields */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          {renderInput(
            Mail, 
            "email", 
            "Enter your email", 
            formData.email, 
            (e) => setFormData(prev => ({ ...prev, email: e.target.value })),
            { required: true }
          )}
        </div>

        {/* Password fields */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              {renderInput(
                User, 
                showPassword ? 'text' : 'password', 
                "Create a strong password", 
                formData.password, 
                (e) => setFormData(prev => ({ ...prev, password: e.target.value })),
                { required: true }
              )}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              {renderInput(
                User, 
                showPassword ? 'text' : 'password', 
                "Repeat your password", 
                formData.confirmPassword, 
                (e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value })),
                { required: true }
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }} 
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-red-600 text-white font-semibold 
            rounded-md hover:bg-red-700 transition-all 
            duration-200 flex items-center justify-center
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </motion.button>

        {/* Sign in link */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <motion.button
              type="button"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              className="font-medium text-red-600 hover:text-red-700 
                dark:text-orange-400 dark:hover:text-orange-500"
            >
              Sign In
            </motion.button>
          </span>
        </div>

        {/* Terms and privacy */}
        <div className="text-xs text-center text-gray-400 dark:text-gray-500 mt-6">
          By creating an account, you agree to our{' '}
          <a 
            href="/terms" 
            className="text-red-500 hover:text-red-600 dark:text-orange-400 dark:hover:text-orange-500"
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a 
            href="/privacy" 
            className="text-red-500 hover:text-red-600 dark:text-orange-400 dark:hover:text-orange-500"
          >
            Privacy Policy
          </a>
        </div>
      </form>
    </motion.div>
  );
}