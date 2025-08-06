import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TourCard } from "@/components/ui/tour-card";
import { ArrowLeft, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function MyTours() {
  const [, navigate] = useLocation();

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: tours, isLoading } = useQuery({
    queryKey: ['/api/tours'],
  });

  // Filter tours for current user
  const myTours = tours?.filter((tour: any) => tour.creator.id === user?.id) || [];
  const joinedTours = tours?.filter((tour: any) => 
    tour.creator.id !== user?.id && tour.memberCount > 0
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
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
              <h1 className="text-xl font-bold text-gray-800">My Tours</h1>
            </div>
            
            <Button 
              onClick={() => navigate('/')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              data-testid="button-create-new-tour"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Tour
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Created Tours */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Tours I Created</h2>
            <Badge variant="outline">{myTours.length} tours</Badge>
          </div>
          
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
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
          ) : myTours.length > 0 ? (
            <div className="space-y-6">
              {myTours.map((tour: any) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Tours Created Yet</h3>
                <p className="text-gray-600 mb-4">Start by creating your first tour to connect with fellow riders.</p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  data-testid="button-create-first-tour"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Tour
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Joined Tours */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Tours I Joined</h2>
            <Badge variant="outline">{joinedTours.length} tours</Badge>
          </div>
          
          {joinedTours.length > 0 ? (
            <div className="space-y-6">
              {joinedTours.map((tour: any) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Tours Joined Yet</h3>
                <p className="text-gray-600 mb-4">Explore available tours and join one that interests you.</p>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  data-testid="button-explore-tours"
                >
                  Explore Tours
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}