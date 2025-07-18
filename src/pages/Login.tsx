
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const returnTo = location.state?.returnTo || '/profile';
  const context = location.state?.context || 'general';

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    
    // Simulate Google auth delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Google login success
    login({
      id: '2',
      name: 'Google User',
      email: 'google.user@gmail.com',
      role: 'user'
    });

    toast({
      title: "Welcome!",
      description: "You have been successfully logged in with Google.",
    });

    navigate(returnTo);
    setIsGoogleLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check hardcoded credentials
    if (loginData.email === 'user@parkdriveway.com' && loginData.password === 'test123') {
      login({
        id: '1',
        name: 'Test User',
        email: loginData.email,
        role: 'user'
      });

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });

      navigate(returnTo);
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const getContextMessage = () => {
    switch (context) {
      case 'booking':
        return "You'll be returned to your booking after logging in";
      case 'listing':
        return "You'll be returned to listing your driveway after logging in";
      default:
        return "Login to access your profile and bookings";
    }
  };

  return (
    <Layout showBackButton={true}>
      <div className="max-w-md mx-auto">
        {/* Hero Section */}
        <div 
          className="relative h-48 bg-cover bg-center rounded-2xl mb-8 overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-sm">{getContextMessage()}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Use: user@parkdriveway.com / test123
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Login Button */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              variant="outline"
              className="w-full mb-4 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            {/* Divider */}
            <div className="relative mb-4">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-3 text-sm text-gray-500">Or sign in with email</span>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@parkdriveway.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="test123"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
                <div className="text-right">
                  <Link to="#" className="text-sm text-[#FF6B00] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#FF6B00] hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
