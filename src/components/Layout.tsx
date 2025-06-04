
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, ArrowLeft, Menu, X, User, Calendar, Upload, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/find-parking', label: 'Find Parking' },
    { path: '/events', label: 'Events' },
    { path: '/list-driveway', label: 'List My Driveway' },
    { path: '/areas', label: 'Areas We Serve' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {showNavigation && (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <MapPin className="h-8 w-8 text-[#FF6B00]" />
                  <span className="text-xl font-bold text-[#1C1C1C]">Park In My Driveway</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-8">
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

              {/* Right Side - Profile/Login */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.email} alt={user.name} />
                          <AvatarFallback className="bg-[#FF6B00] text-white">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile?tab=bookings" className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>My Bookings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile?tab=uploads" className="flex items-center">
                          <Upload className="mr-2 h-4 w-4" />
                          <span>My Uploads</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/login">
                    <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                      Login / Sign Up
                    </Button>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMobileMenuToggle}
                    className="h-10 w-10 p-0"
                  >
                    {mobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden border-t bg-white">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`block px-3 py-2 text-base font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'text-[#FF6B00] bg-[#FF6B00]/10'
                          : 'text-[#606060] hover:text-[#FF6B00] hover:bg-[#FF6B00]/5'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
