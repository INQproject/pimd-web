
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { MapPin, Car, Shield, Sun, Clock, Circle, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Generate available dates with slot data - only return dates that have actual slots
const generateAvailableDatesWithSlots = (spotId: number, slotsByDate: Record<string, any[]>) => {
  const dates = [];
  const today = new Date();
  
  // Check the next 7 days for slots
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];
    
    // Only include this date if it has slots
    if (slotsByDate[dateString] && slotsByDate[dateString].length > 0) {
      dates.push({
        value: dateString,
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric' 
        }),
        shortLabel: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
  }
  
  return dates;
};

// Mock data with date-specific slot availability
const mockParkingSpots = [{
  id: 1,
  name: 'Downtown Austin Driveway',
  address: '123 Congress Ave, Austin, TX',
  price: 15,
  city: 'austin',
  image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=400',
  description: 'Secure private driveway in the heart of downtown Austin. Perfect for business meetings and shopping.',
  amenities: ['CCTV', 'Well-lit', '24/7 Access'],
  slotsByDate: {
    [new Date().toISOString().split('T')[0]]: [
      {
        id: 1,
        name: 'Slot A',
        timeRange: '8:00 AM - 12:00 PM',
        capacity: 2,
        startTime: '8:00 AM',
        endTime: '12:00 PM'
      },
      {
        id: 2,
        name: 'Slot B',
        timeRange: '1:00 PM - 6:00 PM',
        capacity: 1,
        startTime: '1:00 PM',
        endTime: '6:00 PM'
      }
    ],
    [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: [
      {
        id: 3,
        name: 'Slot A',
        timeRange: '9:00 AM - 1:00 PM',
        capacity: 3,
        startTime: '9:00 AM',
        endTime: '1:00 PM'
      },
      {
        id: 4,
        name: 'Slot B',
        timeRange: '2:00 PM - 7:00 PM',
        capacity: 2,
        startTime: '2:00 PM',
        endTime: '7:00 PM'
      }
    ]
  }
}, {
  id: 2,
  name: 'Deep Ellum Private Spot',
  address: '456 Elm St, Dallas, TX',
  price: 12,
  city: 'dallas',
  image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400',
  description: 'Private parking spot in trendy Deep Ellum district. Walking distance to restaurants and nightlife.',
  amenities: ['CCTV', 'Covered'],
  slotsByDate: {
    [new Date().toISOString().split('T')[0]]: [
      {
        id: 5,
        name: 'Slot A',
        timeRange: '9:00 AM - 2:00 PM',
        capacity: 3,
        startTime: '9:00 AM',
        endTime: '2:00 PM'
      },
      {
        id: 6,
        name: 'Slot B',
        timeRange: '3:00 PM - 8:00 PM',
        capacity: 2,
        startTime: '3:00 PM',
        endTime: '8:00 PM'
      }
    ]
  }
}, {
  id: 3,
  name: 'Phoenix Mall Parking',
  address: '789 Phoenix Way, Austin, TX',
  price: 8,
  city: 'austin',
  image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400',
  description: 'Convenient parking near Phoenix Mall with easy access to shopping and dining.',
  amenities: ['CCTV', 'Well-lit'],
  slotsByDate: {
    [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: [
      {
        id: 7,
        name: 'Slot A',
        timeRange: '10:00 AM - 4:00 PM',
        capacity: 5,
        startTime: '10:00 AM',
        endTime: '4:00 PM'
      },
      {
        id: 8,
        name: 'Slot B',
        timeRange: '5:00 PM - 10:00 PM',
        capacity: 3,
        startTime: '5:00 PM',
        endTime: '10:00 PM'
      }
    ]
  }
}];

// Add availableDates property to each spot based on actual slots
mockParkingSpots.forEach(spot => {
  spot.availableDates = generateAvailableDatesWithSlots(spot.id, spot.slotsByDate);
});

const allTimeOptions = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

const BookSlot = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMultiDate, setIsMultiDate] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [vehicleCount, setVehicleCount] = useState('1');
  const [vehicleBookings, setVehicleBookings] = useState([{
    slotId: '',
    startTime: '',
    endTime: '',
    price: 0
  }]);

  const spot = mockParkingSpots.find(s => s.id.toString() === spotId);

  useEffect(() => {
    if (!spot) {
      navigate('/find-parking');
      return;
    }

    if (!user) {
      navigate('/login', {
        state: {
          returnTo: `/book-slot/${spotId}`,
          context: 'booking'
        }
      });
      return;
    }

    // Set default selected date to first available date (only if it has slots)
    if (spot.availableDates.length > 0) {
      setSelectedDates([spot.availableDates[0].value]);
    }
  }, [spot, user, navigate, spotId]);

  if (!spot || !user) {
    return null;
  }

  // Get slots based on mode
  const getAvailableSlotsForSelectedDates = () => {
    if (selectedDates.length === 0) return [];
    
    if (!isMultiDate || selectedDates.length === 1) {
      // Single date mode - show all slots for the selected date
      return spot.slotsByDate[selectedDates[0]] || [];
    }

    // Multi-date mode - find common slots across all selected dates
    const firstDateSlots = spot.slotsByDate[selectedDates[0]] || [];
    
    return firstDateSlots.filter(slot => 
      selectedDates.every(date => {
        const dateSlots = spot.slotsByDate[date] || [];
        return dateSlots.some(dateSlot => 
          dateSlot.name === slot.name && 
          dateSlot.timeRange === slot.timeRange
        );
      })
    );
  };

  const availableSlotsForSelectedDates = getAvailableSlotsForSelectedDates();

  const handleDateToggle = (dateValue: string) => {
    if (!isMultiDate) {
      // Single date mode - only allow one date
      setSelectedDates([dateValue]);
    } else {
      // Multi-date mode - allow multiple dates
      setSelectedDates(prev => {
        const newDates = prev.includes(dateValue) 
          ? prev.filter(d => d !== dateValue)
          : [...prev, dateValue];
        return newDates;
      });
    }
    
    // Reset all vehicle bookings when dates change
    const newBookings = Array(parseInt(vehicleCount)).fill(null).map(() => ({
      slotId: '',
      startTime: '',
      endTime: '',
      price: 0
    }));
    setVehicleBookings(newBookings);
  };

  const handleModeToggle = (checked: boolean) => {
    setIsMultiDate(checked);
    // Reset to first available date when switching modes
    if (spot.availableDates.length > 0) {
      setSelectedDates([spot.availableDates[0].value]);
    }
    // Reset all vehicle bookings
    const newBookings = Array(parseInt(vehicleCount)).fill(null).map(() => ({
      slotId: '',
      startTime: '',
      endTime: '',
      price: 0
    }));
    setVehicleBookings(newBookings);
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

  const getSlotById = (slotId: string) => {
    return availableSlotsForSelectedDates.find(slot => slot.id.toString() === slotId);
  };

  const getAvailableStartTimes = (slotId: string) => {
    const slot = getSlotById(slotId);
    if (!slot) return [];
    const slotStartIndex = allTimeOptions.indexOf(slot.startTime);
    const slotEndIndex = allTimeOptions.indexOf(slot.endTime);
    return allTimeOptions.slice(slotStartIndex, slotEndIndex);
  };

  const getAvailableEndTimes = (slotId: string, startTime: string) => {
    const slot = getSlotById(slotId);
    if (!slot || !startTime) return [];
    const startIndex = allTimeOptions.indexOf(startTime);
    const slotEndIndex = allTimeOptions.indexOf(slot.endTime);
    return allTimeOptions.slice(startIndex + 1, slotEndIndex + 1);
  };

  const updateVehicleBooking = (index: number, field: string, value: string) => {
    const newBookings = [...vehicleBookings];
    newBookings[index] = {
      ...newBookings[index],
      [field]: value
    };

    if (field === 'startTime') {
      newBookings[index].endTime = '';
      newBookings[index].price = 0;
    }

    if (field === 'slotId') {
      newBookings[index].startTime = '';
      newBookings[index].endTime = '';
      newBookings[index].price = 0;
    }

    if (field === 'endTime' || (field === 'startTime' && newBookings[index].endTime)) {
      const booking = newBookings[index];
      if (booking.startTime && booking.endTime) {
        const startIndex = allTimeOptions.indexOf(booking.startTime);
        const endIndex = allTimeOptions.indexOf(booking.endTime);
        const hours = endIndex - startIndex;
        newBookings[index].price = Math.max(hours * spot.price * selectedDates.length, 0);
      }
    }

    setVehicleBookings(newBookings);
  };

  const handleProceedToPayment = () => {
    const totalPrice = vehicleBookings.reduce((sum, booking) => sum + booking.price, 0);
    const selectedDateLabels = selectedDates.map(date => 
      spot.availableDates.find(d => d.value === date)?.shortLabel || date
    ).join(', ');
    
    toast({
      title: "Booking Confirmed",
      description: `Total: $${totalPrice.toFixed(2)} for ${vehicleCount} vehicle(s) at ${spot.name} on ${selectedDateLabels}`
    });
    navigate('/profile');
  };

  const isBookingValid = vehicleBookings.every(booking => 
    booking.slotId && booking.startTime && booking.endTime && booking.price > 0
  ) && selectedDates.length > 0;

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
            </CardContent>
          </Card>
        </div>

        {/* Single/Multi-Date Toggle */}
        <Card className="mb-4 bg-[#FFF8F2] border-[#FF6B00]/30 max-w-4xl mx-auto">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="date-mode" className="text-sm font-medium text-[#1C1C1C]">
                Single Date
              </Label>
              <Switch
                id="date-mode"
                checked={isMultiDate}
                onCheckedChange={handleModeToggle}
                className="data-[state=checked]:bg-[#FF6B00]"
              />
              <Label htmlFor="date-mode" className="text-sm font-medium text-[#1C1C1C]">
                Multi-Date
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Date Selector - Only show if there are available dates */}
        {spot.availableDates.length > 0 ? (
          <Card className="mb-6 bg-[#FFF8F2] border-[#FF6B00]/30 max-w-4xl mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calendar className="h-5 w-5 text-[#FF6B00]" />
                <span>Select Available Date(s):</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {spot.availableDates.map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDates.includes(date.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDateToggle(date.value)}
                    disabled={!isMultiDate && selectedDates.includes(date.value)}
                    className={`px-4 py-2 ${
                      selectedDates.includes(date.value) 
                        ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white' 
                        : 'hover:bg-[#FF6B00]/10 hover:border-[#FF6B00] hover:text-[#FF6B00]'
                    }`}
                  >
                    {date.label}
                  </Button>
                ))}
              </div>
              {selectedDates.length > 1 && (
                <div className="mt-3 text-sm text-[#606060]">
                  Selected {selectedDates.length} dates
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-red-50 border-red-200 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="text-red-700 text-center">
                <h3 className="font-semibold mb-2">No Available Dates</h3>
                <p>No available dates for this location. Please check back later or contact the host.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Slots Status Message */}
        {spot.availableDates.length > 0 && (
          <Card className="mb-4 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-[#1C1C1C] mb-3">
                {selectedDates.length === 0 ? 'Please select at least one date' :
                 !isMultiDate || selectedDates.length === 1 ? 
                   `Showing slots for ${spot.availableDates.find(d => d.value === selectedDates[0])?.shortLabel}` :
                   'Common Slots Available Across All Selected Dates'
                }
              </h3>
              {selectedDates.length === 0 ? (
                <div className="text-[#606060] text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  Please select at least one date to see available slots.
                </div>
              ) : availableSlotsForSelectedDates.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {availableSlotsForSelectedDates.map(slot => (
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
              ) : (
                <div className="text-[#606060] text-sm bg-red-50 border border-red-200 rounded-lg p-4">
                  {isMultiDate && selectedDates.length > 1 
                    ? "No common time slots available for selected dates. Please select different dates or fewer dates."
                    : "No slots available for the selected date."
                  }
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid - Only show if slots are available */}
        {selectedDates.length > 0 && availableSlotsForSelectedDates.length > 0 && (
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

                  {/* Vehicle Assignments - Enhanced Cards */}
                  {vehicleBookings.map((booking, index) => (
                    <Card key={index} className="p-4 bg-[#F8F9FA] border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
                      <div className="flex items-center space-x-2 mb-3">
                        <Car className="w-4 h-4 text-[#FF6B00]" />
                        <h4 className="font-semibold text-[#1C1C1C]">Vehicle {index + 1}</h4>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-0">
                          <Label className="text-xs font-medium text-[#606060]">Time Slot</Label>
                          <Select value={booking.slotId} onValueChange={value => updateVehicleBooking(index, 'slotId', value)}>
                            <SelectTrigger className="h-9 text-sm mt-1 focus:ring-2 focus:ring-[#FF6B00]/20">
                              <SelectValue placeholder="Choose slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableSlotsForSelectedDates.map(slot => (
                                <SelectItem key={slot.id} value={slot.id.toString()}>
                                  {slot.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <Label className="text-xs font-medium text-[#606060]">Start Time</Label>
                          <Select value={booking.startTime} onValueChange={value => updateVehicleBooking(index, 'startTime', value)} disabled={!booking.slotId}>
                            <SelectTrigger className="h-9 text-sm mt-1 focus:ring-2 focus:ring-[#FF6B00]/20">
                              <SelectValue placeholder="Start" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableStartTimes(booking.slotId).map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <Label className="text-xs font-medium text-[#606060]">End Time</Label>
                          <Select value={booking.endTime} onValueChange={value => updateVehicleBooking(index, 'endTime', value)} disabled={!booking.startTime}>
                            <SelectTrigger className="h-9 text-sm mt-1 focus:ring-2 focus:ring-[#FF6B00]/20">
                              <SelectValue placeholder="End" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableEndTimes(booking.slotId, booking.startTime).map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
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
                    <div className="text-sm text-[#606060] mb-3">
                      <strong>Date(s):</strong> {selectedDates.map(date => 
                        spot.availableDates.find(d => d.value === date)?.shortLabel
                      ).join(', ')}
                    </div>
                    
                    {vehicleBookings.map((booking, index) => {
                    const slot = getSlotById(booking.slotId);
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <div className="text-sm">
                            <span className="font-semibold text-[#1C1C1C]">Vehicle {index + 1}</span>
                            {slot && booking.startTime && booking.endTime && (
                              <div className="text-xs text-[#666]">
                                {slot.name}: {booking.startTime} - {booking.endTime}
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

                    <Button onClick={handleProceedToPayment} className="w-full bg-[#FF6B00] hover:bg-[#e55a00] text-white h-12 mt-4 font-semibold text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200" disabled={!isBookingValid}>
                      Proceed to Payment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookSlot;
