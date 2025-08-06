import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Search, Navigation, Fuel, Wrench, Utensils, Users } from "lucide-react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Map() {
  const [, navigate] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");

  const { data: tours } = useQuery({
    queryKey: ['/api/tours'],
  });

  const activeTours = tours?.filter((tour: any) => tour.status === 'active') || [];

  const mockPlaces = [
    { id: 1, name: "Shell Gas Station", type: "fuel", distance: "2.3 miles", lat: 37.7749, lng: -122.4194 },
    { id: 2, name: "Mike's Motorcycle Repair", type: "repair", distance: "1.8 miles", lat: 37.7849, lng: -122.4094 },
    { id: 3, name: "Highway Diner", type: "food", distance: "0.5 miles", lat: 37.7649, lng: -122.4294 },
    { id: 4, name: "Biker's Rest Stop", type: "food", distance: "3.1 miles", lat: 37.7549, lng: -122.4394 },
  ];

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'fuel': return <Fuel className="h-4 w-4 text-blue-500" />;
      case 'repair': return <Wrench className="h-4 w-4 text-green-500" />;
      case 'food': return <Utensils className="h-4 w-4 text-orange-500" />;
      default: return <MapPin className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="p-2"
                data-testid="button-back-home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Live Map</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                data-testid="button-share-location"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Share Location
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-96 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardContent className="p-0 h-full">
                <div className="w-full h-full rounded-lg flex flex-col relative overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
                  {/* Google Maps Style Grid */}
                  <div className="absolute inset-0">
                    {/* Grid lines */}
                    <svg className="w-full h-full opacity-30" viewBox="0 0 400 400">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-400 dark:text-gray-600"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    
                    {/* Simulated Roads */}
                    <div className="absolute top-0 left-0 w-full h-full">
                      <div className="absolute top-1/4 left-0 w-full h-2 bg-gray-300 dark:bg-gray-600 opacity-60"></div>
                      <div className="absolute top-0 left-1/3 w-2 h-full bg-gray-300 dark:bg-gray-600 opacity-60"></div>
                      <div className="absolute top-3/4 left-0 w-full h-2 bg-gray-300 dark:bg-gray-600 opacity-60"></div>
                      <div className="absolute top-0 left-2/3 w-2 h-full bg-gray-300 dark:bg-gray-600 opacity-60"></div>
                    </div>
                  </div>
                  
                  {/* Live Tour Markers with Bike Icons */}
                  <div className="absolute top-16 left-16">
                    <div className="relative">
                      <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                        <span className="text-white text-xs font-bold">🚴</span>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg border">
                          Mountain Trail Tour (5 riders)
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-32 right-24">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                        <span className="text-white text-xs font-bold">🚴</span>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg border">
                          Coastal Ride (3 riders)
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-24 left-32">
                    <div className="relative">
                      <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                        <span className="text-white text-xs font-bold">🚴</span>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg border">
                          City Tour (8 riders)
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <Button size="sm" className="w-8 h-8 p-0 bg-white dark:bg-gray-800 border shadow-md">+</Button>
                    <Button size="sm" className="w-8 h-8 p-0 bg-white dark:bg-gray-800 border shadow-md">-</Button>
                  </div>
                  
                  {/* Current Location */}
                  <div className="absolute bottom-16 right-16">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  
                  {/* Status Bar */}
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Live</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">16 Active Riders</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Location */}
            <Card className="mt-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Find Rider</h3>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Search for rider by name..."
                      className="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      data-testid="input-search-rider"
                    />
                  </div>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    data-testid="button-search-rider"
                  >
                    Find
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Tours */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Active Tours</h4>
                <div className="space-y-3">
                  {activeTours.length > 0 ? (
                    activeTours.map((tour: any) => (
                      <div key={tour.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800 text-sm" data-testid={`text-active-tour-${tour.id}`}>
                            {tour.title}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{tour.memberCount} riders</span>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white text-xs">Live</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No active tours right now</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Nearby Places */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Nearby Places</h4>
                <div className="space-y-3">
                  {mockPlaces.map((place) => (
                    <div key={place.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" data-testid={`card-place-${place.id}`}>
                      {getPlaceIcon(place.type)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{place.name}</p>
                        <p className="text-xs text-gray-500">{place.distance}</p>
                      </div>
                      <Button variant="outline" size="sm" data-testid={`button-navigate-${place.id}`}>
                        Navigate
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <h4 className="font-bold text-red-800 mb-4">Emergency</h4>
                <div className="space-y-2">
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white" data-testid="button-emergency-call">
                    Call 911
                  </Button>
                  <Button variant="outline" className="w-full border-red-300 text-red-700" data-testid="button-roadside-assistance">
                    Roadside Assistance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}