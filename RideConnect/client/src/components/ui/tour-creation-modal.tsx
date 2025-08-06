import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const tourFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
  startDate: z.string().min(1, "Start date is required"),
  duration: z.string().min(1, "Duration is required"),
  distance: z.string().min(1, "Distance is required"),
  maxParticipants: z.number().min(2, "At least 2 participants required").max(50, "Too many participants"),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]),
  bikeType: z.string().default("Any"),
});

type TourFormData = z.infer<typeof tourFormSchema>;

interface TourCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TourCreationModal({ open, onOpenChange }: TourCreationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startLocation: "",
      endLocation: "",
      startDate: "",
      duration: "1 Day",
      distance: "",
      maxParticipants: 10,
      difficulty: "Moderate",
      bikeType: "Any",
    },
  });

  const createTourMutation = useMutation({
    mutationFn: (data: TourFormData) => apiRequest('POST', '/api/tours', data),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Tour created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tours'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tour",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TourFormData) => {
    createTourMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Tour</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Pacific Coast Adventure" {...field} data-testid="input-tour-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} data-testid="input-start-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} data-testid="input-end-location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-start-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1 Day">1 Day</SelectItem>
                        <SelectItem value="2 Days">2 Days</SelectItem>
                        <SelectItem value="3 Days">3 Days</SelectItem>
                        <SelectItem value="4 Days">4 Days</SelectItem>
                        <SelectItem value="5+ Days">5+ Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 450 miles" {...field} data-testid="input-distance" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={4} 
                      placeholder="Describe your tour, what makes it special, and what riders can expect..." 
                      {...field} 
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="2" 
                        max="50" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-max-participants"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Challenging">Challenging</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bikeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bike Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-bike-type">
                          <SelectValue placeholder="Select bike type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Any">Any</SelectItem>
                        <SelectItem value="Sport">Sport</SelectItem>
                        <SelectItem value="Cruiser">Cruiser</SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Touring">Touring</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-tour"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                disabled={createTourMutation.isPending}
                data-testid="button-create-tour-submit"
              >
                {createTourMutation.isPending ? 'Creating...' : 'Create Tour'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
