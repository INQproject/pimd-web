
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import AdvancedCalendar from '@/components/AdvancedCalendar';
import { mockParkingSpots } from '@/data/mockParkingData';
import { toast } from '@/hooks/use-toast';

interface Slot {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  status: 'available' | 'booked' | 'disabled';
}

interface DaySlots {
  [key: string]: Slot[];
}

const ManageAvailability = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [initialSlots, setInitialSlots] = useState<DaySlots>({});

  useEffect(() => {
    // Mock data for existing slots
    const mockSlots: DaySlots = {
      '2024-01-15': [
        { id: '1', title: 'Front Yard', startTime: '09:00', endTime: '17:00', capacity: 3, booked: 1, status: 'available' },
        { id: '2', title: 'Main Driveway', startTime: '08:00', endTime: '18:00', capacity: 2, booked: 2, status: 'booked' }
      ],
      '2024-01-16': [
        { id: '3', title: 'Front Yard', startTime: '09:00', endTime: '17:00', capacity: 3, booked: 0, status: 'available' }
      ],
      '2024-01-17': [
        { id: '4', title: 'Main Driveway', startTime: '08:00', endTime: '18:00', capacity: 2, booked: 0, status: 'disabled' }
      ],
    };
    setInitialSlots(mockSlots);
  }, []);

  const handleSlotsChange = (slots: DaySlots) => {
    console.log('Slots updated:', slots);
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Availability updated successfully",
    });
    navigate('/profile');
  };

  const spot = mockParkingSpots.find(s => s.id.toString() === listingId);

  if (!spot) {
    navigate('/find-parking');
    return null;
  }

  if (!user) {
    navigate('/login', {
      state: {
        returnTo: `/manage-availability/${listingId}`,
        context: 'manage-availability'
      }
    });
    return null;
  }

  return (
    <Layout title="Manage Availability" showBackButton={true}>
      <AdvancedCalendar
        initialSlots={initialSlots}
        onSlotsChange={handleSlotsChange}
        onSave={handleSave}
        showHeader={true}
        compactMode={false}
      />
    </Layout>
  );
};

export default ManageAvailability;
