
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, DollarSign, Shield, Heart, Award } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We believe in building stronger communities by connecting neighbors and creating shared value.',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: Shield,
      title: 'Safety & Trust',
      description: 'All hosts and seekers are verified. We prioritize the safety and security of our community.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: DollarSign,
      title: 'Fair Pricing',
      description: 'Affordable parking for seekers, fair earnings for hosts. Everyone wins.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Award,
      title: 'Quality Service',
      description: 'We strive for excellence in every interaction and continuously improve our platform.',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200',
      bio: 'Former Airbnb exec passionate about solving urban parking challenges.'
    },
    {
      name: 'Mike Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      bio: 'Tech veteran with 10+ years building scalable marketplace platforms.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Community',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      bio: 'Community builder focused on creating positive experiences for all users.'
    }
  ];

  return (
    <Layout title="About Us">
      <div className="space-y-12">
        {/* Mission Section */}
        <Card className="bg-gradient-to-r from-[#FF6B00]/10 to-[#002F5F]/10 border-none">
          <CardContent className="p-12 text-center">
            <h1 className="text-4xl font-bold text-[#1C1C1C] mb-6">
              Our Mission
            </h1>
            <p className="text-xl text-[#606060] max-w-3xl mx-auto">
              We're making parking more affordable and accessible by connecting people who need parking 
              with those who have extra space. Our platform creates economic opportunities for homeowners 
              while solving parking challenges in Austin and Dallas.
            </p>
          </CardContent>
        </Card>

        {/* Story Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#1C1C1C] mb-6">Our Story</h2>
            <div className="space-y-4 text-[#606060]">
              <p>
                Park In My Driveway was born from a simple observation: there's often unused parking 
                space in residential driveways, while people struggle to find affordable parking 
                near events, offices, and popular destinations.
              </p>
              <p>
                Founded in 2023 in Austin, we started with a vision to create a win-win solution. 
                Homeowners could earn extra income from their unused driveways, while drivers could 
                find convenient, affordable parking close to where they needed to be.
              </p>
              <p>
                Today, we're proud to serve both Austin and Dallas, with hundreds of verified hosts 
                and thousands of satisfied customers. We're just getting started on our mission to 
                revolutionize urban parking.
              </p>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=600" 
              alt="Driveway parking"
              className="rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl font-bold text-[#1C1C1C] text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg ${value.color} flex items-center justify-center`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#606060]">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <Card className="bg-[#002F5F] text-white border-none">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#FF6B00] mb-2">500+</div>
                <div className="text-gray-300">Active Hosts</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FF6B00] mb-2">10K+</div>
                <div className="text-gray-300">Successful Bookings</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FF6B00] mb-2">$500K+</div>
                <div className="text-gray-300">Earned by Hosts</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FF6B00] mb-2">98%</div>
                <div className="text-gray-300">Customer Satisfaction</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-bold text-[#1C1C1C] text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1C1C1C] mb-2">{member.name}</h3>
                  <p className="text-[#FF6B00] font-medium mb-3">{member.role}</p>
                  <p className="text-[#606060] text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-[#FF6B00]/10 to-[#002F5F]/10 border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-[#1C1C1C] mb-4">Get in Touch</h3>
            <p className="text-[#606060] mb-6">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-[#1C1C1C] mb-2">Email</h4>
                <p className="text-[#606060]">support@parkinmydriveway.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#1C1C1C] mb-2">Phone</h4>
                <p className="text-[#606060]">(512) 555-0123</p>
              </div>
              <div>
                <h4 className="font-semibold text-[#1C1C1C] mb-2">Office</h4>
                <p className="text-[#606060]">Austin, TX</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default About;
