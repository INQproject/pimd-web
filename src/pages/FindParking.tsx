import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { createLoginRedirect } from '@/utils/authRedirect';

interface ParkingSpot {
  id: number;
  name: string;
  address: string;
  price: number;
  availability: string;
}

const mockParkingSpots: ParkingSpot[] = [
  {
    id: 1,
    name: 'Downtown Parking Spot',
    address: '123 Main St, Austin, TX',
    price: 15.00,
    availability: '24/7',
  },
  {
    id: 2,
    name: 'South Congress Parking',
    address: '456 S Congress Ave, Austin, TX',
    price: 12.50,
    availability: 'Mon-Fri, 9am-5pm',
  },
  {
    id: 3,
    name: 'Zilker Park Spot',
    address: '2100 Barton Springs Rd, Austin, TX',
    price: 10.00,
    availability: 'Weekends only',
  },
];

const FindParking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const [filteredSpots, setFilteredSpots] = useState(mockParkingSpots);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
	const [date, setDate] = React.useState<Date | undefined>(new Date())

  useEffect(() => {
    const filtered = mockParkingSpots.filter(spot =>
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSpots(filtered);
  }, [searchTerm]);

  useEffect(() => {
    let sortedSpots = [...filteredSpots];
    if (selectedSort === 'price-asc') {
      sortedSpots.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-desc') {
      sortedSpots.sort((a, b) => b.price - a.price);
    }
    setFilteredSpots(sortedSpots);
  }, [selectedSort, filteredSpots]);

  const handleBookSpot = (spot: ParkingSpot) => {
    if (!user) {
      navigate(createLoginRedirect('booking', '/find-parking'));
      return;
    }
    setSelectedSpot(spot);
    setIsBookingModalOpen(true);
  };

  const closeModal = () => {
    setIsBookingModalOpen(false);
    setSelectedSpot(null);
  };

  const confirmBooking = () => {
    // Implement booking logic here
    alert('Booking confirmed!');
    closeModal();
    navigate(`/book-slot/${selectedSpot?.id}`);
  };

  return (
    <Layout title="Find Parking">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <Input
            type="text"
            placeholder="Search for parking spots"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select onValueChange={setSelectedSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpots.map(spot => (
            <Card key={spot.id}>
              <CardHeader>
                <CardTitle>{spot.name}</CardTitle>
                <CardDescription>{spot.address}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Price: ${spot.price.toFixed(2)}</p>
                <p>Availability: {spot.availability}</p>
                <Button onClick={() => handleBookSpot(spot)} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90">Book Parking</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              {selectedSpot ? `You are booking ${selectedSpot.name} at ${selectedSpot.address}.` : 'No spot selected.'}
							<br/>
							Select a date to continue.
            </DialogDescription>
          </DialogHeader>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"w-[240px] justify-start text-left font-normal",
									!date && "text-muted-foreground"
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{date ? format(date, "PPP") : <span>Pick a date</span>}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="center" side="bottom">
							<Calendar
								mode="single"
								selected={date}
								onSelect={setDate}
								disabled={(date) =>
									date < new Date()
								}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmBooking} disabled={!date}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default FindParking;
