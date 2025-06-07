
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle, Phone, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ListDriveway = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    spotName: '',
    address: '',
    description: '',
    totalSpots: '',
    hourlyRate: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: ''
  });

  const handleLoginToStart = () => {
    navigate('/login', { state: { returnTo: '/list-driveway', context: 'listing' } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Auto-approve listing and generate listing ID
    const listingId = Math.random().toString(36).substr(2, 9);
    
    toast({
      title: "Listing Auto-Approved!",
      description: "Your parking spot is now live and ready for bookings.",
    });

    // Redirect to manage availability page
    navigate(`/manage-availability/${listingId}`);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const features = ['24/7', 'CCTV', 'WELL-LIT'];

  if (!user) {
    return (
      <Layout title="List My Driveway">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Support Message */}
          <Alert className="bg-blue-50 border-blue-200">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="font-medium mb-2">If you're facing any issues while listing your driveway or booking a parking spot, please contact our support team.</div>
              <div className="flex flex-col sm:flex-row gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>Phone: (123) 456-7890</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>Email: support@parkinmydriveway.com</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="p-8 text-center">
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Support Message */}
        <Alert className="bg-blue-50 border-blue-200">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="font-medium mb-2">If you're facing any issues while listing your driveway or booking a parking spot, please contact our support team.</div>
            <div className="flex flex-col sm:flex-row gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>Phone: (123) 456-7890</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>Email: support@parkinmydriveway.com</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>

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

              {/* Set Your Rates Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Set Your Rates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRate">Monthly Rate ($)</Label>
                    <Input
                      id="monthlyRate"
                      type="number"
                      placeholder="1200"
                      value={formData.monthlyRate}
                      onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Features Selection Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Tap to Select FEATURES</h3>
                <div className="flex flex-wrap gap-3">
                  {features.map((feature) => (
                    <Button
                      key={feature}
                      type="button"
                      variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                      onClick={() => toggleFeature(feature)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                        selectedFeatures.includes(feature)
                          ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white border-[#FF6B00]'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                      }`}
                    >
                      {feature}
                    </Button>
                  ))}
                </div>
                {selectedFeatures.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    Selected: {selectedFeatures.join(', ')}
                  </div>
                )}
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
                {isSubmitting ? 'Submitting...' : 'Submit for Auto-Approval'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ListDriveway;
