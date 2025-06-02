import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { createLoginRedirect } from '@/utils/authRedirect';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ListDriveway = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    price: '',
    images: [] as File[],
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: [...e.target.files] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., upload to server)
    console.log('Form submitted:', formData);
    toast({
      title: "Driveway Listed",
      description: "Your driveway is pending admin approval.",
    });
  };

  const handleGetStarted = () => {
    if (!user) {
      navigate(createLoginRedirect('listing', '/list-driveway'));
      return;
    }
    // Continue with listing flow
    setShowForm(true);
  };

  return (
    <Layout title="List My Driveway">
      <div className="container mx-auto mt-8">
        {!showForm ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Unlock Your Driveway's Potential</CardTitle>
              <CardDescription>
                Turn your unused space into a revenue stream. List your driveway today!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90" onClick={handleGetStarted}>
                  Get Started
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Driveway Details</CardTitle>
              <CardDescription>
                Enter the details of your driveway to start earning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter driveway address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your driveway (e.g., secure, gated)"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price per Day</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Enter daily price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-sm text-gray-500">Upload up to 3 images of your driveway.</p>
                </div>
                <Button type="submit" className="bg-[#FF6B00] hover:bg-[#FF6B00]/90">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ListDriveway;
