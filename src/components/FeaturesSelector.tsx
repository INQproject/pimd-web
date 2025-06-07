
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Clock } from 'lucide-react';

interface FeaturesSelectorProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
}

const FeaturesSelector: React.FC<FeaturesSelectorProps> = ({
  selectedFeatures,
  onFeaturesChange
}) => {
  const features = [
    { id: '24/7', label: '24/7', icon: Clock },
    { id: 'CCTV', label: 'CCTV', icon: Eye },
    { id: 'WELL-LIT', label: 'WELL-LIT', icon: Shield },
  ];

  const handleFeatureToggle = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      onFeaturesChange(selectedFeatures.filter(f => f !== featureId));
    } else {
      onFeaturesChange([...selectedFeatures, featureId]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tap to select FEATURES</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={`feature-${feature.id}`}
                  checked={selectedFeatures.includes(feature.id)}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-4 w-4 text-[#FF6B00]" />
                  <Label 
                    htmlFor={`feature-${feature.id}`} 
                    className="text-sm font-medium cursor-pointer"
                  >
                    {feature.label}
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
        {selectedFeatures.length > 0 && (
          <div className="mt-4 p-3 bg-[#FF6B00]/10 rounded-lg">
            <p className="text-sm font-medium text-[#FF6B00]">
              Selected: {selectedFeatures.join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturesSelector;
