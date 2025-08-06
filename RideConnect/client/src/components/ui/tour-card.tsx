import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Route, Signal, Users, Calendar } from "lucide-react";
import { useLocation } from "wouter";

interface TourCardProps {
  tour: {
    id: string;
    title: string;
    description: string;
    startLocation: string;
    endLocation: string;
    startDate: string;
    duration: string;
    distance: string;
    difficulty: string;
    maxParticipants: number;
    currentParticipants?: number;
    memberCount: number;
    status: string;
    creator: {
      firstName: string;
      lastName: string;
    };
  };
}

export function TourCard({ tour }: TourCardProps) {
  const [, navigate] = useLocation();

  const getStatusBadge = () => {
    const participantCount = tour.currentParticipants || tour.memberCount;
    
    if (tour.status === 'closed') return <Badge className="bg-gray-500 text-white">Closed</Badge>;
    if (participantCount >= tour.maxParticipants) return <Badge className="bg-yellow-500 text-white">Full</Badge>;
    if (participantCount >= tour.maxParticipants * 0.8) return <Badge className="bg-yellow-500 text-white">Almost Full</Badge>;
    return <Badge className="bg-green-500 text-white">Open</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const participantCount = tour.currentParticipants || tour.memberCount;

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/tours/${tour.id}`)}
      data-testid={`card-tour-${tour.id}`}
    >
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-orange-400 to-orange-600" />
        <div className="absolute top-4 left-4">
          {getStatusBadge()}
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            <Users className="inline h-4 w-4 mr-1" />
            {participantCount}/{tour.maxParticipants}
          </span>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1" data-testid={`text-tour-title-${tour.id}`}>
              {tour.title}
            </h3>
            <p className="text-gray-600 text-sm" data-testid={`text-tour-route-${tour.id}`}>
              {tour.startLocation} → {tour.endLocation}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Starts</p>
            <p className="font-medium text-gray-800" data-testid={`text-tour-date-${tour.id}`}>
              {formatDate(tour.startDate)}
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 text-sm" data-testid={`text-tour-description-${tour.id}`}>
          {tour.description.length > 150 
            ? `${tour.description.substring(0, 150)}...` 
            : tour.description
          }
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600" data-testid={`text-tour-duration-${tour.id}`}>
                {tour.duration}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Route className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600" data-testid={`text-tour-distance-${tour.id}`}>
                {tour.distance}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Signal className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600" data-testid={`text-tour-difficulty-${tour.id}`}>
                {tour.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-600" data-testid={`text-tour-creator-${tour.id}`}>
              {tour.creator.firstName} {tour.creator.lastName}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
