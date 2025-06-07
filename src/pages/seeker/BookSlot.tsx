
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { MapPin, Calendar, Clock, DollarSign, Car, User, Phone, Mail, Star } from 'lucide-react';
import { mockParkingSpots } from '@/data/mockParkingData';
import MultiDateSelector from '@/components/MultiDateSelector';
import VehicleDetailsForm from '@/components/VehicleDetailsForm';

const BookSlot = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vehicle state with initial vehicle
  const [vehicles, setVehicles] = useState([
    { id: '1', type: '', vehicleNumber: '' }
  ]);

  const spot = mockParkingSpots.find(s => s.id === parseInt(spotId || ''));

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/book-slot/${spotId}` } });
    }
  }, [user, navigate, spotId]);

  if (!spot) {
    return (
      <Layout title="Parking Spot Not Found">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Parking spot not found</h2>
          <Button onClick={() => navigate('/find-parking')} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
            Find Other Parking
          </Button>
        </div>
      </Layout>
    );
  }

  const selectedSlotData = spot.slots.find(slot => slot.id.toString() === selectedSlot);

  const calculateTotal = () => {
    if (!selectedSlotData || !duration) return 0;
    const hours = parseFloat(duration);
    return hours * spot.price;
  };

  const handleVehicleChange = (vehicleId: string, field: string, value: string) => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, [field]: value }
        : vehicle
    ));
  };

  const addVehicle = () => {
    const newVehicle = {
      id: (vehicles.length + 1).toString(),
      type: '',
      vehicleNumber: ''
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const removeVehicle = (vehicleId: string) => {
    if (vehicles.length > 1) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!selectedSlot || (!selectedDate && selectedDates.length === 0) || !startTime || !endTime || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Validate vehicles
    const incompleteVehicles = vehicles.filter(v => !v.type || !v.vehicleNumber);
    if (incompleteVehicles.length > 0) {
      toast({
        title: "Incomplete Vehicle Information",
        description: "Please complete all vehicle details",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate booking submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Booking Confirmed!",
      description: "Your parking slot has been successfully booked.",
    });

    navigate('/profile');
  };

  return (
    <Layout title="Book Your Parking Slot">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Banner Image - Updated with parking-related image */}
        <div className="relative h-64 bg-cover bg-center rounded-lg overflow-hidden mb-6" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200')"
        }}>
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative h-full flex items-center justify-center text-center text-white px-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Secure Your Parking</h1>
              <p className="text-lg">Complete your booking for {spot.name}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parking Slot Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-[#FF6B00]" />
                    <span>Select Your Parking Slot</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slot">Available Time Slots</Label>
                    <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {spot.slots.map(slot => (
                          <SelectItem key={slot.id} value={slot.id.toString()}>
                            {slot.name} - {slot.timeRange} (Capacity: {slot.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Single Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Select Date</Label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a date" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSlotData?.availableDates.map(date => (
                          <SelectItem key={date} value={date}>
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (hours)</Label>
                      <Input
                        id="duration"
                        type="number"
                        step="0.5"
                        placeholder="2.5"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Multi-Date Selection */}
              {selectedSlotData && (
                <MultiDateSelector
                  availableDates={selectedSlotData.availableDates}
                  selectedDates={selectedDates}
                  onDatesChange={setSelectedDates}
                />
              )}

              {/* Vehicle Details */}
              <VehicleDetailsForm
                vehicles={vehicles}
                onVehicleChange={handleVehicleChange}
              />

              {/* Add/Remove Vehicle Buttons */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addVehicle}
                      className="flex-1"
                    >
                      Add Another Vehicle
                    </Button>
                    {vehicles.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeVehicle(vehicles[vehicles.length - 1].id)}
                        className="flex-1"
                      >
                        Remove Vehicle
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Any special requests or notes for the host..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white py-3 text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing Booking...' : 'Confirm Booking'}
              </Button>
            </form>
          </div>

          {/* Sidebar - Spot Details & Summary */}
          <div className="space-y-6">
            {/* Spot Details */}
            <Card>
              <CardContent className="p-4">
                <img 
                  src={spot.image} 
                  alt={spot.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{spot.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{spot.address}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Hourly Rate:</span>
                  <span className="font-bold text-[#FF6B00]">${spot.price}/hour</span>
                </div>

                {/* Amenities */}
                {spot.amenities && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {spot.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-[#FF6B00]" />
                  <span>Booking Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedSlotData && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Time Slot:</span>
                      <span className="font-medium">{selectedSlotData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Not selected'}
                      </span>
                    </div>
                    {selectedDates.length > 0 && (
                      <div className="flex justify-between">
                        <span>Additional Dates:</span>
                        <span className="font-medium">{selectedDates.length}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{duration || '0'} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehicles:</span>
                      <span className="font-medium">{vehicles.length}</span>
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-xl text-[#FF6B00]">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookSlot;
