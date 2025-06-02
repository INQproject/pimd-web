
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin, Calendar, Clock, Filter, Car, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Vehicle {
  id: number;
  duration: string;
}

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    price: 15,
    availability: '8:00 AM - 10:00 PM',
    city: 'austin',
    maxVehicles: 3,
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400'
  },
  {
    id: 2,
    name: 'Deep Ellum Private Spot',
    address: '456 Elm St, Dallas, TX',
    price: 12,
    availability: '6:00 AM - 11:00 PM',
    city: 'dallas',
    maxVehicles: 2,
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400'
  },
  {
    id: 3,
    name: 'South Lamar Safe Parking',
    address: '789 S Lamar Blvd, Austin, TX',
    price: 18,
    availability: '7:00 AM - 9:00 PM',
    city: 'austin',
    maxVehicles: 4,
    image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=400'
  },
  {
    id: 4,
    name: 'Bishop Arts District Spot',
    address: '321 Bishop Ave, Dallas, TX',
    price: 14,
    availability: '9:00 AM - 8:00 PM',
    city: 'dallas',
    maxVehicles: 1,
    image: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=400'
  }
];

const durationOptions = [
  { value: '0.5', label: '30 minutes', hours: 0.5 },
  { value: '1', label: '1 hour', hours: 1 },
  { value: '2', label: '2 hours', hours: 2 },
  { value: '3', label: '3 hours', hours: 3 },
  { value: '4', label: '4 hours', hours: 4 },
  { value: '8', label: 'Full Day', hours: 8 }
];

const FindParking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [cityFilter, setCityFilter] = useState<'all' | 'austin' | 'dallas'>('all');
  
  // Group parking states
  const [isGroupBooking, setIsGroupBooking] = useState(false);
  const [numVehicles, setNumVehicles] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([{ id: 1, duration: '' }]);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

  const updateVehicleCount = (count: number) => {
    setNumVehicles(count);
    const newVehicles = Array.from({ length: count }, (_, i) => 
      vehicles[i] || { id: i + 1, duration: '' }
    );
    setVehicles(newVehicles);
  };

  const updateVehicleDuration = (vehicleId: number, duration: string) => {
    setVehicles(prev => prev.map(v => 
      v.id === vehicleId ? { ...v, duration } : v
    ));
  };

  const filteredSpots = mockParkingSpots.filter(spot => {
    if (cityFilter !== 'all' && spot.city !== cityFilter) return false;
    if (searchLocation && !spot.address.toLowerCase().includes(searchLocation.toLowerCase())) return false;
    if (isGroupBooking && spot.maxVehicles < numVehicles) return false;
    return true;
  });

  const canShowResults = () => {
    if (isGroupBooking) {
      return vehicles.every(v => v.duration !== '') && numVehicles > 0;
    }
    return duration !== '';
  };

  const calculateTotalPrice = (spot: any) => {
    if (isGroupBooking) {
      return vehicles.reduce((total, vehicle) => {
        const durationHours = durationOptions.find(d => d.value === vehicle.duration)?.hours || 0;
        return total + (spot.price * durationHours);
      }, 0);
    } else {
      const durationHours = durationOptions.find(d => d.value === duration)?.hours || 0;
      return spot.price * durationHours;
    }
  };

  const handleBookParking = (spot: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book parking.",
        variant: "destructive"
      });
      navigate('/login', { state: { returnTo: '/find-parking' } });
      return;
    }

    setSelectedSpot(spot);
    setShowBookingSummary(true);
  };

  const handleProceedToPayment = () => {
    // Simulate payment process
    toast({
      title: "Booking Confirmed!",
      description: isGroupBooking 
        ? `Successfully booked parking for ${numVehicles} vehicles`
        : "Successfully booked parking",
    });
    setShowBookingSummary(false);
    navigate('/profile');
  };

  return (
    <Layout title="Find Parking" showBackButton={true}>
      <div className="space-y-8">
        {/* Static Map Placeholder */}
        <Card className="overflow-hidden">
          <div className="h-80 bg-gradient-to-br from-blue-100 to-green-100 relative flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-[#FF6B00] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1C1C1C] mb-2">Interactive Map View</h3>
              <p className="text-[#606060]">Parking spots in Austin & Dallas</p>
            </div>
            
            {/* Mock parking pins */}
            <div className="absolute top-20 left-1/4">
              <div className="w-4 h-4 bg-[#FF6B00] rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="absolute top-32 right-1/3">
              <div className="w-4 h-4 bg-[#FF6B00] rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="absolute bottom-20 left-1/3">
              <div className="w-4 h-4 bg-[#FF6B00] rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        </Card>

        {/* Group Parking Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-[#FF6B00]" />
              <span>Booking Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Label htmlFor="group-booking">Are you booking for multiple vehicles?</Label>
              <Switch
                id="group-booking"
                checked={isGroupBooking}
                onCheckedChange={setIsGroupBooking}
              />
            </div>

            {isGroupBooking && (
              <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="space-y-2">
                  <Label htmlFor="num-vehicles">How many vehicles are you booking for?</Label>
                  <Select value={numVehicles.toString()} onValueChange={(value) => updateVehicleCount(parseInt(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center space-x-4 p-3 bg-white rounded border">
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-[#FF6B00]" />
                        <span className="font-medium">Car {vehicle.id}</span>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`duration-${vehicle.id}`} className="sr-only">Duration for Car {vehicle.id}</Label>
                        <Select value={vehicle.duration} onValueChange={(value) => updateVehicleDuration(vehicle.id, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {durationOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-[#FF6B00]" />
              <span>Search & Filter Parking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter Austin or Dallas location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                    <SelectItem value="18:00">6:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {!isGroupBooking && (
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={cityFilter} onValueChange={(value: 'all' | 'austin' | 'dallas') => setCityFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                    <SelectItem value="dallas">Dallas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        {canShowResults() && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#1C1C1C]">
              Available Parking Spots {isGroupBooking && `(Supporting ${numVehicles} vehicles)`}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredSpots.map((spot) => (
                <Card key={spot.id} className="hover:shadow-lg transition-all duration-200">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img 
                      src={spot.image} 
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-[#FF6B00]">
                        ${calculateTotalPrice(spot)} total
                      </span>
                    </div>
                    {isGroupBooking && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {spot.maxVehicles} cars max
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{spot.name}</CardTitle>
                    <CardDescription className="space-y-2">
                      <div className="flex items-center space-x-2 text-[#606060]">
                        <MapPin className="w-4 h-4" />
                        <span>{spot.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#606060]">
                        <Clock className="w-4 h-4" />
                        <span>Available: {spot.availability}</span>
                      </div>
                      {isGroupBooking && (
                        <div className="flex items-center space-x-2 text-[#606060]">
                          <Car className="w-4 h-4" />
                          <span>Supports up to {spot.maxVehicles} vehicles</span>
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Button 
                      onClick={() => handleBookParking(spot)}
                      className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                    >
                      Book Parking
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Booking Summary Modal */}
        <Dialog open={showBookingSummary} onOpenChange={setShowBookingSummary}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Summary</DialogTitle>
              <DialogDescription>
                Review your parking booking details
              </DialogDescription>
            </DialogHeader>
            
            {selectedSpot && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">{selectedSpot.name}</h4>
                  <p className="text-sm text-gray-600">{selectedSpot.address}</p>
                </div>

                <div className="space-y-2">
                  {isGroupBooking ? (
                    vehicles.map((vehicle) => {
                      const durationLabel = durationOptions.find(d => d.value === vehicle.duration)?.label;
                      const durationHours = durationOptions.find(d => d.value === vehicle.duration)?.hours || 0;
                      const price = selectedSpot.price * durationHours;
                      
                      return (
                        <div key={vehicle.id} className="flex justify-between items-center p-2 border rounded">
                          <span>Vehicle {vehicle.id}: {durationLabel}</span>
                          <span className="font-semibold">${price}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Single Vehicle: {durationOptions.find(d => d.value === duration)?.label}</span>
                      <span className="font-semibold">${calculateTotalPrice(selectedSpot)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>${calculateTotalPrice(selectedSpot)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                >
                  Proceed to Payment
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default FindParking;
