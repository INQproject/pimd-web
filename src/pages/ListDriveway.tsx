
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const ListDriveway = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    spotName: '',
    address: '',
    description: '',
    totalSpots: '',
    hourlyRate: '',
    dailyRate: '',
    weeklyRate: ''
  });

  const handleLoginToStart = () => {
    navigate('/login', { state: { returnTo: '/list-driveway', context: 'listing' } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Submitted",
      description: "Awaiting Admin Approval",
    });

    // Reset form
    setFormData({
      spotName: '',
      address: '',
      description: '',
      totalSpots: '',
      hourlyRate: '',
      dailyRate: '',
      weeklyRate: ''
    });

    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <Layout title="List My Driveway">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Please Login First</h2>
              <p className="text-[#606060] mb-6">
                You need to be logged in to list your parking space.
              </p>
              <Button 
                onClick={handleLoginToStart}
                className="bg-[#FF6B00] hover:bg-[#FF6B00]/90"
              >
                Login to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="List Your Parking Space">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add Your Parking Space</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="spotName">Spot Name</Label>
                <Input
                  id="spotName"
                  placeholder="e.g., Downtown Driveway"
                  value={formData.spotName}
                  onChange={(e) => handleInputChange('spotName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Full address of parking spot"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your parking space..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSpots">Total Spots</Label>
                <Input
                  id="totalSpots"
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.totalSpots}
                  onChange={(e) => handleInputChange('totalSpots', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="15"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    placeholder="50"
                    value={formData.dailyRate}
                    onChange={(e) => handleInputChange('dailyRate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyRate">Weekly Rate ($)</Label>
                  <Input
                    id="weeklyRate"
                    type="number"
                    placeholder="300"
                    value={formData.weeklyRate}
                    onChange={(e) => handleInputChange('weeklyRate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Images</Label>
                <Input type="file" accept="image/*" multiple />
                <p className="text-sm text-gray-500">Select up to 3 images of your parking space</p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ListDriveway;
