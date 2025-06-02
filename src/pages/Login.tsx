
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleChoice, setShowRoleChoice] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // Check if it's admin login
        if (email === 'admin@parkdriveway.com') {
          navigate('/admin-dashboard');
        } else {
          setShowRoleChoice(true);
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChoice = (role: 'seeker' | 'host') => {
    if (role === 'seeker') {
      navigate('/dashboard-seeker');
    } else {
      navigate('/dashboard-host');
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location permission granted');
          // Location granted, continue with role choice
        },
        (error) => {
          console.log('Location permission denied');
          // Continue anyway
        }
      );
    }
  };

  if (showRoleChoice) {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md card-shadow animate-scale-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <MapPin className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">What would you like to do?</CardTitle>
            <CardDescription>Choose your role to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => {
                requestLocationPermission();
                handleRoleChoice('seeker');
              }}
              className="w-full btn-primary py-6 text-lg"
            >
              Find a Spot to Park
            </Button>
            <Button 
              onClick={() => {
                requestLocationPermission();
                handleRoleChoice('host');
              }}
              className="w-full btn-secondary py-6 text-lg"
            >
              List My Driveway
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <MapPin className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-text-primary">ParkDriveway</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
          <p className="text-text-secondary">Sign in to your account</p>
        </div>

        <Card className="card-shadow animate-fade-in">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login"}
              </Button>

              <div className="flex flex-col space-y-2">
                <Button type="button" variant="outline" className="w-full">
                  Register
                </Button>
                <Button type="button" variant="link" className="text-sm">
                  Forgot Password?
                </Button>
              </div>
            </form>

            {/* Sample Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Sample Credentials:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Seeker:</strong> seeker@example.com / seeker123</p>
                <p><strong>Host:</strong> host@example.com / host123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
