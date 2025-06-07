
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Car, Shield, Sun, Clock, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data with actual available dates
const mockParkingSpots = [{
  id: 1,
  name: 'Downtown Austin Driveway',
  address: '123 Congress Ave, Austin, TX',
  price: 15,
  city: 'austin',
  image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
  description: 'Secure private driveway in the heart of downtown Austin. Perfect for business meetings and shopping.',
  amenities: ['CCTV', 'Well-lit', '24/7 Access'],
  availableDates: ['2024-06-09', '2024-06-12', '2024-06-15', '2024-06-18'],
  slots: [
    { id: 1, name: 'Slot A', timeRange: '8:00 AM - 12:00 PM', capacity: 2, date: '2024-06-09', startTime: '8:00 AM', endTime: '12:00 PM' },
    { id: 2, name: 'Slot B', timeRange: '1:00 PM - 6:00 PM', capacity: 1, date: '2024-06-09', startTime: '1:00 PM', endTime: '6:00 PM' },
    { id: 3, name: 'Slot A', timeRange: '8:00 AM - 12:00 PM', capacity: 2, date: '2024-06-12', startTime: '8:00 AM', endTime: '12:00 PM' },
    { id: 4, name: 'Slot B', timeRange: '2:00 PM - 7:00 PM', capacity: 1, date: '2024-06-15', startTime: '2:00 PM', endTime: '7:00 PM' },
    { id: 5, name: 'Slot A', timeRange: '9:00 AM - 1:00 PM', capacity: 2, date: '2024-06-18', startTime: '9:00 AM', endTime: '1:00 PM' }
  ]
}, {
  id: 2,
  name: 'Deep Ellum Private Spot',
  address: '456 Elm St, Dallas, TX',
  price: 12,
  city: 'dallas',
  image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400',
  description: 'Private parking spot in trendy Deep Ellum district. Walking distance to restaurants and nightlife.',
  amenities: ['CCTV', 'Covered'],
  availableDates: ['2024-06-10', '2024-06-14', '2024-06-17'],
  slots: [
    { id: 6, name: 'Slot A', timeRange: '9:00 AM - 2:00 PM', capacity: 3, date: '2024-06-10', startTime: '9:00 AM', endTime: '2:00 PM' },
    { id: 7, name: 'Slot B', timeRange: '3:00 PM - 8:00 PM', capacity: 2, date: '2024-06-14', startTime: '3:00 PM', endTime: '8:00 PM' },
    { id: 8, name: 'Slot A', timeRange: '10:00 AM - 3:00 PM', capacity: 3, date: '2024-06-17', startTime: '10:00 AM', endTime: '3:00 PM' }
  ]
}];

const timeOptions = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

interface VehicleBooking {
  vehicleNumber: string;
  startTime: string;
  endTime: string;
  price: number;
}

const BookSlot = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMultiDateMode, setIsMultiDateMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [vehicleCount, setVehicleCount] = useState(1);
  const [vehicleBookings, setVehicleBookings] = useState<VehicleBooking[]>([
    { vehicleNumber: '', startTime: '', endTime: '', price: 0 }
  ]);

  const spot = mockParkingSpots.find(s => s.id.toString() === spotId);

  if (!spot) {
    navigate('/find-parking');
    return null;
  }

  if (!user) {
    navigate('/login', {
      state: { returnTo: `/book-slot/${spotId}`, context: 'booking' }
    });
    return null;
  }

  const formatDatePill = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDateSelection = (date: string) => {
    if (isMultiDateMode) {
      if (selectedDates.includes(date)) {
        setSelectedDates(selectedDates.filter(d => d !== date));
      } else {
        setSelectedDates([...selectedDates, date]);
      }
    } else {
      setSelectedDates([date]);
    }
  };

  const getAvailableSlotsForSelectedDates = () => {
    if (selectedDates.length === 0) return [];
    
    if (isMultiDateMode && selectedDates.length > 1) {
      // Find mutual slots (slots that exist on all selected dates)
      const slotsForDates = selectedDates.map(date => 
        spot.slots.filter(slot => slot.date === date)
      );
      
      const mutualSlots: any[] = [];
      const firstDateSlots = slotsForDates[0] || [];
      
      firstDateSlots.forEach(slot => {
        const isAvailableOnAllDates = slotsForDates.every(dateSlots => 
          dateSlots.some(s => s.name === slot.name && s.timeRange === slot.timeRange)
        );
        
        if (isAvailableOnAllDates) {
          mutualSlots.push({
            ...slot,
            id: `mutual-${slot.name}-${slot.timeRange}`,
            dates: selectedDates
          });
        }
      });
      
      return mutualSlots;
    } else if (selectedDates.length === 1) {
      return spot.slots.filter(slot => slot.date === selectedDates[0]);
    }
    
    return [];
  };

  const handleVehicleCountChange = (count: number) => {
    setVehicleCount(count);
    const newBookings = Array(count).fill(null).map(() => ({
      vehicleNumber: '',
      startTime: '',
      endTime: '',
      price: 0
    }));
    setVehicleBookings(newBookings);
  };

  const updateVehicleBooking = (index: number, field: keyof VehicleBooking, value: string) => {
    const newBookings = [...vehicleBookings];
    newBookings[index] = {
      ...newBookings[index],
      [field]: value
    };

    // Calculate price when time changes
    if (field === 'startTime' || field === 'endTime') {
      const { startTime, endTime } = newBookings[index];
      if (startTime && endTime) {
        const startIndex = timeOptions.indexOf(startTime);
        const endIndex = timeOptions.indexOf(endTime);
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          const hours = endIndex - startIndex;
          const totalPrice = isMultiDateMode ? hours * spot.price * selectedDates.length : hours * spot.price;
          newBookings[index].price = totalPrice;
        }
      }
    }

    setVehicleBookings(newBookings);
  };

  const getEndTimeOptions = (startTime: string) => {
    if (!startTime) return [];
    const startIndex = timeOptions.indexOf(startTime);
    return timeOptions.slice(startIndex + 1);
  };

  const handleProceedToPayment = () => {
    const totalPrice = vehicleBookings.reduce((sum, booking) => sum + booking.price, 0);
    toast({
      title: "Booking Confirmed",
      description: `Total: $${totalPrice.toFixed(2)} for ${vehicleCount} vehicle(s) at ${spot.name}`
    });
    navigate('/profile');
  };

  const isBookingValid = vehicleBookings.every(booking => 
    booking.vehicleNumber && booking.startTime && booking.endTime && booking.price > 0
  );

  const totalPrice = vehicleBookings.reduce((sum, booking) => sum + booking.price, 0);
  const availableSlots = getAvailableSlotsForSelectedDates();

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'cctv':
        return <Shield className="w-4 h-4" />;
      case 'well-lit':
        return <Sun className="w-4 h-4" />;
      case '24/7 access':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Layout title={`Book Parking at ${spot.name}`} showBackButton={true}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 1. PARKING BANNER / IMAGE SECTION */}
        <div className="relative">
          <div className="aspect-[16/6] w-full relative overflow-hidden rounded-lg border shadow-sm">
            <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="bg-[#FF6B00] text-white px-4 py-2 rounded-full text-lg font-bold shadow-md">
                ${spot.price}/hr
              </span>
            </div>
          </div>
        </div>

        {/* 2. PARKING DETAILS */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-3">{spot.name}</h1>
            <div className="flex items-center space-x-2 text-[#606060] mb-4">
              <MapPin className="w-5 h-5 text-[#FF6B00]" />
              <span className="text-lg">{spot.address}</span>
            </div>
            <p className="text-[#1C1C1C] mb-4 leading-relaxed">{spot.description}</p>
            <div className="flex flex-wrap gap-2">
              {spot.amenities.map((amenity, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center gap-2 h-8 px-3 bg-white border-gray-200 text-[#1C1C1C]"
                >
                  {getAmenityIcon(amenity)}
                  <span className="text-sm font-medium">{amenity}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3. AVAILABLE DATES */}
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Select Available Date(s)</CardTitle>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Single Date</span>
                <button
                  onClick={() => {
                    setIsMultiDateMode(!isMultiDateMode);
                    setSelectedDates([]);
                  }}
                  className="text-[#FF6B00] hover:text-[#e55a00] transition-colors"
                >
                  {isMultiDateMode ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
                <span className="text-sm text-gray-600">Multi Date</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {spot.availableDates.map(date => (
                <button
                  key={date}
                  onClick={() => handleDateSelection(date)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedDates.includes(date)
                      ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-md'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/5'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{formatDatePill(date)}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {selectedDates.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  Selected: {selectedDates.map(date => formatDatePill(date)).join(', ')}
                  {isMultiDateMode && selectedDates.length > 1 && (
                    <span className="block mt-1 text-xs">
                      Multi-date mode: Only showing slots available on all selected dates
                    </span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. SLOT SELECTION */}
        {selectedDates.length > 0 && (
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Available Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              {availableSlots.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    {isMultiDateMode && selectedDates.length > 1 
                      ? "No mutual slots found for selected dates. Please try selecting different dates or switch to single date mode."
                      : "No slots available for selected date."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableSlots.map(slot => (
                    <div key={slot.id} className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                      <Clock className="w-4 h-4 text-[#FF6B00]" />
                      <div>
                        <span className="font-medium text-[#1C1C1C]">{slot.name}</span>
                        <div className="text-sm text-[#606060]">{slot.timeRange}</div>
                        <div className="text-xs text-[#606060]">
                          {slot.capacity} spot{slot.capacity > 1 ? 's' : ''} available
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 5. VEHICLE COUNT & CONFIGURATION */}
        {selectedDates.length > 0 && availableSlots.length > 0 && (
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Select Number of Vehicles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Number of vehicles</Label>
                <Select value={vehicleCount.toString()} onValueChange={(value) => handleVehicleCountChange(parseInt(value))}>
                  <SelectTrigger className="w-48 mt-1">
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

              {/* Vehicle Configuration Blocks */}
              <div className="space-y-4">
                {vehicleBookings.map((booking, index) => (
                  <Card key={index} className="p-4 bg-[#F8F9FA] border shadow-sm">
                    <div className="flex items-center space-x-2 mb-4">
                      <Car className="w-5 h-5 text-[#FF6B00]" />
                      <h4 className="font-semibold text-[#1C1C1C]">Vehicle {index + 1}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-[#606060]">Vehicle Number</Label>
                        <Input
                          placeholder="e.g., ABC-123"
                          value={booking.vehicleNumber}
                          onChange={(e) => updateVehicleBooking(index, 'vehicleNumber', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-[#606060]">Start Time</Label>
                        <Select 
                          value={booking.startTime} 
                          onValueChange={(value) => updateVehicleBooking(index, 'startTime', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-[#606060]">End Time</Label>
                        <Select 
                          value={booking.endTime} 
                          onValueChange={(value) => updateVehicleBooking(index, 'endTime', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent>
                            {getEndTimeOptions(booking.startTime).map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-[#606060]">Price</Label>
                        <div className="h-10 px-3 bg-white border rounded-md text-center font-bold text-lg flex items-center justify-center mt-1 text-[#FF6B00]">
                          ${booking.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {selectedDates.length > 0 && (
                      <div className="mt-3 text-sm text-gray-600">
                        Date(s): {selectedDates.map(date => formatDatePill(date)).join(', ')}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 6. PAYMENT CTA */}
        {selectedDates.length > 0 && availableSlots.length > 0 && (
          <Card className="bg-[#FFF8F2] border-[#FF6B00]/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-[#1C1C1C]">Booking Summary</h3>
                <div className="text-right">
                  <div className="text-sm text-[#606060]">Total Amount</div>
                  <div className="text-2xl font-bold text-[#FF6B00]">${totalPrice.toFixed(2)}</div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-6">
                {vehicleBookings.map((booking, index) => (
                  booking.price > 0 && (
                    <div key={index} className="flex justify-between text-sm">
                      <span>Vehicle {index + 1} ({booking.startTime} - {booking.endTime})</span>
                      <span className="font-semibold">${booking.price.toFixed(2)}</span>
                    </div>
                  )
                ))}
              </div>

              <Button 
                onClick={handleProceedToPayment} 
                className="w-full bg-[#FF6B00] hover:bg-[#e55a00] text-white h-12 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200" 
                disabled={!isBookingValid}
              >
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BookSlot;
