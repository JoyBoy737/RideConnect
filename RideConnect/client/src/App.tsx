import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Home from "@/pages/home";
import TourDetails from "@/pages/tour-details";
import MyTours from "@/pages/my-tours";
import Community from "@/pages/community";
import Map from "@/pages/map";
import Profile from "@/pages/profile";
import Discover from "@/pages/discover";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tours/:id" component={TourDetails} />
      <Route path="/my-tours" component={MyTours} />
      <Route path="/community" component={Community} />
      <Route path="/map" component={Map} />
      <Route path="/profile" component={Profile} />
      <Route path="/discover" component={Discover} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
