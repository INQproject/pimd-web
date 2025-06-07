
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Shield, Clock, DollarSign, Heart, Award, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Layout title="About Us" showBackButton={true}>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1C1C1C] mb-6">
            Revolutionizing Parking in 
            <span className="text-[#FF6B00] block">Austin & Dallas</span>
          </h1>
          <p className="text-xl text-[#606060] max-w-3xl mx-auto leading-relaxed">
            We're connecting drivers with private parking spaces, making urban parking more affordable, 
            accessible, and community-driven. Join thousands of satisfied users who've discovered a better way to park.
          </p>
        </section>

        {/* Our Story Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#1C1C1C]">Our Story</h2>
            <div className="space-y-4 text-[#606060]">
              <p>
                Founded in 2023, Park In My Driveway was born from a simple observation: cities are full of 
                unused parking spaces while drivers struggle to find affordable parking. We saw an opportunity 
                to create a win-win solution that benefits both property owners and drivers.
              </p>
              <p>
                Starting in Austin and expanding to Dallas, we've built a platform that transforms underutilized 
                driveways, private lots, and residential spaces into convenient parking solutions. Our mission 
                is to reduce urban congestion, lower parking costs, and strengthen local communities.
              </p>
              <p>
                Today, we're proud to serve thousands of users across Texas, facilitating over 10,000 successful 
                parking transactions and helping property owners earn extra income from their unused spaces.
              </p>
            </div>
          </div>
          <div className="lg:order-last">
            <img 
              src="/lovable-uploads/e5aa39fa-383c-4b13-8f5b-c76690ede908.png" 
              alt="Community parking space" 
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card className="bg-[#FF6B00]/5 border-[#FF6B00]/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-[#FF6B00]" />
                <CardTitle className="text-2xl text-[#1C1C1C]">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#606060] leading-relaxed">
                To revolutionize urban parking by creating a sustainable, community-driven platform that 
                connects drivers with affordable parking while helping property owners monetize their unused spaces.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl text-[#1C1C1C]">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#606060] leading-relaxed">
                To become the leading peer-to-peer parking platform across Texas and beyond, fostering 
                stronger communities while reducing urban congestion and environmental impact.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why Choose Us */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1C1C1C] mb-4">Why Choose Park In My Driveway?</h2>
            <p className="text-[#606060] max-w-2xl mx-auto">
              We're more than just a parking app - we're building a community of neighbors helping neighbors.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-[#FF6B00]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">Save Money</h3>
                <p className="text-[#606060]">
                  Pay up to 70% less than traditional parking lots. Find affordable options that fit your budget.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">Prime Locations</h3>
                <p className="text-[#606060]">
                  Park closer to your destination in residential neighborhoods and private properties.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">Safe & Secure</h3>
                <p className="text-[#606060]">
                  All hosts are verified and payments are secure. Park with confidence knowing you're protected.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">24/7 Availability</h3>
                <p className="text-[#606060]">
                  Book parking anytime, anywhere. Our platform is available round the clock for your convenience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">Community Driven</h3>
                <p className="text-[#606060]">
                  Join a growing community of hosts and drivers creating positive neighborhood connections.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#1C1C1C]">Easy to Use</h3>
                <p className="text-[#606060]">
                  Simple booking process, clear communication, and hassle-free parking experiences every time.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-[#002F5F] rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact by the Numbers</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              See how we're making a difference in the communities we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">500+</div>
              <div className="text-lg text-blue-200">Active Hosts</div>
              <div className="text-sm text-blue-300">Property owners earning extra income</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">10K+</div>
              <div className="text-lg text-blue-200">Successful Bookings</div>
              <div className="text-sm text-blue-300">Parking transactions completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">98%</div>
              <div className="text-lg text-blue-200">Customer Satisfaction</div>
              <div className="text-sm text-blue-300">Based on user reviews and ratings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">$2M+</div>
              <div className="text-lg text-blue-200">Community Earnings</div>
              <div className="text-sm text-blue-300">Generated for local hosts</div>
            </div>
          </div>
        </section>

        {/* Team Values */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1C1C1C] mb-4">Our Values</h2>
            <p className="text-[#606060] max-w-2xl mx-auto">
              These core principles guide everything we do and shape our company culture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-[#FF6B00]" />
              </div>
              <h3 className="font-semibold text-[#1C1C1C]">Community First</h3>
              <p className="text-sm text-[#606060]">We prioritize building strong, supportive communities</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-[#1C1C1C]">Trust & Safety</h3>
              <p className="text-sm text-[#606060]">Security and trust are fundamental to our platform</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-[#1C1C1C]">Innovation</h3>
              <p className="text-sm text-[#606060]">We continuously improve and innovate our solutions</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-[#1C1C1C]">Customer Care</h3>
              <p className="text-sm text-[#606060]">Every user experience matters to us</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-[#FF6B00] to-[#FF8533] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            Whether you're looking for parking or want to list your space, we're here to help you get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-parking">
              <Button size="lg" variant="secondary" className="bg-white text-[#FF6B00] hover:bg-gray-100">
                <MapPin className="mr-2 h-5 w-5" />
                Find Parking
              </Button>
            </Link>
            <Link to="/list-driveway">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#FF6B00]">
                <DollarSign className="mr-2 h-5 w-5" />
                List Your Space
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
