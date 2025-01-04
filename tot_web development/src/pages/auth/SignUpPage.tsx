import { useState } from 'react';
import LoginForm from '../../components/auth/logging/LoginForm';
import SignUpForm from '../../components/auth/logging/SignUpForm';
import {ThemeToggle} from '../../components/common/ThemeToggle';
import SocialLoginButtons from '../../components/common/WelcomeMessage';
import '../../styles/animations.css';

const SignUpPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'guest'>('signup');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200`}
    >
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex space-x-1">
              {(['login', 'signup', 'guest'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 hover-scale ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md">
            {activeTab === 'login' && (
              <>
                <LoginForm />
                <div className="mt-6">
                  <SocialLoginButtons />
                </div>
              </>
            )}
            {activeTab === 'signup' && <SignUpForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
