import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Car, Shield, Sun, Clock, Circle, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Updated mock data with actual available dates
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

const allTimeOptions = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

const BookSlot = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicleCount, setVehicleCount] = useState('1');
  const [isMultiDateMode, setIsMultiDateMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [vehicleBookings, setVehicleBookings] = useState([{
    slotId: '',
    startTime: '',
    endTime: '',
    price: 0,
    date: ''
  }]);

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
    // Reset vehicle bookings when dates change
    const newBookings = Array(parseInt(vehicleCount)).fill(null).map(() => ({
      slotId: '',
      startTime: '',
      endTime: '',
      price: 0,
      date: ''
    }));
    setVehicleBookings(newBookings);
  };

  const getAvailableSlotsForSelectedDates = () => {
    if (selectedDates.length === 0) return [];
    
    if (isMultiDateMode && selectedDates.length > 1) {
      // Find mutual slots (slots that exist on all selected dates)
      const slotsForDates = selectedDates.map(date => 
        spot.slots.filter(slot => slot.date === date)
      );
      
      // Find slots that have the same name and time range across all dates
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
      // Single date mode - show all slots for selected date
      return spot.slots.filter(slot => slot.date === selectedDates[0]);
    }
    
    return [];
  };

  const availableSlots = getAvailableSlotsForSelectedDates();

  const handleVehicleCountChange = (count: string) => {
    setVehicleCount(count);
    const newBookings = Array(parseInt(count)).fill(null).map(() => ({
      slotId: '',
      startTime: '',
      endTime: '',
      price: 0,
      date: ''
    }));
    setVehicleBookings(newBookings);
  };

  const updateVehicleBooking = (index: number, field: string, value: string) => {
    const newBookings = [...vehicleBookings];
    newBookings[index] = {
      ...newBookings[index],
      [field]: value
    };

    if (field === 'slotId') {
      const selectedSlot = availableSlots.find(slot => slot.id.toString() === value);
      if (selectedSlot) {
        newBookings[index].startTime = selectedSlot.startTime;
        newBookings[index].endTime = selectedSlot.endTime;
        newBookings[index].date = isMultiDateMode ? selectedDates.join(', ') : selectedDates[0];
        
        // Calculate price
        const startIndex = allTimeOptions.indexOf(selectedSlot.startTime);
        const endIndex = allTimeOptions.indexOf(selectedSlot.endTime);
        const hours = endIndex - startIndex;
        const totalPrice = isMultiDateMode ? hours * spot.price * selectedDates.length : hours * spot.price;
        newBookings[index].price = Math.max(totalPrice, 0);
      }
    }

    setVehicleBookings(newBookings);
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
    booking.slotId && booking.startTime && booking.endTime && booking.price > 0
  );

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
      <div className="space-y-4">
        {/* Compact Header Section */}
        <div className="max-w-4xl mx-auto">
          {/* Hero Image - Very Compact */}
          <div className="relative mb-4">
            <div className="aspect-[16/9] max-w-[600px] mx-auto relative overflow-hidden rounded-lg border shadow-sm" style={{
            maxHeight: '200px'
          }}>
              <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className="bg-[#FF6B00] text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  ${spot.price}/hr
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Spot Details Card */}
          <Card className="mb-4 bg-[#F9FAFB] shadow-md">
            <CardContent className="p-6">
              {/* Title and Address */}
              <div className="mb-5">
                <h1 className="text-xl font-bold text-[#1C1C1C] mb-3">{spot.name}</h1>
                <div className="flex items-center space-x-2 text-[#606060] mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-base">{spot.address}</span>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-5">
                <p className="text-base text-[#1C1C1C] leading-relaxed max-w-3xl">
                  {spot.description}
                </p>
              </div>
              
              {/* Amenities/Features */}
              <div className="mb-5">
                <div className="flex flex-wrap gap-2">
                  {spot.amenities.map((amenity, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="flex items-center gap-2 h-8 px-3 bg-white border-gray-200 text-[#1C1C1C] hover:bg-gray-50"
                    >
                      {getAmenityIcon(amenity)}
                      <span className="text-sm font-medium">{amenity}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Available Slots */}
              <div>
                <h3 className="text-base font-semibold text-[#1C1C1C] mb-3">Available Slots</h3>
                <div className="flex flex-wrap gap-3">
                  {spot.slots.map(slot => (
                    <div key={slot.id} className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                      <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
                      <div className="text-sm">
                        <span className="font-medium text-[#1C1C1C]">{slot.name}</span>
                        <span className="text-[#606060] ml-2">({slot.timeRange})</span>
                        <div className="text-xs text-[#606060] mt-1">
                          {slot.capacity} spot{slot.capacity > 1 ? 's' : ''} available
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Date Selection Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="mb-4 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Select Available Date(s)</CardTitle>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Single Date</span>
                  <button
                    onClick={() => {
                      setIsMultiDateMode(!isMultiDateMode);
                      setSelectedDates([]);
                      setVehicleBookings(Array(parseInt(vehicleCount)).fill(null).map(() => ({
                        slotId: '', startTime: '', endTime: '', price: 0, date: ''
                      })));
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
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
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
        </div>

        {/* Main Content Grid - Compact */}
        <div className="grid lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Select Your Parking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Vehicle Count - Compact */}
                <div>
                  <Label className="text-sm font-medium">Number of vehicles</Label>
                  <Select value={vehicleCount} onValueChange={handleVehicleCountChange}>
                    <SelectTrigger className="w-40 h-9 mt-1">
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

                {/* Show message if no dates selected */}
                {selectedDates.length === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please select at least one available date above to continue with your booking.
                    </p>
                  </div>
                )}

                {/* Show message if multi-date mode but no mutual slots */}
                {selectedDates.length > 1 && isMultiDateMode && availableSlots.length === 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      No mutual slots found for selected dates. Please try selecting different dates or switch to single date mode.
                    </p>
                  </div>
                )}

                {/* Vehicle Assignments - Enhanced Cards */}
                {selectedDates.length > 0 && availableSlots.length > 0 && vehicleBookings.map((booking, index) => (
                  <Card key={index} className="p-4 bg-[#F8F9FA] border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <Car className="w-4 h-4 text-[#FF6B00]" />
                      <h4 className="font-semibold text-[#1C1C1C]">Vehicle {index + 1}</h4>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 items-end">
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs font-medium text-[#606060]">Available Slot</Label>
                        <Select value={booking.slotId} onValueChange={value => updateVehicleBooking(index, 'slotId', value)}>
                          <SelectTrigger className="h-9 text-sm mt-1 focus:ring-2 focus:ring-[#FF6B00]/20">
                            <SelectValue placeholder="Choose slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSlots.map(slot => (
                              <SelectItem key={slot.id} value={slot.id.toString()}>
                                {slot.name} - {slot.timeRange}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Label className="text-xs font-medium text-[#606060]">Price</Label>
                        <div className="h-9 px-3 bg-white border rounded-md text-center font-bold text-lg flex items-center justify-center min-w-[80px] mt-1 text-[#FF6B00]">
                          ${booking.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {booking.date && (
                      <div className="mt-2 text-xs text-gray-600">
                        Date(s): {booking.date}
                      </div>
                    )}
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Enhanced Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="bg-[#FFF8F2] border-[#FF6B00]/30 shadow-lg rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-[#1C1C1C]">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vehicleBookings.map((booking, index) => {
                    const slot = availableSlots.find(slot => slot.id.toString() === booking.slotId);
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <div className="text-sm">
                            <span className="font-semibold text-[#1C1C1C]">Vehicle {index + 1}</span>
                            {slot && booking.slotId && (
                              <div className="text-xs text-[#666]">
                                {slot.timeRange}
                                {booking.date && <div>{booking.date}</div>}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-sm text-[#1C1C1C]">${booking.price.toFixed(2)}</span>
                        </div>
                        {index < vehicleBookings.length - 1 && <Separator className="my-2" />}
                      </div>
                    );
                  })}
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-[#1C1C1C]">Total:</span>
                    <span className="text-[#FF6B00]">
                      ${vehicleBookings.reduce((sum, b) => sum + b.price, 0).toFixed(2)}
                    </span>
                  </div>

                  <Button 
                    onClick={handleProceedToPayment} 
                    className="w-full bg-[#FF6B00] hover:bg-[#e55a00] text-white h-12 mt-4 font-semibold text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200" 
                    disabled={!isBookingValid}
                  >
                    Proceed to Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookSlot;
