import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { mockParkingSpots } from '@/data/mockParkingData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from 'react-router-dom';

const FindParking = () => {
  const [priceRange, setPriceRange] = useState<number>(50);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
	const [selectedCity, setSelectedCity] = useState<string>("");
  const navigate = useNavigate();

  const filteredSpots = mockParkingSpots.filter(spot => {
    const cityMatch = !selectedCity || spot.city === selectedCity;
    const priceMatch = spot.price <= priceRange;
    
    let dateMatch = true;
    if (selectedDate) {
      dateMatch = spot.slots.some(slot => 
        slot.availableDates.includes(format(selectedDate, 'yyyy-MM-dd'))
      );
    }

    return cityMatch && priceMatch && dateMatch;
  });

  return (
    <Layout title="Find Parking">
      <div className="space-y-4">
        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-md shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Search Filters</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* City Filter */}
						<div>
							<Label htmlFor="city">City</Label>
							<Select onValueChange={setSelectedCity}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a city" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">All Cities</SelectItem>
									<SelectItem value="austin">Austin</SelectItem>
									<SelectItem value="dallas">Dallas</SelectItem>
									{/* Add more cities as needed */}
								</SelectContent>
							</Select>
						</div>

						{/* Price Range Filter */}
						<div>
							<Label htmlFor="price">Max Price: ${priceRange}</Label>
							<Slider
								id="price"
								defaultValue={[priceRange]}
								max={100}
								step={1}
								onValueChange={(value) => setPriceRange(value[0])}
							/>
						</div>
					</div>

          {/* Date Picker */}
          <div>
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Results Section */}
        <div>
          <h2 className="text-xl font-semibold">
            {filteredSpots.length} Parking Spots Found
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpots.map((spot) => (
              <div key={spot.id} className="bg-white rounded-md shadow-sm overflow-hidden">
                <img src={spot.image} alt={spot.name} className="w-full h-40 object-cover" />
                <div className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{spot.name}</h3>
                  <p className="text-gray-600">{spot.address}</p>
                  <p className="text-gray-700">${spot.price}/hour</p>
                  <Button onClick={() => navigate(`/parking-details/${spot.id}`)} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FindParking;
