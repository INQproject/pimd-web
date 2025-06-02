
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
}

export default function Layout({ children, title, showNavigation = true }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Unified navigation items for all users
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/find-parking', label: 'Find Parking' },
    { path: '/events', label: 'Events' },
    { path: '/list-driveway', label: 'List My Driveway' },
    { path: '/areas', label: 'Areas We Serve' },
    { path: '/about', label: 'About Us' },
  ];

  return (
    <div className="min-h-screen bg-light-bg">
      {showNavigation && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <MapPin className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-text-primary">Park In My Driveway</span>
                </Link>
                
                <div className="hidden md:ml-8 md:flex md:space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-text-secondary hover:text-primary'
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
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      Welcome, {user.name}
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">
                      Login / Register
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
