
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout title="Contact Us">
      <div className="space-y-12">
        {/* Hero Section */}
        <div 
          className="relative h-64 bg-cover bg-center rounded-2xl overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
              <p className="text-xl">We're here to help with all your parking needs</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Have questions about parking or hosting? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your question or concern..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Multiple ways to reach our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C]">Email</h4>
                    <p className="text-[#606060]">support@parkinmydriveway.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C]">Phone</h4>
                    <p className="text-[#606060]">(512) 555-0123</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C]">Office</h4>
                    <p className="text-[#606060]">Austin, TX & Dallas, TX</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1C1C1C]">Support Hours</h4>
                    <p className="text-[#606060]">Monday - Friday: 8 AM - 8 PM</p>
                    <p className="text-[#606060]">Weekend: 9 AM - 5 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#FF6B00]/10 to-[#002F5F]/10 border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-[#1C1C1C]">Quick Help</h3>
                <p className="text-[#606060] mb-4">
                  For immediate assistance with bookings or technical issues, 
                  check our FAQ section or reach out directly.
                </p>
                <Button 
                  variant="outline"
                  className="border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
                >
                  View FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
