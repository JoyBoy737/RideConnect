import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TourCard } from "@/components/ui/tour-card";
import { TourCreationModal } from "@/components/ui/tour-creation-modal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Search, 
  Bike, 
  Plus, 
  MapPin, 
  Camera, 
  Bell, 
  AlertTriangle,
  Compass,
  Route,
  Map,
  MessageCircle,
  User,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "wouter";

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notificationCount] = useState(3);
  const [, navigate] = useLocation();
  const isMobile = useIsMobile();

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: tours, isLoading } = useQuery({
    queryKey: ['/api/tours'],
  });

  const { data: communityPosts } = useQuery({
    queryKey: ['/api/community-posts'],
  });

  const handleSOS = () => {
    alert('SOS Alert would be triggered - Emergency services notified!');
  };

  const handleNotifications = () => {
    alert(`You have ${notificationCount} new notifications:\n- New tour near you: "Mountain Adventure"\n- Someone joined your tour\n- New message in "Coastal Ride"`);
  };

  const handleToursNearMe = () => {
    navigate('/map');
  };

  const handleShareJourney = () => {
    navigate('/community');
  };

  const recentPosts = (communityPosts as any[])?.slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bike className="text-orange-500 text-2xl h-8 w-8" />
                <h1 className="text-xl font-bold text-gray-800">RideRoute</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => navigate('/')}
                className="text-orange-500 font-medium border-b-2 border-orange-500 pb-4"
                data-testid="nav-discover"
              >
                Discover
              </button>
              <button 
                onClick={() => navigate('/my-tours')}
                className="text-gray-600 hover:text-orange-500 transition-colors pb-4"
                data-testid="nav-my-tours"
              >
                My Tours
              </button>
              <button 
                onClick={() => navigate('/community')}
                className="text-gray-600 hover:text-orange-500 transition-colors pb-4"
                data-testid="nav-community"
              >
                Community
              </button>
              <button 
                onClick={() => navigate('/map')}
                className="text-gray-600 hover:text-orange-500 transition-colors pb-4"
                data-testid="nav-map"
              >
                Map
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handleNotifications}
                className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors" 
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              
              <Button 
                onClick={handleSOS}
                className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200 transform hover:scale-105"
                data-testid="button-sos"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                SOS
              </Button>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                  data-testid="button-profile"
                >
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200" data-testid="text-username">
                    {(user as any)?.firstName || 'User'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-5 py-2">
            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center py-2 text-orange-500" 
              data-testid="button-mobile-discover"
            >
              <Compass className="h-5 w-5 mb-1" />
              <span className="text-xs">Discover</span>
            </button>
            <button 
              onClick={() => navigate('/my-tours')}
              className="flex flex-col items-center py-2 text-gray-400 hover:text-orange-500" 
              data-testid="button-mobile-tours"
            >
              <Route className="h-5 w-5 mb-1" />
              <span className="text-xs">My Tours</span>
            </button>
            <button 
              onClick={() => navigate('/map')}
              className="flex flex-col items-center py-2 text-gray-400 hover:text-orange-500" 
              data-testid="button-mobile-map"
            >
              <Map className="h-5 w-5 mb-1" />
              <span className="text-xs">Map</span>
            </button>
            <button 
              onClick={() => navigate('/community')}
              className="flex flex-col items-center py-2 text-gray-400 hover:text-orange-500" 
              data-testid="button-mobile-chat"
            >
              <MessageCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Community</span>
            </button>
            <button 
              onClick={() => navigate('/community')}
              className="flex flex-col items-center py-2 text-gray-400 hover:text-orange-500" 
              data-testid="button-mobile-share"
            >
              <Camera className="h-5 w-5 mb-1" />
              <span className="text-xs">Share</span>
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Hero Section */}
        <section className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Find Your Next Adventure</h2>
            <p className="text-gray-600 dark:text-gray-400">Connect with fellow riders and explore epic routes together</p>
          </div>
          
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                type="text" 
                placeholder="Search destinations, routes, or tour groups..." 
                className="pl-12"
                data-testid="input-search"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              data-testid="button-create-tour"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Tour
            </Button>
            <Button 
              variant="outline"
              onClick={handleToursNearMe}
              data-testid="button-tours-nearby"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Tours Near Me
            </Button>
            <Button 
              variant="outline"
              onClick={handleShareJourney}
              data-testid="button-share-journey"
            >
              <Camera className="h-4 w-4 mr-2" />
              Share Journey
            </Button>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tour Discovery */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Upcoming Tours</h3>
              <div className="flex space-x-2">
                <Badge className="bg-orange-500 text-white">All</Badge>
                <Badge variant="outline">This Weekend</Badge>
                <Badge variant="outline">Next Week</Badge>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-300 rounded-t-xl" />
                    <CardContent className="p-6 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                      <div className="h-3 bg-gray-300 rounded w-1/2" />
                      <div className="h-3 bg-gray-300 rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {(tours as any[])?.map((tour: any) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-bold text-gray-800 mb-4">Your Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tours Joined</span>
                    <span className="font-medium text-gray-800" data-testid="text-tours-joined">
                      {(user as any)?.toursJoined || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Miles Traveled</span>
                    <span className="font-medium text-gray-800" data-testid="text-miles-traveled">
                      {(user as any)?.milesTraveled || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Photos Shared</span>
                    <span className="font-medium text-gray-800" data-testid="text-photos-shared">
                      {(user as any)?.photosShared || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Feed Preview */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-800">Community Feed</h4>
                  <button className="text-orange-500 text-sm hover:underline" data-testid="button-view-feed">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentPosts.map((post: any) => (
                    <div key={post.id} className="flex space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-800 text-sm" data-testid={`text-post-author-${post.id}`}>
                            {post.user.firstName} {post.user.lastName}
                          </span>
                          <span className="text-gray-400 text-xs" data-testid={`text-post-timestamp-${post.id}`}>
                            {new Date(post.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm" data-testid={`text-post-content-${post.id}`}>
                          {post.content}
                        </p>
                        {post.imageUrl && (
                          <div className="w-full h-24 bg-gray-300 rounded-lg mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Tours Widget */}
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <h4 className="font-bold mb-2">Live Tours</h4>
                <p className="text-orange-100 text-sm mb-4">3 tours are currently active with live tracking</p>
                <Button 
                  className="bg-white text-orange-500 hover:bg-gray-100"
                  data-testid="button-view-live-tours"
                >
                  View Live Map
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <TourCreationModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
