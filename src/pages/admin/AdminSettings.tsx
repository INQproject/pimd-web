
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Settings, User, Shield, Moon, Clock } from 'lucide-react';

const AdminSettings = () => {
  const [credentials, setCredentials] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: false,
    sessionTimeout: 30,
    emailNotifications: true,
    autoLogout: true
  });

  const handleCredentialChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: boolean | number) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordUpdate = () => {
    if (credentials.newPassword !== credentials.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (credentials.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Admin password updated successfully.",
    });

    setCredentials({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePreferencesUpdate = () => {
    toast({
      title: "Success",
      description: "Preferences updated successfully.",
    });
  };

  return (
    <AdminLayout title="Admin Settings">
      <div className="space-y-6 max-w-4xl">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Admin Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="admin-name">Admin Name</Label>
                <Input id="admin-name" defaultValue="Super Admin" />
              </div>
              <div>
                <Label htmlFor="admin-email">Email Address</Label>
                <Input id="admin-email" defaultValue="admin@pimd.com" />
              </div>
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password"
                  value={credentials.currentPassword}
                  onChange={(e) => handleCredentialChange('currentPassword', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={credentials.newPassword}
                  onChange={(e) => handleCredentialChange('newPassword', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={credentials.confirmPassword}
                  onChange={(e) => handleCredentialChange('confirmPassword', e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handlePasswordUpdate}>Update Password</Button>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>System Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-600">Enable dark theme for the admin panel</p>
                </div>
              </div>
              <Switch 
                checked={preferences.darkMode}
                onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Auto Logout</p>
                  <p className="text-sm text-gray-600">Automatically logout after inactivity</p>
                </div>
              </div>
              <Switch 
                checked={preferences.autoLogout}
                onCheckedChange={(checked) => handlePreferenceChange('autoLogout', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input 
                id="session-timeout"
                type="number"
                min="5"
                max="120"
                value={preferences.sessionTimeout}
                onChange={(e) => handlePreferenceChange('sessionTimeout', parseInt(e.target.value))}
                className="w-32"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email alerts for important events</p>
              </div>
              <Switch 
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
              />
            </div>

            <Button onClick={handlePreferencesUpdate}>Save Preferences</Button>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Admin Panel Version:</span> v2.1.0
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> 2024-01-20
              </div>
              <div>
                <span className="font-medium">Total Users:</span> 1,495
              </div>
              <div>
                <span className="font-medium">System Status:</span> 
                <span className="text-green-600 ml-1">Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
