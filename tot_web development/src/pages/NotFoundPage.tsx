import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
      <div className="max-w-lg p-6 bg-white border rounded-md shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-6">Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="text-primary text-lg hover:underline">Go back to Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
