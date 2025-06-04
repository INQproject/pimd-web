
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { MapPin, Car, Shield, Sun, Clock, Circle, Hash, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mockParkingSpots } from '@/data/mockParkingData';
import DateSelector from '@/components/DateSelector';

const allTimeOptions = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

const BookSlot = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isMultiDateMode, setIsMultiDateMode] = useState(false);
  const [vehicleCount, setVehicleCount] = useState('1');
  const [singleSlotBooking, setSingleSlotBooking] = useState({
    slotId: '',
    vehicleNumber: '',
    startTime: '',
    endTime: '',
    pricePerDay: 0
  });

  const spot = mockParkingSpots.find(s => s.id.toString() === spotId);

  // Get all unique available dates for this spot
  const availableDates = useMemo(() => {
    if (!spot) return [];
    const allDates = spot.slots.flatMap(slot => slot.availableDates || []);
    return [...new Set(allDates)].sort();
  }, [spot]);

  // Filter slots based on the first selected date for multi-date mode
  const availableSlotsForSelection = useMemo(() => {
    if (!spot) return [];
    const referenceDate = selectedDates.length > 0 ? selectedDates[0] : null;
    if (!referenceDate) return [];
    return spot.slots.filter(slot => slot.availableDates && slot.availableDates.includes(referenceDate));
  }, [spot, selectedDates]);

  // Set the first available date as default for single date mode
  React.useEffect(() => {
    if (availableDates.length > 0 && selectedDates.length === 0 && !isMultiDateMode) {
      setSelectedDates([availableDates[0]]);
    }
  }, [availableDates, selectedDates, isMultiDateMode]);

  // Handle early returns after all hooks are called
  if (!spot) {
    navigate('/find-parking');
    return null;
  }
  if (!user) {
    navigate('/login', {
      state: {
        returnTo: `/book-slot/${spotId}`,
        context: 'booking'
      }
    });
    return null;
  }

  const handleVehicleCountChange = (count: string) => {
    setVehicleCount(count);
  };

  const getSlotById = (slotId: string) => {
    return availableSlotsForSelection.find(slot => slot.id.toString() === slotId);
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

  const updateSingleSlotBooking = (field: string, value: string) => {
    const newBooking = {
      ...singleSlotBooking,
      [field]: value
    };

    if (field === 'startTime') {
      newBooking.endTime = '';
      newBooking.pricePerDay = 0;
    }
    if (field === 'slotId') {
      newBooking.startTime = '';
      newBooking.endTime = '';
      newBooking.pricePerDay = 0;
    }
    if (field === 'endTime' || (field === 'startTime' && newBooking.endTime)) {
      if (newBooking.startTime && newBooking.endTime) {
        const startIndex = allTimeOptions.indexOf(newBooking.startTime);
        const endIndex = allTimeOptions.indexOf(newBooking.endTime);
        const hours = endIndex - startIndex;
        newBooking.pricePerDay = Math.max(hours * spot.price, 0);
      }
    }
    setSingleSlotBooking(newBooking);
  };

  const handleDateSelect = (date: string) => {
    if (isMultiDateMode) {
      setSelectedDates(prev => {
        if (prev.includes(date)) {
          return prev.filter(d => d !== date);
        } else {
          return [...prev, date].sort();
        }
      });
    } else {
      setSelectedDates([date]);
    }
    // Reset booking when dates change
    setSingleSlotBooking({
      slotId: '',
      vehicleNumber: '',
      startTime: '',
      endTime: '',
      pricePerDay: 0
    });
  };

  const handleMultiDateModeToggle = (enabled: boolean) => {
    setIsMultiDateMode(enabled);
    if (!enabled && selectedDates.length > 1) {
      setSelectedDates(selectedDates.slice(0, 1));
    }
    setSingleSlotBooking({
      slotId: '',
      vehicleNumber: '',
      startTime: '',
      endTime: '',
      pricePerDay: 0
    });
  };

  const handleProceedToPayment = () => {
    const totalDays = selectedDates.length;
    const totalVehicles = parseInt(vehicleCount);
    const totalPrice = singleSlotBooking.pricePerDay * totalDays * totalVehicles;
    
    toast({
      title: "Booking Confirmed",
      description: `Total: $${totalPrice.toFixed(2)} for ${vehicleCount} vehicle(s) at ${spot.name} across ${totalDays} day(s)`
    });
    navigate('/profile');
  };

  const isBookingValid = singleSlotBooking.slotId && singleSlotBooking.vehicleNumber && 
                        singleSlotBooking.startTime && singleSlotBooking.endTime && 
                        singleSlotBooking.pricePerDay > 0 && selectedDates.length > 0;

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

  const getTotalPrice = () => {
    return singleSlotBooking.pricePerDay * selectedDates.length * parseInt(vehicleCount);
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
                  {spot.amenities && spot.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
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
              <CardContent className="space-y-6">
                {/* Multi-Date Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Multi-Date Booking</div>
                      <div className="text-sm text-blue-700">Book the same slot across multiple dates</div>
                    </div>
                  </div>
                  <Switch
                    checked={isMultiDateMode}
                    onCheckedChange={handleMultiDateModeToggle}
                  />
                </div>

                {/* Date Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#1C1C1C]">
                      {isMultiDateMode ? 'Select Dates' : 'Select Date'}
                    </h3>
                    {isMultiDateMode && selectedDates.length > 0 && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        {selectedDates.length} day{selectedDates.length > 1 ? 's' : ''} selected
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date) => (
                      <Button
                        key={date}
                        variant={selectedDates.includes(date) ? "default" : "outline"}
                        onClick={() => handleDateSelect(date)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          selectedDates.includes(date)
                            ? 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white'
                            : 'border-gray-300 hover:border-[#FF6B00] hover:text-[#FF6B00]'
                        }`}
                      >
                        {new Date(date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Selected Dates Preview */}
                {isMultiDateMode && selectedDates.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Selected Dates</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDates.map(date => (
                        <div key={date} className="flex items-center space-x-2 bg-white border border-green-200 rounded-lg px-3 py-1 shadow-sm">
                          <Circle className="w-3 h-3 fill-green-500 text-green-500" />
                          <span className="text-sm font-medium text-green-900">
                            {new Date(date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vehicle Count */}
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

                {/* Available Slots for Selected Dates */}
                {selectedDates.length > 0 && availableSlotsForSelection.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Available Slots{isMultiDateMode ? ' (will apply to all selected dates)' : ''}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableSlotsForSelection.map(slot => (
                        <div key={slot.id} className="flex items-center space-x-2 bg-white border border-blue-200 rounded-lg px-3 py-2 shadow-sm">
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
                )}

                {/* Single Slot Configuration */}
                {selectedDates.length > 0 && availableSlotsForSelection.length > 0 && (
                  <Card className="p-4 bg-[#F8F9FA] border shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <Car className="w-4 h-4 text-[#FF6B00]" />
                      <h4 className="font-semibold text-[#1C1C1C]">
                        Slot Configuration{isMultiDateMode ? ' (for all selected dates)' : ''}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                      {/* Time Slot */}
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs font-medium text-[#606060] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Time Slot
                        </Label>
                        <Select value={singleSlotBooking.slotId} onValueChange={(value) => updateSingleSlotBooking('slotId', value)}>
                          <SelectTrigger className="h-9 text-sm mt-1 focus:ring-2 focus:ring-[#FF6B00]/20">
                            <SelectValue placeholder="Choose slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSlotsForSelection.map(slot => (
                              <SelectItem key={slot.id} value={slot.id.toString()}>
                                {slot.name} ({slot.timeRange})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Vehicle Number */}
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs font-medium text-[#606060] flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Vehicle Number
                        </Label>
                        <Input 
                          type="text" 
                          placeholder="e.g., TN 10 AK 6567" 
                          value={singleSlotBooking.vehicleNumber} 
                          onChange={(e) => updateSingleSlotBooking('vehicleNumber', e.target.value)} 
                          className="h-9 text-sm mt-1 focus:ring-2 focus:ring-[#FF6B00]/20" 
                          required 
                        />
                      </div>
                      
                      {/* Start Time */}
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs font-medium text-[#606060]">Start Time</Label>
                        <Select value={singleSlotBooking.startTime} onValueChange={(value) => updateSingleSlotBooking('startTime', value)} disabled={!singleSlotBooking.slotId}>
                          <SelectTrigger className="h-9 text-sm mt-1 focus:ring-2 focus:ring-[#FF6B00]/20">
                            <SelectValue placeholder="Start" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableStartTimes(singleSlotBooking.slotId).map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* End Time */}
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs font-medium text-[#606060]">End Time</Label>
                        <Select value={singleSlotBooking.endTime} onValueChange={(value) => updateSingleSlotBooking('endTime', value)} disabled={!singleSlotBooking.startTime}>
                          <SelectTrigger className="h-9 text-sm mt-1 focus:ring-2 focus:ring-[#FF6B00]/20">
                            <SelectValue placeholder="End" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableEndTimes(singleSlotBooking.slotId, singleSlotBooking.startTime).map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Price per Day */}
                      <div className="flex-shrink-0">
                        <Label className="text-xs font-medium text-[#606060]">Price/Day</Label>
                        <div className="h-9 px-3 bg-white border rounded-md text-center font-bold text-lg flex items-center justify-center min-w-[80px] mt-1 text-[#FF6B00]">
                          ${singleSlotBooking.pricePerDay.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* No slots message */}
                {selectedDates.length > 0 && availableSlotsForSelection.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No slots available for the selected date{selectedDates.length > 1 ? 's' : ''}.</p>
                    <p className="text-sm">Please choose different dates.</p>
                  </div>
                )}
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
                  {selectedDates.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-900">
                        Selected Date{selectedDates.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-blue-700 space-y-1">
                        {selectedDates.map(date => (
                          <div key={date} className="text-sm">
                            {new Date(date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {singleSlotBooking.slotId && (
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-semibold text-[#1C1C1C]">Slot Configuration</span>
                        {singleSlotBooking.vehicleNumber && (
                          <div className="text-xs text-[#666]">
                            Vehicle: {singleSlotBooking.vehicleNumber}
                          </div>
                        )}
                        {singleSlotBooking.startTime && singleSlotBooking.endTime && (
                          <div className="text-xs text-[#666]">
                            Time: {singleSlotBooking.startTime} - {singleSlotBooking.endTime}
                          </div>
                        )}
                        <div className="text-xs text-[#666]">
                          ${singleSlotBooking.pricePerDay.toFixed(2)}/day per vehicle
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator className="my-3" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Days:</span>
                      <span>{selectedDates.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vehicles:</span>
                      <span>{vehicleCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per day per vehicle:</span>
                      <span>${singleSlotBooking.pricePerDay.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-[#1C1C1C]">Total:</span>
                    <span className="text-[#FF6B00]">
                      ${getTotalPrice().toFixed(2)}
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
