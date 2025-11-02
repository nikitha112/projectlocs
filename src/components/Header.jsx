import React from 'react';
import { Search, Plus, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onReportClick, darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 dark:bg-gray-800 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Search className="w-8 h-8 text-blue-600 dark:text-yellow-300" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              LostFound Portal
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-yellow-300 font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/browse")}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-yellow-300 font-medium transition-colors"
            >
              Browse Items
            </button>
            <button
              onClick={() => navigate("/how-it-works")}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-yellow-300 font-medium transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-yellow-300 font-medium transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-800" />
              )}
            </button>

            {/* Report Lost/Found Buttons */}
            <button
              onClick={() => onReportClick('lost')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Report Lost</span>
            </button>
            <button
              onClick={() => onReportClick('found')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Report Found</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;