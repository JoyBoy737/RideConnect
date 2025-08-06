import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { useLocation } from 'wouter';
import { User, Settings, Moon, Sun, Monitor, Camera, MapPin, Calendar, Award, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const [, navigate] = useLocation();

  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: userTours } = useQuery({
    queryKey: ['/api/user/tours'],
  });

  const userData = user as any;
  const tours = (userTours as any[]) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2 text-white hover:bg-white/20"
              data-testid="button-back-home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-profile-name">
                {userData?.firstName} {userData?.lastName}
              </h1>
              <p className="text-blue-100" data-testid="text-profile-username">
                @{userData?.username}
              </p>
            </div>
          </div>
          <Settings className="h-6 w-6" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-800 dark:text-white" data-testid="text-tours-joined">
                {userData?.toursJoined || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tours Joined</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-4 text-center">
              <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-800 dark:text-white" data-testid="text-miles-traveled">
                {userData?.milesTraveled || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Miles Traveled</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-4 text-center">
              <Camera className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-800 dark:text-white" data-testid="text-photos-shared">
                {userData?.photosShared || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Photos Shared</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {tours.filter((t: any) => t.createdBy === userData?.id).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tours Created</div>
            </CardContent>
          </Card>
        </div>

        {/* Theme Selection */}
        <Card className="mb-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Theme Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex items-center space-x-2"
                data-testid="button-theme-light"
              >
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex items-center space-x-2"
                data-testid="button-theme-dark"
              >
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </Button>
              <Button
                variant={theme === 'amoled' ? 'default' : 'outline'}
                onClick={() => setTheme('amoled')}
                className="flex items-center space-x-2 bg-black text-white hover:bg-gray-900"
                data-testid="button-theme-amoled"
              >
                <Moon className="h-4 w-4" />
                <span>Pure Dark</span>
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="flex items-center space-x-2"
                data-testid="button-theme-system"
              >
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tours */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Recent Tours</CardTitle>
          </CardHeader>
          <CardContent>
            {tours.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No tours joined yet. Start exploring!
              </p>
            ) : (
              <div className="space-y-4">
                {tours.slice(0, 5).map((tour: any) => (
                  <div
                    key={tour.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    data-testid={`tour-item-${tour.id}`}
                  >
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">{tour.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tour.startLocation} → {tour.endLocation}
                      </p>
                    </div>
                    <Badge variant={tour.status === 'active' ? 'default' : 'secondary'}>
                      {tour.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}