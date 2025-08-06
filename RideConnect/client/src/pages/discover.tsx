import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TourCard } from "@/components/ui/tour-card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft, Search, Filter, MapPin, Calendar, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Discover() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: tours, isLoading } = useQuery({
    queryKey: ['/api/tours'],
  });

  // Filter tours based on search and filters
  const filteredTours = (tours as any[])?.filter((tour: any) => {
    const matchesSearch = !searchQuery || 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.endLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      tour.startLocation.toLowerCase().includes(locationFilter.toLowerCase()) ||
      tour.endLocation.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesDifficulty = !difficultyFilter || tour.difficulty === difficultyFilter;
    
    const matchesDuration = !durationFilter || tour.duration === durationFilter;

    return matchesSearch && matchesLocation && matchesDifficulty && matchesDuration;
  }) || [];

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setDifficultyFilter("");
    setDurationFilter("");
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
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Discover Tours</h1>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <Card className="mb-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tours by title, location..."
                className="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                data-testid="input-search-tours"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Location</label>
                  <Input
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Filter by location..."
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    data-testid="input-filter-location"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Difficulty</label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" data-testid="select-difficulty">
                      <SelectValue placeholder="Any difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Duration</label>
                  <Select value={durationFilter} onValueChange={setDurationFilter}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" data-testid="select-duration">
                      <SelectValue placeholder="Any duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-day">1 Day</SelectItem>
                      <SelectItem value="2-3-days">2-3 Days</SelectItem>
                      <SelectItem value="1-week">1 Week</SelectItem>
                      <SelectItem value="2-weeks">2+ Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {filteredTours.length} Tours Found
          </h2>
          <div className="flex space-x-2">
            {searchQuery && (
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Search: {searchQuery}
              </Badge>
            )}
            {locationFilter && (
              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Location: {locationFilter}
              </Badge>
            )}
            {difficultyFilter && (
              <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                {difficultyFilter}
              </Badge>
            )}
            {durationFilter && (
              <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                {durationFilter}
              </Badge>
            )}
          </div>
        </div>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTours.length === 0 ? (
          <Card className="text-center py-12 bg-white dark:bg-gray-900">
            <CardContent>
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">No tours found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters} data-testid="button-clear-all-filters">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour: any) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}