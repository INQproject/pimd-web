
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Calendar, MapPin, Plus, Edit, Trash2, Users } from 'lucide-react';

const AdminEvents = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    capacity: ''
  });

  // Mock events data
  const events = [
    {
      id: 1,
      title: 'Downtown Music Festival',
      description: 'Annual downtown music festival with local and international artists',
      date: '2024-02-15',
      startTime: '18:00',
      endTime: '23:00',
      location: 'Downtown Square, 123 Main St',
      capacity: 500,
      bookings: 127,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Tech Conference 2024',
      description: 'Technology conference featuring latest innovations',
      date: '2024-02-20',
      startTime: '09:00',
      endTime: '17:00',
      location: 'Convention Center, 456 Tech Ave',
      capacity: 300,
      bookings: 289,
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Food Truck Rally',
      description: 'Local food trucks gathering with live entertainment',
      date: '2024-01-20',
      startTime: '12:00',
      endTime: '20:00',
      location: 'City Park, 789 Park Rd',
      capacity: 200,
      bookings: 156,
      status: 'completed'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Event Created",
      description: "New event has been successfully created.",
    });
    setShowAddForm(false);
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      capacity: ''
    });
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Event Deleted",
      description: "The event has been successfully deleted.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Manage Events">
      <div className="space-y-6">
        {/* Add Event Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Events Management</h2>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Event
          </Button>
        </div>

        {/* Add Event Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Event Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter event location address"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">Create Event</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>All Events ({events.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(event.status)}
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{event.date} | {event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{event.bookings}/{event.capacity} attendees</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
