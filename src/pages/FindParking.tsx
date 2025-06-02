
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Calendar, Clock, Filter, Car } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const mockParkingSpots = [
  {
    id: 1,
    name: 'Downtown Austin Driveway',
    address: '123 Congress Ave, Austin, TX',
    price: 15,
    city: 'austin',
    image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
    slots: [
      { id: 1, name: 'Slot A', timeRange: '8:00 AM - 12:00 PM', capacity: 2 },
      { id: 2, name: 'Slot B', timeRange: '1:00 PM - 6:00 PM', capacity: 1 }
    ]
  },
  {
    id: 2,
    name: 'Deep Ellum Private Spot',
    address: '456 Elm St, Dallas, TX',
    price: 12,
    city: 'dallas',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400',
    slots: [
      { id: 3, name: 'Slot A', timeRange: '9:00 AM - 2:00 PM', capacity: 3 },
      { id: 4, name: 'Slot B', timeRange: '3:00 PM - 8:00 PM', capacity: 2 }
    ]
  }
];

const FindParking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [cityFilter, setCityFilter] = useState<'all' | 'austin' | 'dallas'>('all');
  
  // Multi-vehicle booking state
  const [bookingSpot, setBookingSpot] = useState<any>(null);
  const [vehicleCount, setVehicleCount] = useState('1');
  const [vehicleBookings, setVehicleBookings] = useState<any[]>([]);

  const filteredSpots = mockParkingSpots.filter(spot => {
    if (cityFilter !== 'all' && spot.city !== cityFilter) return false;
    return true;
  });

  const handleBookParking = (spot: any) => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/book-slot/${spot.id}`, context: 'booking' } });
      return;
    }
    setBookingSpot(spot);
    setVehicleCount('1');
    setVehicleBookings([{ slotId: '', startTime: '', endTime: '', price: 0 }]);
  };

  const handleVehicleCountChange = (count: string) => {
    setVehicleCount(count);
    const newBookings = Array(parseInt(count)).fill(null).map(() => ({
      slotId: '',
      startTime: '',
      endTime: '',
      price: 0
    }));
    setVehicleBookings(newBookings);
  };

  const updateVehicleBooking = (index: number, field: string, value: string) => {
    const newBookings = [...vehicleBookings];
    newBookings[index] = { ...newBookings[index], [field]: value };
    
    // Calculate price if we have both times
    if (field === 'endTime' || field === 'startTime') {
      const booking = newBookings[index];
      if (booking.startTime && booking.endTime) {
        const start = new Date(`2024-01-01 ${booking.startTime}`);
        const end = new Date(`2024-01-01 ${booking.endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        newBookings[index].price = Math.max(hours * (bookingSpot?.price || 15), 0);
      }
    }
    
    setVehicleBookings(newBookings);
  };

  const handleProceedToPayment = () => {
    const totalPrice = vehicleBookings.reduce((sum, booking) => sum + booking.price, 0);
    toast({
      title: "Booking Confirmed",
      description: `Total: $${totalPrice.toFixed(2)} for ${vehicleCount} vehicle(s)`,
    });
    setBookingSpot(null);
  };

  const timeOptions = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  return (
    <Layout title="Find Parking">
      <div className="space-y-8">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-[#FF6B00]" />
              <span>Search & Filter Parking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Location</Label>
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
                    {timeOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">30 min</SelectItem>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1C1C1C]">Available Parking Spots</h2>
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
                      ${spot.price}/hr
                    </span>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{spot.name}</CardTitle>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center space-x-2 text-[#606060]">
                      <MapPin className="w-4 h-4" />
                      <span>{spot.address}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Available Slots:</p>
                      {spot.slots.map(slot => (
                        <div key={slot.id} className="text-sm text-[#606060]">
                          {slot.name}: {slot.timeRange} (Capacity: {slot.capacity})
                        </div>
                      ))}
                    </div>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => handleBookParking(spot)}
                        className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                      >
                        <Car className="w-4 h-4 mr-2" />
                        Book Parking
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Book Parking at {bookingSpot?.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>How many vehicles are you booking for?</Label>
                          <Select value={vehicleCount} onValueChange={handleVehicleCountChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} vehicle{num > 1 ? 's' : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {vehicleBookings.map((booking, index) => (
                          <Card key={index} className="p-4">
                            <h4 className="font-semibold mb-3">Car {index + 1}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <div>
                                <Label>Select Slot</Label>
                                <Select 
                                  value={booking.slotId} 
                                  onValueChange={(value) => updateVehicleBooking(index, 'slotId', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose slot" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {bookingSpot?.slots.map((slot: any) => (
                                      <SelectItem key={slot.id} value={slot.id.toString()}>
                                        {slot.name} ({slot.timeRange})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Start Time</Label>
                                <Select 
                                  value={booking.startTime} 
                                  onValueChange={(value) => updateVehicleBooking(index, 'startTime', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Start" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map(time => (
                                      <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>End Time</Label>
                                <Select 
                                  value={booking.endTime} 
                                  onValueChange={(value) => updateVehicleBooking(index, 'endTime', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="End" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map(time => (
                                      <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Price</Label>
                                <div className="p-2 bg-gray-100 rounded text-center font-semibold">
                                  ${booking.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}

                        <div className="bg-[#F9FAFB] p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Booking Summary</h4>
                          {vehicleBookings.map((booking, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>Car {index + 1}:</span>
                              <span>${booking.price.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>${vehicleBookings.reduce((sum, b) => sum + b.price, 0).toFixed(2)}</span>
                          </div>
                        </div>

                        <Button 
                          onClick={handleProceedToPayment}
                          className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90"
                        >
                          Proceed to Payment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindParking;
