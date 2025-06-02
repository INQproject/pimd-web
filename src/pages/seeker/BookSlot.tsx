import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, DollarSign, ArrowLeft, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CustomTimeBookingModal from '@/components/CustomTimeBookingModal';

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
};

const BookSlot = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [customBooking, setCustomBooking] = useState<{
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
  } | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  const selectedSlotData = selectedSlot ? mockTimeSlots.find(slot => slot.id === selectedSlot) : null;
  const displayPrice = customBooking ? customBooking.price : selectedSlotData?.price || 0;
  const serviceFee = Math.round(displayPrice * 0.1);
  const total = displayPrice + serviceFee;

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
    setCustomBooking(null); // Reset custom booking when selecting a regular slot
  };

  const handleCustomTimeClick = (slotId: number) => {
    setSelectedSlot(slotId);
    setShowCustomTime(true);
  };

  const handleCustomTimeConfirm = (booking: {
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
  }) => {
    setCustomBooking(booking);
    setShowCustomTime(false);
  };

  const handleProceedToPayment = () => {
    if (selectedSlot) {
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
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/events')}
          className="flex items-center space-x-2 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Button>
      </div>

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

          {/* Available Time Slots */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
              <CardDescription>Select your preferred parking time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {mockTimeSlots.map((slot) => (
                  <div key={slot.id} className="space-y-3">
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        !slot.available 
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50' 
                          : selectedSlot === slot.id && !customBooking
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
                    
                    {/* Custom Time Button */}
                    {slot.available && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCustomTimeClick(slot.id)}
                        className="w-full flex items-center space-x-2"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Book Custom Time</span>
                      </Button>
                    )}
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
              {selectedSlot ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Time Slot:</span>
                      <span className="font-semibold">{displayTimeRange}</span>
                    </div>
                    {customBooking && (
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{customBooking.duration} hour{customBooking.duration > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Parking Fee:</span>
                      <span>${displayPrice}</span>
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

      {/* Custom Time Booking Modal */}
      {selectedSlotData && (
        <CustomTimeBookingModal
          open={showCustomTime}
          onOpenChange={setShowCustomTime}
          slot={selectedSlotData}
          onConfirm={handleCustomTimeConfirm}
        />
      )}

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
