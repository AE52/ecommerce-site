import { Metadata } from 'next'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  Users, 
  Award, 
  Truck, 
  Shield, 
  Heart, 
  Star,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us - Our Story & Mission | E-Commerce Store',
  description: 'Learn about our mission to provide quality products at affordable prices. Founded in 2024, we serve customers worldwide with excellent service and fast shipping.',
  keywords: 'about us, company story, mission, values, customer service, quality products',
  openGraph: {
    title: 'About Us - Our Story & Mission',
    description: 'Learn about our mission to provide quality products at affordable prices with excellent customer service.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
}

const teamMembers = [
  {
    name: 'John Smith',
    role: 'CEO & Founder',
    bio: 'Passionate about creating exceptional shopping experiences.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Operations',
    bio: 'Ensures smooth operations and customer satisfaction.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Michael Chen',
    role: 'Tech Lead',
    bio: 'Builds and maintains our cutting-edge platform.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  }
]

const stats = [
  {
    icon: ShoppingCart,
    label: 'Products Sold',
    value: '10,000+',
    description: 'Happy customers worldwide'
  },
  {
    icon: Users,
    label: 'Active Customers',
    value: '5,000+',
    description: 'Growing community'
  },
  {
    icon: Award,
    label: 'Awards Won',
    value: '15+',
    description: 'Industry recognition'
  },
  {
    icon: Star,
    label: 'Customer Rating',
    value: '4.8/5',
    description: 'Based on reviews'
  }
]

const values = [
  {
    icon: Heart,
    title: 'Customer First',
    description: 'We put our customers at the heart of everything we do, ensuring exceptional service and satisfaction.'
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'We carefully curate our products to ensure only the highest quality items reach our customers.'
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping to get your products to you as fast as possible.'
  }
]

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'E-Commerce Store',
    description: 'A modern e-commerce platform providing quality products at affordable prices',
    url: 'https://yourdomain.com',
    logo: 'https://yourdomain.com/logo.png',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'John Smith'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'support@example.com'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Commerce Street',
      addressLocality: 'Business City',
      addressRegion: 'BC',
      postalCode: '12345',
      addressCountry: 'US'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                About Our Story
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We're on a mission to make quality products accessible to everyone. 
                Founded in 2024, we've grown from a small startup to a trusted 
                e-commerce platform serving customers worldwide.
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="mx-auto h-8 w-8 text-primary mb-4" />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="font-medium text-sm mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We believe everyone deserves access to quality products at fair prices. 
                    Our platform connects customers with carefully curated items from trusted 
                    suppliers around the world.
                  </p>
                  <p>
                    Through technology and exceptional service, we're building a shopping 
                    experience that's convenient, reliable, and enjoyable for everyone.
                  </p>
                </div>
                <div className="mt-8">
                  <Button asChild size="lg">
                    <Link href="/products">
                      Shop Now
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="aspect-video overflow-hidden rounded-lg">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center"
                  alt="Our team working"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core values guide every decision we make and every interaction we have.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <value.icon className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The passionate people behind our success, working every day to serve you better.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-16" />

          {/* Contact Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Mail className="mx-auto h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">support@example.com</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Phone className="mx-auto h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MapPin className="mx-auto h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-sm text-muted-foreground">123 Commerce St<br />Business City, BC 12345</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Clock className="mx-auto h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Hours</h3>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM<br />Weekends: 10AM-4PM</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-muted py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              © 2024 E-Commerce Site. Built with Next.js, shadcn/ui, and Supabase.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
