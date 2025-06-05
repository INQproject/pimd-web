
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import AdvancedCalendar from '@/components/AdvancedCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Slot {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  status: 'available' | 'booked' | 'disabled';
}

interface DaySlots {
  [key: string]: Slot[];
}

const AddParking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    spotName: '',
    address: '',
    description: '',
    totalSlots: '',
    hourlyRate: '',
    dailyRate: '',
    weeklyRate: ''
  });
  const [availabilitySlots, setAvailabilitySlots] = useState<DaySlots>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Parking Spot Submitted",
      description: "Your parking spot is pending admin approval.",
    });
    navigate('/profile');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSlotsChange = (slots: DaySlots) => {
    setAvailabilitySlots(slots);
  };

  const canSubmit = formData.spotName && formData.address && formData.totalSlots;

  return (
    <Layout title="Add New Parking Spot">
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle>List Your Parking Space</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Parking Details</TabsTrigger>
                <TabsTrigger value="availability">Set Availability</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="spotName">Spot Name *</Label>
                    <Input
                      id="spotName"
                      placeholder="e.g., Downtown Driveway"
                      value={formData.spotName}
                      onChange={(e) => handleInputChange('spotName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
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
                    <Label htmlFor="totalSlots">Total Number of Slots *</Label>
                    <Input
                      id="totalSlots"
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.totalSlots}
                      onChange={(e) => handleInputChange('totalSlots', e.target.value)}
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
                    <Label>Upload Images (Up to 3)</Label>
                    <Input type="file" accept="image/*" multiple />
                    <p className="text-sm text-gray-500">Select up to 3 images of your parking space</p>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setActiveTab('availability')}
                      disabled={!canSubmit}
                    >
                      Next: Set Availability
                    </Button>
                    <Button type="submit" className="btn-primary">
                      Submit for Approval
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="availability">
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    <p>Set up your availability calendar by adding time slots for different areas of your parking space.</p>
                    <p>You can always modify this after your listing is approved.</p>
                  </div>
                  
                  <AdvancedCalendar
                    initialSlots={availabilitySlots}
                    onSlotsChange={handleSlotsChange}
                    showHeader={true}
                    compactMode={false}
                  />

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab('details')}
                    >
                      Back to Details
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      className="btn-primary"
                      disabled={!canSubmit}
                    >
                      Submit for Approval
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AddParking;
