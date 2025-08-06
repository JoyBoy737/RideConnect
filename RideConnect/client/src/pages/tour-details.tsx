import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chat } from "@/components/ui/chat";
import { ArrowLeft, Calendar, MapPin, Clock, Route, Users, Star, UserPlus, Share, Heart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TourDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tour, isLoading } = useQuery({
    queryKey: ['/api/tours', id],
  });

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const joinTourMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/tours/${id}/join`),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully joined this tour!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tours', id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join tour",
        variant: "destructive",
      });
    },
  });

  const isUserMember = tour?.members?.some(member => member.user.id === user?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Tour Not Found</h1>
            <p className="text-gray-600 mb-4">The tour you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string, currentParticipants: number, maxParticipants: number) => {
    if (status === 'closed') return <Badge className="bg-gray-500 text-white">Closed</Badge>;
    if (currentParticipants >= maxParticipants) return <Badge className="bg-yellow-500 text-white">Full</Badge>;
    if (currentParticipants >= maxParticipants * 0.8) return <Badge className="bg-yellow-500 text-white">Almost Full</Badge>;
    return <Badge className="bg-green-500 text-white">Open</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Tour Details Section */}
          <div className="flex-1 overflow-y-auto">
            {/* Hero Image */}
            <div className="relative h-64">
              <div className="w-full h-full bg-gradient-to-r from-orange-400 to-orange-600" />
              <button 
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="absolute bottom-4 left-4">
                {getStatusBadge(tour.status, tour.currentParticipants, tour.maxParticipants)}
              </div>
              <div className="absolute bottom-4 right-4">
                <Badge variant="outline" className="bg-white/90 text-gray-800">
                  <Users className="h-4 w-4 mr-1" />
                  {tour.currentParticipants}/{tour.maxParticipants}
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2" data-testid="text-tour-title">
                    {tour.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span data-testid="text-tour-route">
                        {tour.startLocation} → {tour.endLocation}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span data-testid="text-tour-dates">
                        {formatDate(tour.startDate)} 
                        {tour.endDate && ` - ${formatDate(tour.endDate)}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-bold text-gray-800 mb-3">Tour Description</h2>
                <p className="text-gray-700 leading-relaxed" data-testid="text-tour-description">
                  {tour.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Route Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Distance</span>
                      <span className="font-medium" data-testid="text-tour-distance">{tour.distance}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium" data-testid="text-tour-duration">{tour.duration}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Difficulty</span>
                      <span className="font-medium" data-testid="text-tour-difficulty">{tour.difficulty}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Bike Type</span>
                      <span className="font-medium" data-testid="text-tour-bike-type">{tour.bikeType}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">Tour Leader</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-800" data-testid="text-tour-leader-name">
                        {tour.creator.firstName} {tour.creator.lastName}
                      </p>
                      <p className="text-sm text-gray-600">Tour Leader</p>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400 mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">4.9 (23 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Tour Members ({tour.members.length})</h3>
                <div className="flex flex-wrap gap-3">
                  {tour.members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-gray-800" data-testid={`text-member-name-${member.id}`}>
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        {member.role === 'creator' && (
                          <Badge variant="outline" className="text-xs">Leader</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                {!isUserMember ? (
                  <Button 
                    onClick={() => joinTourMutation.mutate()}
                    disabled={joinTourMutation.isPending || tour.currentParticipants >= tour.maxParticipants}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    data-testid="button-join-tour"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {joinTourMutation.isPending ? 'Joining...' : 'Join This Tour'}
                  </Button>
                ) : (
                  <div className="flex-1">
                    <Badge className="bg-green-500 text-white">Already Joined</Badge>
                  </div>
                )}
                <Button variant="outline" data-testid="button-share-tour">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="outline" data-testid="button-favorite-tour">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          {isUserMember && (
            <div className="w-80 border-l border-gray-200">
              <Chat tourId={tour.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
