
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Users, MapPin, DollarSign, Calendar } from 'lucide-react';

const AdminCreateSlot = () => {
  const [formData, setFormData] = useState({
    hostId: '',
    title: '',
    address: '',
    pricePerHour: '',
    quantity: '',
    description: '',
    amenities: [],
    availability: {
      monday: { enabled: false, start: '09:00', end: '17:00' },
      tuesday: { enabled: false, start: '09:00', end: '17:00' },
      wednesday: { enabled: false, start: '09:00', end: '17:00' },
      thursday: { enabled: false, start: '09:00', end: '17:00' },
      friday: { enabled: false, start: '09:00', end: '17:00' },
      saturday: { enabled: false, start: '09:00', end: '17:00' },
      sunday: { enabled: false, start: '09:00', end: '17:00' }
    }
  });

  // Mock hosts data
  const hosts = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', listings: 2 },
    { id: 2, name: 'Mike Chen', email: 'mike@example.com', listings: 1 },
    { id: 3, name: 'Emma Wilson', email: 'emma@example.com', listings: 3 },
    { id: 4, name: 'David Brown', email: 'david@example.com', listings: 0 }
  ];

  const amenityOptions = [
    'CCTV Security',
    'Covered Parking',
    'Electric Vehicle Charging',
    '24/7 Access',
    'Wheelchair Accessible',
    'Car Wash Available',
    'Valet Service'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Parking Slot Created",
      description: "New parking slot has been successfully created for the selected host.",
    });
    
    // Reset form
    setFormData({
      hostId: '',
      title: '',
      address: '',
      pricePerHour: '',
      quantity: '',
      description: '',
      amenities: [],
      availability: {
        monday: { enabled: false, start: '09:00', end: '17:00' },
        tuesday: { enabled: false, start: '09:00', end: '17:00' },
        wednesday: { enabled: false, start: '09:00', end: '17:00' },
        thursday: { enabled: false, start: '09:00', end: '17:00' },
        friday: { enabled: false, start: '09:00', end: '17:00' },
        saturday: { enabled: false, start: '09:00', end: '17:00' },
        sunday: { enabled: false, start: '09:00', end: '17:00' }
      }
    });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: newAmenities });
  };

  const toggleDayAvailability = (day: string) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: {
          ...formData.availability[day],
          enabled: !formData.availability[day].enabled
        }
      }
    });
  };

  const updateDayTime = (day: string, field: string, value: string) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: {
          ...formData.availability[day],
          [field]: value
        }
      }
    });
  };

  return (
    <AdminLayout title="Create Slot for Host">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Parking Slot</CardTitle>
            <p className="text-gray-600">Add a new parking slot and assign it to a host</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Host Selection */}
              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4" />
                  <span>Select Host</span>
                </Label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formData.hostId}
                  onChange={(e) => setFormData({...formData, hostId: e.target.value})}
                  required
                >
                  <option value="">Choose a host...</option>
                  {hosts.map((host) => (
                    <option key={host.id} value={host.id}>
                      {host.name} ({host.email}) - {host.listings} existing listings
                    </option>
                  ))}
                </select>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Slot Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Downtown Parking Spot"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Number of Spaces</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="pricePerHour" className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Price per Hour ($)</span>
                </Label>
                <Input
                  id="pricePerHour"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="15.00"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Describe the parking space, any special instructions, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Amenities */}
              <div>
                <Label className="mb-3 block">Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenityOptions.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Calendar */}
              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>Availability Schedule</span>
                </Label>
                <div className="space-y-3">
                  {Object.entries(formData.availability).map(([day, schedule]) => (
                    <div key={day} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <label className="flex items-center space-x-2 cursor-pointer min-w-[120px]">
                        <input
                          type="checkbox"
                          checked={schedule.enabled}
                          onChange={() => toggleDayAvailability(day)}
                          className="rounded"
                        />
                        <span className="capitalize font-medium">{day}</span>
                      </label>
                      
                      {schedule.enabled && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => updateDayTime(day, 'start', e.target.value)}
                            className="w-32"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => updateDayTime(day, 'end', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Parking Slot
                </Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateSlot;
