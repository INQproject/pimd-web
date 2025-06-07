
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

interface Vehicle {
  id: string;
  type: string;
  vehicleNumber: string;
}

interface VehicleDetailsFormProps {
  vehicles: Vehicle[];
  onVehicleChange: (vehicleId: string, field: string, value: string) => void;
}

const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({
  vehicles,
  onVehicleChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5 text-[#FF6B00]" />
          Vehicle Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehicles.map((vehicle, index) => (
          <div key={vehicle.id} className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3 text-gray-900">
              Vehicle {index + 1}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`vehicle-type-${vehicle.id}`}>Vehicle Type</Label>
                <Select 
                  value={vehicle.type} 
                  onValueChange={(value) => onVehicleChange(vehicle.id, 'type', value)}
                >
                  <SelectTrigger id={`vehicle-type-${vehicle.id}`}>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="compact">Compact Car</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`vehicle-number-${vehicle.id}`}>Vehicle Number</Label>
                <Input
                  id={`vehicle-number-${vehicle.id}`}
                  placeholder="Enter license plate"
                  value={vehicle.vehicleNumber}
                  onChange={(e) => onVehicleChange(vehicle.id, 'vehicleNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VehicleDetailsForm;
