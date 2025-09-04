'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, BookOpen, AlertTriangle, Users, Phone, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <div className="absolute inset-0 bg-orange-500 rounded-full flex items-center justify-center">
                <Shield className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Disaster Management Education Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Empowering Indian schools and colleges with interactive disaster preparedness training,
            virtual drills, and life-saving emergency protocols
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700" onClick={navigateToDashboard}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.location.href = '/preview'}>
              View Preview
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Challenge
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Indian educational institutions face critical gaps in disaster preparedness
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                <CardTitle>Lack of Awareness</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Students and staff are often unaware of region-specific disaster protocols and emergency procedures
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-orange-500 mb-2" />
                <CardTitle>Insufficient Training</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manual drills are infrequent and poorly coordinated, failing to instill practical preparedness skills
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <MapPin className="w-8 h-8 text-yellow-500 mb-2" />
                <CardTitle>Regional Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Many students lack knowledge of how to react during disasters specific to their geographic region
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Solution
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              A comprehensive digital platform designed to build disaster-resilient educational communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Interactive Education</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Engaging modules covering earthquake, flood, and fire safety protocols with region-specific content
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="secondary">Self-paced Learning</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-10 h-10 text-green-600 mb-2" />
                <CardTitle>Virtual Drills</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simulated disaster scenarios that train students and staff on proper emergency response procedures
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="secondary">Practice Anytime</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <AlertTriangle className="w-10 h-10 text-red-600 mb-2" />
                <CardTitle>Real-time Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Region-specific emergency notifications and early warning systems integrated with local authorities
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="secondary">Stay Informed</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Phone className="w-10 h-10 text-purple-600 mb-2" />
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive directory of emergency services, disaster response teams, and institutional contacts
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="secondary">Quick Access</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-10 h-10 text-indigo-600 mb-2" />
                <CardTitle>Communication Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time communication platform for coordinating emergency responses and sharing critical information
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="secondary">Stay Connected</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="w-10 h-10 text-teal-600 mb-2" />
                <CardTitle>Localized Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tailored disaster management strategies based on geographic location and regional risk factors
                </CardDescription>
                <div className="mt-4">
                  <Badge variant="secondary">Region-specific</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expected Impact
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Building a safer, more resilient educational ecosystem across India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">50M+</div>
              <div className="text-gray-700">Students Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100K+</div>
              <div className="text-gray-700">Schools Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">90%</div>
              <div className="text-gray-700">Awareness Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-700">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Movement for Safer Schools
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Partner with us to create disaster-resilient educational institutions across India
          </p>
          <Button size="lg" variant="secondary" className="text-orange-600">
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  )
}