import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChefHat, User } from 'lucide-react';
import { EmailInput } from '../auth/EmailInput';
import { PasswordInput } from '../auth/PasswordInput';
import { AuthButton } from '../auth/AuthButton';
import { Input } from '../common/InputField';

export const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://player.vimeo.com/external/492994419.sd.mp4?s=991f8ca7a53a4a4c3836b82a4cc5d3ccd2c7b6f3&profile_id=164&oauth2_token_id=57447761"
          type="video/mp4"
        />
      </video>

      {/* Overlay with pattern */}
      <div 
        className="absolute inset-0 bg-black/50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl p-8"
          >
            <div className="flex flex-col items-center mb-8">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-full mb-4 shadow-lg"
              >
                <ChefHat className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Join TOT today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Input
                  label="Full Name"
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="pl-10"
                />
                <User className="absolute left-3 top-[38px] text-gray-400" size={20} />
              </div>

              <EmailInput
                label="Email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />

              <PasswordInput
                label="Password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />

              <AuthButton type="submit" isLoading={isLoading}>
                Create Account
              </AuthButton>
            </form>

            <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-orange-500 hover:text-orange-600 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};