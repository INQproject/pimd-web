
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchRole = () => {
    if (user?.role === 'seeker') {
      switchRole('host');
      navigate('/dashboard-host');
    } else if (user?.role === 'host') {
      switchRole('seeker');
      navigate('/dashboard-seeker');
    }
  };

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'seeker':
        return [
          { path: '/dashboard-seeker', label: 'Dashboard' },
          { path: '/events', label: 'Events' },
          { path: '/explore', label: 'Explore' },
          { path: '/bookings', label: 'My Bookings' },
        ];
      case 'host':
        return [
          { path: '/dashboard-host', label: 'Dashboard' },
          { path: '/add-parking', label: 'Add Parking' },
          { path: '/calendar', label: 'Availability' },
          { path: '/host-bookings', label: 'Booking History' },
          { path: '/transactions', label: 'Transactions' },
        ];
      case 'admin':
        return [
          { path: '/admin-dashboard', label: 'Dashboard' },
          { path: '/admin-parking', label: 'Manage Listings' },
          { path: '/admin-users', label: 'Users' },
          { path: '/admin-transactions', label: 'Transactions' },
          { path: '/admin-reports', label: 'Reports' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-light-bg">
      {user && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <MapPin className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-text-primary">ParkDriveway</span>
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
                <span className="text-sm text-text-secondary">
                  Welcome, {user.name}
                </span>
                
                {user.role !== 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSwitchRole}
                    className="hidden md:inline-flex"
                  >
                    Switch to {user.role === 'seeker' ? 'Host' : 'Seeker'}
                  </Button>
                )}
                
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
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
