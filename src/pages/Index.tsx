
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Car, DollarSign } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-bg to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-8 pb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-10 w-10 text-primary" />
              <span className="text-2xl font-bold text-text-primary">ParkDriveway</span>
            </div>
            <Link to="/login">
              <Button className="btn-primary">Get Started</Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
            Park in Someone's
            <span className="text-primary block">Driveway</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Find affordable parking spaces in residential driveways or list your driveway to earn extra income.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="btn-primary text-lg px-8 py-4">
                <MapPin className="mr-2 h-5 w-5" />
                Find Parking
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="text-lg px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white">
                <DollarSign className="mr-2 h-5 w-5" />
                List Your Driveway
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
              <p className="text-text-secondary">Find parking spots near events, offices, and popular destinations.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Affordable Rates</h3>
              <p className="text-text-secondary">Save money with competitive rates compared to traditional parking.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-text-secondary">Book with confidence through our secure platform.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-white rounded-2xl shadow-card">
          <div className="px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-primary">For Spot Seekers</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <p>Search for parking near your destination</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <p>Book your preferred time slot</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <p>Park safely and securely</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-secondary">For Hosts</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <p>List your driveway with photos and details</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <p>Set your availability and pricing</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="bg-secondary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <p>Earn money from your unused space</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-text-secondary mb-8">Join thousands of users who are already parking smarter.</p>
          <Link to="/login">
            <Button className="btn-primary text-lg px-8 py-4">
              Join ParkDriveway Today
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Index;
