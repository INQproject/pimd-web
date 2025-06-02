import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft } from 'lucide-react';
import { createLoginRedirect } from '@/utils/authRedirect';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
  showBackButton?: boolean;
  backButtonPath?: string;
}

export default function Layout({ 
  children, 
  title, 
  showNavigation = true, 
  showBackButton = false,
  backButtonPath 
}: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackClick = () => {
    if (backButtonPath) {
      navigate(backButtonPath);
    } else {
      navigate(-1);
    }
  };

  // Updated navigation items in the requested order
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/find-parking', label: 'Find Parking' },
    { path: '/events', label: 'Events' },
    { path: '/list-driveway', label: 'List My Driveway' },
    { path: '/areas', label: 'Areas We Serve' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {showNavigation && (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <MapPin className="h-8 w-8 text-[#FF6B00]" />
                  <span className="text-xl font-bold text-[#1C1C1C]">Park In My Driveway</span>
                </Link>
                
                <div className="hidden md:ml-8 md:flex md:space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'text-[#FF6B00] border-b-2 border-[#FF6B00]'
                          : 'text-[#606060] hover:text-[#FF6B00]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-sm text-[#606060] hover:text-[#FF6B00] transition-colors"
                    >
                      Welcome, {user.name}
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to={createLoginRedirect('profile')}>
                    <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                      Login / Sign Up
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Back Button */}
      {showBackButton && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1C1C1C]">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
