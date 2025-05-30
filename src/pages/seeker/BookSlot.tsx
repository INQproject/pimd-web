
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar as CalendarIcon, DollarSign, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const mockTimeSlots = [
  { id: 1, time: '9:00 AM - 11:00 AM', price: 24, available: true },
  { id: 2, time: '11:00 AM - 1:00 PM', price: 24, available: true },
  { id: 3, time: '1:00 PM - 3:00 PM', price: 24, available: false },
  { id: 4, time: '3:00 PM - 5:00 PM', price: 30, available: true },
  { id: 5, time: '5:00 PM - 7:00 PM', price: 30, available: true },
  { id: 6, time: '7:00 PM - 9:00 PM', price: 20, available: true },
];

const parkingSpotDetails = {
  name: 'Downtown Driveway - Sarah\'s Place',
  address: '123 Main St, Downtown LA',
  description: 'Secure driveway parking near the business district. Easy access and well-lit area.',
  amenities: ['24/7 Access', 'CCTV Security', 'Well-lit', 'Easy Access'],
  image: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=600',
  hourlyRate: 12, // Base hourly rate
};

const durationOptions = [
  { value: '0.5', label: '30 minutes' },
  { value: '1', label: '1 hour' },
  { value: '1.5', label: '1.5 hours' },
  { value: '2', label: '2 hours' },
  { value: '2.5', label: '2.5 hours' },
  { value: '3', label: '3 hours' },
  { value: '4', label: '4 hours' },
  { value: '6', label: '6 hours' },
  { value: '8', label: '8 hours' },
];

const BookSlot = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Custom time selection states
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [customSlotAvailable, setCustomSlotAvailable] = useState<boolean | null>(null);
  const [customSlotPrice, setCustomSlotPrice] = useState(0);
  const [usingCustomSlot, setUsingCustomSlot] = useState(false);
  
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  const getSelectedSlotData = () => {
    if (usingCustomSlot && customSlotAvailable) {
      const endTime = calculateEndTime(startTime, parseFloat(duration));
      return {
        id: 'custom',
        time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
        price: customSlotPrice,
        available: true
      };
    }
    return selectedSlot ? mockTimeSlots.find(slot => slot.id === selectedSlot) : null;
  };

  const selectedSlotData = getSelectedSlotData();
  const serviceFee = selectedSlotData ? Math.round(selectedSlotData.price * 0.1) : 0;
  const total = selectedSlotData ? selectedSlotData.price + serviceFee : 0;

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
    setUsingCustomSlot(false);
  };

  const handleCheckAvailability = () => {
    if (!customDate || !startTime || !duration) {
      toast({
        title: "Missing Information",
        description: "Please select date, start time, and duration.",
        variant: "destructive"
      });
      return;
    }

    // Calculate price based on duration and hourly rate
    const durationHours = parseFloat(duration);
    const calculatedPrice = Math.round(parkingSpotDetails.hourlyRate * durationHours);
    
    // Simulate availability check (90% chance available)
    const isAvailable = Math.random() > 0.1;
    
    setCustomSlotAvailable(isAvailable);
    setCustomSlotPrice(calculatedPrice);
    
    if (isAvailable) {
      setUsingCustomSlot(true);
      setSelectedSlot(null);
      toast({
        title: "Slot Available!",
        description: `Parking available for ${duration} hour${parseFloat(duration) !== 1 ? 's' : ''} at $${calculatedPrice}`,
      });
    } else {
      toast({
        title: "Not Available",
        description: "No parking available for this duration. Please try a different time or choose from available slots below.",
        variant: "destructive"
      });
    }
  };

  const calculateEndTime = (startTimeStr: string, durationHours: number) => {
    if (!startTimeStr) return '';
    
    const [time, period] = startTimeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = (hours % 12) * 60 + minutes;
    if (period === 'PM' && hours !== 12) totalMinutes += 12 * 60;
    if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
    
    totalMinutes += durationHours * 60;
    
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMins = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleProceedToPayment = () => {
    if (selectedSlotData) {
      setShowPayment(true);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      setShowPayment(false);
      setShowSuccess(true);
      toast({
        title: "Booking Confirmed!",
        description: "Your parking spot has been reserved successfully.",
      });
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate('/bookings');
  };

  return (
    <Layout title="Book Parking Slot">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/events')}
        className="mb-4 p-2 hover:bg-gray-100"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
        {/* Spot Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-shadow">
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <img 
                src={parkingSpotDetails.image} 
                alt={parkingSpotDetails.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{parkingSpotDetails.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{parkingSpotDetails.address}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary mb-4">{parkingSpotDetails.description}</p>
              <div>
                <h4 className="font-semibold mb-2">Amenities:</h4>
                <div className="flex flex-wrap gap-2">
                  {parkingSpotDetails.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Time Selection */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Custom Time Selection</CardTitle>
              <CardDescription>Choose your preferred parking duration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDate ? format(customDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customDate}
                        onSelect={setCustomDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCheckAvailability}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Check Availability
              </Button>

              {customSlotAvailable === false && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                  No parking available for this duration.
                </div>
              )}

              {customSlotAvailable === true && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <div className="font-semibold">Available!</div>
                  <div>Time: {formatTime(startTime)} - {formatTime(calculateEndTime(startTime, parseFloat(duration)))}</div>
                  <div>Price: ${customSlotPrice} ({duration} hour{parseFloat(duration) !== 1 ? 's' : ''})</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Time Slots */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
              <CardDescription>Or choose from pre-set time slots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {mockTimeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      !slot.available 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
                        : selectedSlot === slot.id && !usingCustomSlot
                          ? 'border-primary bg-primary/10' 
                          : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => slot.available && handleSlotSelect(slot.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{slot.time}</div>
                        <div className="text-sm text-text-secondary">
                          {slot.available ? 'Available' : 'Booked'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">${slot.price}</div>
                        <div className="text-xs text-text-secondary">2 hours</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="card-shadow sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSlotData ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Time Slot:</span>
                      <span className="font-semibold">{selectedSlotData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Parking Fee:</span>
                      <span>${selectedSlotData.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee:</span>
                      <span>${serviceFee}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">${total}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleProceedToPayment}
                    className="w-full btn-primary"
                  >
                    Proceed to Payment
                  </Button>
                </>
              ) : (
                <div className="text-center text-text-secondary py-8">
                  Select a time slot to see pricing
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Complete your booking by providing payment information
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentForm.expiryDate}
                  onChange={(e) => setPaymentForm({...paymentForm, expiryDate: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentForm.cvv}
                  onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                placeholder="John Doe"
                value={paymentForm.nameOnCard}
                onChange={(e) => setPaymentForm({...paymentForm, nameOnCard: e.target.value})}
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary">${total}</span>
              </div>
            </div>

            <Button type="submit" className="w-full btn-primary">
              Confirm Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Booking Confirmed!</DialogTitle>
            <DialogDescription>
              Your parking spot has been successfully reserved
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">Booking Details:</h4>
              <p className="text-green-700">{selectedSlotData?.time}</p>
              <p className="text-green-700">{parkingSpotDetails.address}</p>
              <p className="text-green-700">Booking ID: #PD{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            
            <Button onClick={handleCloseSuccess} className="w-full btn-primary">
              View My Bookings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BookSlot;
