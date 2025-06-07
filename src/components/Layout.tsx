
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, Menu, X, User, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
  showBackButton?: boolean;
}

const Layout = ({ children, title, showNavigation = true, showBackButton = false }: LayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {showNavigation && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-[#FF6B00]" />
                <span className="font-bold text-xl text-[#1C1C1C]">Park In My Driveway</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link 
                  to="/find-parking" 
                  className={`hover:text-[#FF6B00] transition-colors ${
                    isActiveRoute('/find-parking') ? 'text-[#FF6B00] font-medium' : 'text-[#606060]'
                  }`}
                >
                  Find Parking
                </Link>
                <Link 
                  to="/events" 
                  className={`hover:text-[#FF6B00] transition-colors ${
                    isActiveRoute('/events') ? 'text-[#FF6B00] font-medium' : 'text-[#606060]'
                  }`}
                >
                  Events
                </Link>
                <Link 
                  to="/list-driveway" 
                  className={`hover:text-[#FF6B00] transition-colors ${
                    isActiveRoute('/list-driveway') ? 'text-[#FF6B00] font-medium' : 'text-[#606060]'
                  }`}
                >
                  List My Driveway
                </Link>
                <Link 
                  to="/areas" 
                  className={`hover:text-[#FF6B00] transition-colors ${
                    isActiveRoute('/areas') ? 'text-[#FF6B00] font-medium' : 'text-[#606060]'
                  }`}
                >
                  Areas We Serve
                </Link>
                
                {/* Profile Button - Updated label */}
                <Button 
                  onClick={handleProfileClick}
                  variant="outline"
                  className="flex items-center space-x-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
                >
                  <User className="h-4 w-4" />
                  <span>PROFILE</span>
                </Button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t bg-white">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <button
                    onClick={() => handleNavClick('/find-parking')}
                    className={`block px-3 py-2 text-base font-medium w-full text-left ${
                      isActiveRoute('/find-parking') ? 'text-[#FF6B00]' : 'text-[#606060] hover:text-[#FF6B00]'
                    }`}
                  >
                    Find Parking
                  </button>
                  <button
                    onClick={() => handleNavClick('/events')}
                    className={`block px-3 py-2 text-base font-medium w-full text-left ${
                      isActiveRoute('/events') ? 'text-[#FF6B00]' : 'text-[#606060] hover:text-[#FF6B00]'
                    }`}
                  >
                    Events
                  </button>
                  <button
                    onClick={() => handleNavClick('/list-driveway')}
                    className={`block px-3 py-2 text-base font-medium w-full text-left ${
                      isActiveRoute('/list-driveway') ? 'text-[#FF6B00]' : 'text-[#606060] hover:text-[#FF6B00]'
                    }`}
                  >
                    List My Driveway
                  </button>
                  <button
                    onClick={() => handleNavClick('/areas')}
                    className={`block px-3 py-2 text-base font-medium w-full text-left ${
                      isActiveRoute('/areas') ? 'text-[#FF6B00]' : 'text-[#606060] hover:text-[#FF6B00]'
                    }`}
                  >
                    Areas We Serve
                  </button>
                  <button
                    onClick={handleProfileClick}
                    className="block px-3 py-2 text-base font-medium text-[#FF6B00] w-full text-left"
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    PROFILE
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Back Button */}
      {showBackButton && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="flex items-center space-x-2 text-[#FF6B00] hover:bg-[#FF6B00]/10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>
      )}

      {/* Main Content */}
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
};

export default Layout;
