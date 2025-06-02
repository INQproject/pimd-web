
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const returnTo = location.state?.returnTo || '/profile';
  const context = location.state?.context || 'general';

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
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
