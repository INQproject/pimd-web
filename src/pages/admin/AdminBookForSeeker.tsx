
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Users, Calendar, MapPin, Car, CheckCircle } from 'lucide-react';

const AdminBookForSeeker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    seekerId: '',
    bookingType: 'event',
    eventId: '',
    customDate: '',
    customTime: '',
    slotId: '',
    paymentStatus: 'paid',
    notes: ''
  });

  // Mock data
  const seekers = [
    { id: 1, name: 'John Smith', email: 'john@example.com' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Emma Davis', email: 'emma@example.com' }
  ];

  const events = [
    { id: 1, title: 'Downtown Music Festival', date: '2024-02-15', location: 'Downtown Square' },
    { id: 2, title: 'Tech Conference 2024', date: '2024-02-20', location: 'Convention Center' },
    { id: 3, title: 'Food Truck Rally', date: '2024-02-25', location: 'City Park' }
  ];

  const parkingSlots = [
    { id: 1, title: 'Downtown Parking Spot', host: 'Sarah Johnson', price: 15, distance: '0.2 miles' },
    { id: 2, title: 'Mall Parking Space', host: 'Mike Chen', price: 12, distance: '0.5 miles' },
    { id: 3, title: 'University Campus Parking', host: 'David Brown', price: 10, distance: '0.8 miles' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Booking Created Successfully",
      description: "Admin booking has been created and marked as 'Created by Admin'.",
    });
    
    // Reset form
    setCurrentStep(1);
    setBookingData({
      seekerId: '',
      bookingType: 'event',
      eventId: '',
      customDate: '',
      customTime: '',
      slotId: '',
      paymentStatus: 'paid',
      notes: ''
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Select Spot Seeker';
      case 2: return 'Choose Event or Custom Date';
      case 3: return 'Select Parking Slot';
      case 4: return 'Confirm Booking';
      default: return 'Admin Booking';
    }
  };

  return (
    <AdminLayout title="Admin Booking for Spot Seekers">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-xl font-semibold">{getStepTitle()}</h2>
          </CardContent>
        </Card>

        {/* Step 1: Select Seeker */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Select Spot Seeker</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seekers.map((seeker) => (
                  <div
                    key={seeker.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      bookingData.seekerId === seeker.id.toString() 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBookingData({...bookingData, seekerId: seeker.id.toString()})}
                  >
                    <h3 className="font-medium">{seeker.name}</h3>
                    <p className="text-sm text-gray-600">{seeker.email}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Event or Custom Date */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Choose Event or Custom Date</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex space-x-4">
                <Button
                  variant={bookingData.bookingType === 'event' ? 'default' : 'outline'}
                  onClick={() => setBookingData({...bookingData, bookingType: 'event'})}
                >
                  Event Booking
                </Button>
                <Button
                  variant={bookingData.bookingType === 'custom' ? 'default' : 'outline'}
                  onClick={() => setBookingData({...bookingData, bookingType: 'custom'})}
                >
                  Custom Date/Time
                </Button>
              </div>

              {bookingData.bookingType === 'event' && (
                <div className="space-y-4">
                  <h3 className="font-medium">Select Event:</h3>
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        bookingData.eventId === event.id.toString()
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setBookingData({...bookingData, eventId: event.id.toString()})}
                    >
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.date} | {event.location}</p>
                    </div>
                  ))}
                </div>
              )}

              {bookingData.bookingType === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customDate">Date</Label>
                    <Input
                      id="customDate"
                      type="date"
                      value={bookingData.customDate}
                      onChange={(e) => setBookingData({...bookingData, customDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customTime">Time</Label>
                    <Input
                      id="customTime"
                      type="time"
                      value={bookingData.customTime}
                      onChange={(e) => setBookingData({...bookingData, customTime: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Select Parking Slot */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="h-5 w-5" />
                <span>Select Parking Slot</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parkingSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      bookingData.slotId === slot.id.toString()
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBookingData({...bookingData, slotId: slot.id.toString()})}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{slot.title}</h4>
                        <p className="text-sm text-gray-600">Host: {slot.host}</p>
                        <p className="text-sm text-gray-600">Distance: {slot.distance}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${slot.price}/hr</p>
                        <Badge variant="outline" className="text-green-600">Available</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirm Booking */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Booking Summary:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Seeker:</strong> {seekers.find(s => s.id.toString() === bookingData.seekerId)?.name}</p>
                    <p><strong>Type:</strong> {bookingData.bookingType === 'event' ? 'Event Booking' : 'Custom Booking'}</p>
                    {bookingData.bookingType === 'event' && (
                      <p><strong>Event:</strong> {events.find(e => e.id.toString() === bookingData.eventId)?.title}</p>
                    )}
                    {bookingData.bookingType === 'custom' && (
                      <p><strong>Date/Time:</strong> {bookingData.customDate} at {bookingData.customTime}</p>
                    )}
                    <p><strong>Parking Slot:</strong> {parkingSlots.find(s => s.id.toString() === bookingData.slotId)?.title}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment & Notes:</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Payment Status</Label>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={bookingData.paymentStatus}
                        onChange={(e) => setBookingData({...bookingData, paymentStatus: e.target.value})}
                      >
                        <option value="paid">Paid</option>
                        <option value="offline">Offline Payment</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Admin Notes (Optional)</Label>
                      <textarea
                        id="notes"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows={3}
                        placeholder="Add any additional notes..."
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !bookingData.seekerId) ||
                (currentStep === 2 && bookingData.bookingType === 'event' && !bookingData.eventId) ||
                (currentStep === 2 && bookingData.bookingType === 'custom' && (!bookingData.customDate || !bookingData.customTime)) ||
                (currentStep === 3 && !bookingData.slotId)
              }
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Create Booking
            </Button>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookForSeeker;
