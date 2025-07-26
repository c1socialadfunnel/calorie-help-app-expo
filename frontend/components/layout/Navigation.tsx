import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User, Camera } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/ai-coach', icon: MessageCircle, label: 'AI Coach' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
        <Link
          to="/ai-food-logger"
          className="flex flex-col items-center py-2 px-3 rounded-lg bg-blue-600 text-white"
        >
          <Camera className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Log Food</span>
        </Link>
      </div>
    </nav>
  );
}
